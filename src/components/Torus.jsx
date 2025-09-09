import { TorusParticles } from "./TorusParticles";

export const Torus = ({ active = true, onBloomUpdate }) => {
  return (
    <>
      <TorusParticles active={active} onBloomUpdate={onBloomUpdate} />
    </>
  );
};
