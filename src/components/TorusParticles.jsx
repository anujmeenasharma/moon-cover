import { extend, useFrame, useThree } from "@react-three/fiber";
import { useControls } from "leva";
import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lerp, randInt } from "three/src/math/MathUtils.js";

import { Fn } from "three/src/nodes/TSL.js";
import {
  ceil,
  color,
  deltaTime,
  hash,
  If,
  instancedArray,
  instanceIndex,
  length,
  min,
  mix,
  mx_fractal_noise_vec3,
  range,
  saturate,
  smoothstep,
  sqrt,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  vec4,
} from "three/tsl";
import {
  AdditiveBlending,
  Color,
  DataTexture,
  FloatType,
  RGBAFormat,
  TorusGeometry,
  SpriteNodeMaterial,
} from "three/webgpu";

const randValue = /*#__PURE__*/ Fn(({ min, max, seed = 42 }) => {
  return hash(instanceIndex.add(seed)).mul(max.sub(min)).add(min);
});

const MODEL_COLORS = {
  Small: {
    start: "#FF6B1A",
    end: "#D1E40F",
    emissiveIntensity: 0.1,
  },
  Medium: {
    start: "#FF6B1A",
    end: "#D1E40F",
    emissiveIntensity: 0.08,
  },
  Large: {
    start: "#FF6B1A",
    end: "#D1E40F",
    emissiveIntensity: 0.6,
  },
};

const tmpColor = new Color();

export const TorusParticles = ({ nbParticles = 600000, active = true, onBloomUpdate }) => {
  const { curGeometry, startColor, endColor, debugColor, emissiveIntensity, emissiveBoost, torusPositionX, torusPositionY, torusPositionZ } =
    useControls("Torus", {
      curGeometry: {
        options: ["Medium"],
        value: "Medium",
      },
      startColor: "#FF6B1A",
      endColor: "#D1E40F",
      emissiveIntensity: 0.1,
      emissiveBoost: { value: 1.5, min: 0, max: 4, step: 0.05 },
      debugColor: false,
      torusPositionX: { value: 0, min: -10, max: 10, step: 0.1 },
      torusPositionY: { value: 0, min: -10, max: 10, step: 0.1 },
      torusPositionZ: { value: 5, min: -10, max: 10, step: 0.1 },
    });

  const groupRef = useRef();
  const invalidate = useThree((state) => state.invalidate);
  const emissiveBoostScrollRef = useRef(1);

  useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  if (!groupRef.current) return;

  const onLoadOrResize = () => ScrollTrigger.refresh();

  const ctx = gsap.context(() => {
    // Create a single timeline for all position animations
    const masterTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top -8600px",
        end: "+=2000", // Total scroll distance for all phases
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: () => invalidate(),
      },
    });

    // Set initial position (offset from sphere)
    gsap.set(groupRef.current.position, { y: 0.8, z: 5, x: 0 });

    // Phase 1: Move to center and rotate (0 to 2500 scroll units)
    masterTimeline.to(groupRef.current.position, {
        z: -0.5,
        duration: 500, // Corresponds to +=2500 scroll units
        ease: "none",
      })
  });

  window.addEventListener("load", onLoadOrResize);
  window.addEventListener("resize", onLoadOrResize);
  requestAnimationFrame(() => ScrollTrigger.refresh());

  return () => {
    window.removeEventListener("load", onLoadOrResize);
    window.removeEventListener("resize", onLoadOrResize);
    ctx.revert();
  };
  }, []);

  const geometries = useMemo(() => {
    const geometries = [];
    const torusParams = {
      Small: { radius: 1.2, tube: 0.3, radialSegments: 32, tubularSegments: 128 },
      Medium: { radius: 2.5, tube: 0.8, radialSegments: 64, tubularSegments: 256 },
      Large: { radius: 1.8, tube: 0.6, radialSegments: 64, tubularSegments: 256 },
    }[curGeometry];

    const torusGeometry = new TorusGeometry(
      torusParams.radius,
      torusParams.tube,
      torusParams.radialSegments,
      torusParams.tubularSegments
    );
    
    // Apply position offset to the geometry
    torusGeometry.translate(torusPositionX, torusPositionY, torusPositionZ);
    
    geometries.push(torusGeometry);
    
    return geometries;
  }, [curGeometry, torusPositionX, torusPositionY, torusPositionZ]);

  const targetPositionsTexture = useMemo(() => {
    const size = Math.ceil(Math.sqrt(nbParticles)); // Make a square texture
    const data = new Float32Array(size * size * 4);

    for (let i = 0; i < nbParticles; i++) {
      data[i * 4 + 0] = 0; // X
      data[i * 4 + 1] = 0; // Y
      data[i * 4 + 2] = 0; // Z
      data[i * 4 + 3] = 1; // Alpha (not needed, but required for 4-component format)
    }

    const texture = new DataTexture(data, size, size, RGBAFormat, FloatType);
    return texture;
  }, [nbParticles]);

  useEffect(() => {
    if (geometries.length === 0) return;
    for (let i = 0; i < nbParticles; i++) {
      const geometryIndex = randInt(0, geometries.length - 1);
      const randomGeometryIndex = randInt(
        0,
        geometries[geometryIndex].attributes.position.count - 1
      );
      targetPositionsTexture.image.data[i * 4 + 0] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 0
        ];
      targetPositionsTexture.image.data[i * 4 + 1] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 1
        ];
      targetPositionsTexture.image.data[i * 4 + 2] =
        geometries[geometryIndex].attributes.position.array[
          randomGeometryIndex * 3 + 2
        ];
      targetPositionsTexture.image.data[i * 4 + 3] = 1;
    }
    targetPositionsTexture.needsUpdate = true;
  }, [geometries]);

  const gl = useThree((state) => state.gl);

  const { nodes, uniforms, computeUpdate } = useMemo(() => {
    // uniforms
    const uniforms = {
      color: uniform(color(startColor)),
      endColor: uniform(color(endColor)),
      emissiveIntensity: uniform(emissiveIntensity),
      emissiveBoost: uniform(1.0),
      particleOpacity: uniform(0.6),
    };

    // buffers
    const spawnPositionsBuffer = instancedArray(nbParticles, "vec3");
    const offsetPositionsBuffer = instancedArray(nbParticles, "vec3");
    const agesBuffer = instancedArray(nbParticles, "float");

    const spawnPosition = spawnPositionsBuffer.element(instanceIndex);
    const offsetPosition = offsetPositionsBuffer.element(instanceIndex);
    const age = agesBuffer.element(instanceIndex);

    // init Fn
    const lifetime = randValue({ min: 0.1, max: 6, seed: 13 });

    const computeInit = Fn(() => {
      spawnPosition.assign(
        vec3(
          randValue({ min: -3, max: 3, seed: 0 }),
          randValue({ min: -3, max: 3, seed: 1 }),
          randValue({ min: -3, max: 3, seed: 2 })
        )
      );
      offsetPosition.assign(0);
      age.assign(randValue({ min: 0, max: lifetime, seed: 11 }));
    })().compute(nbParticles);

    gl.computeAsync(computeInit);

    const instanceSpeed = randValue({ min: 0.01, max: 0.05, seed: 12 });
    const offsetSpeed = randValue({ min: 0.1, max: 0.5, seed: 14 });

    // Texture data
    const size = ceil(sqrt(nbParticles));
    const col = instanceIndex.modInt(size).toFloat();
    const row = instanceIndex.div(size).toFloat();
    const x = col.div(size.toFloat());
    const y = row.div(size.toFloat());
    const targetPos = texture(targetPositionsTexture, vec2(x, y)).xyz;

    // update Fn
    const computeUpdate = Fn(() => {
      const distanceToTarget = targetPos.sub(spawnPosition);
      If(distanceToTarget.length().greaterThan(0.01), () => {
        spawnPosition.addAssign(
          distanceToTarget
            .normalize()
            .mul(min(instanceSpeed, distanceToTarget.length()))
        );
      });
      offsetPosition.addAssign(
        mx_fractal_noise_vec3(spawnPosition.mul(age))
          .mul(offsetSpeed)
          .mul(deltaTime)
      );

      age.addAssign(deltaTime);

      If(age.greaterThan(lifetime), () => {
        age.assign(0);
        offsetPosition.assign(0);
      });
    })().compute(nbParticles);

    const scale = vec3(range(0.001, 0.01));
    const particleLifetimeProgress = saturate(age.div(lifetime));

    const colorNode = vec4(
      mix(uniforms.color, uniforms.endColor, particleLifetimeProgress),
      uniforms.particleOpacity
    );

    // Transform the particles to a circle
    const dist = length(uv().sub(0.5));
    const circle = smoothstep(0.5, 0.49, dist);
    const finalColor = colorNode.mul(circle);

    // Add a random offset to the particles
    const randOffset = vec3(
      range(-0.001, 0.001),
      range(-0.001, 0.001),
      range(-0.001, 0.001)
    );

    return {
      uniforms,
      computeUpdate,
      nodes: {
        positionNode: spawnPosition.add(offsetPosition).add(randOffset),
        colorNode: finalColor,
        emissiveNode: finalColor.mul(uniforms.emissiveIntensity).mul(uniforms.emissiveBoost),
        scaleNode: scale.mul(smoothstep(1, 0, particleLifetimeProgress)),
      },
    };
  }, []);

  const lerpedStartColor = useRef(new Color(MODEL_COLORS[curGeometry].start));
  const lerpedEndColor = useRef(new Color(MODEL_COLORS[curGeometry].end));

  useFrame((_, delta) => {
    if (!active) return;
    gl.compute(computeUpdate);

    tmpColor.set(debugColor ? startColor : MODEL_COLORS[curGeometry].start);
    lerpedStartColor.current.lerp(tmpColor, delta);
    tmpColor.set(debugColor ? endColor : MODEL_COLORS[curGeometry].end);
    lerpedEndColor.current.lerp(tmpColor, delta);
    uniforms.color.value.set(lerpedStartColor.current);
    uniforms.endColor.value.set(lerpedEndColor.current);

    uniforms.emissiveIntensity.value = lerp(
      uniforms.emissiveIntensity.value,
      debugColor
        ? emissiveIntensity
        : MODEL_COLORS[curGeometry].emissiveIntensity,
      delta
    );
    // Combine UI boost with scroll multiplier so it increases on scroll
    uniforms.emissiveBoost.value = emissiveBoost * emissiveBoostScrollRef.current;
    
    // Pass bloom values to parent component for processing
    if (onBloomUpdate) {
      onBloomUpdate({
        strength: emissiveBoost * emissiveBoostScrollRef.current * 2, // Scale for bloom strength
        radius: 1.0, // Can be made dynamic if needed
        threshold: 0.0 // Can be made dynamic if needed
      });
    }
  });

  return (
    <>
      <group ref={groupRef} visible={active}>
        <sprite count={nbParticles}>
          <spriteNodeMaterial
            {...nodes}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </sprite>
      </group>
    </>
  );
};

extend({ SpriteNodeMaterial });
