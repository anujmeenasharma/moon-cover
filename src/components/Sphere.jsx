import { OrbitControls } from "@react-three/drei";
import { SphereParticles } from "./SphereParticles";

export const Sphere = ({ active = true, onBloomUpdate }) => {
  return (
    <>
      {/* <Environment preset="warehouse" /> */}
      {/* <OrbitControls /> */}
      <SphereParticles active={active} onBloomUpdate={onBloomUpdate} />
      {/* <mesh>
        <boxGeometry />
        <meshStandardMaterial color="hotpink" />
      </mesh> */}
    </>
  );
};