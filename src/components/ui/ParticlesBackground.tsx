import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

const GOLD_DUST_CONFIG: ISourceOptions = {
  background: { color: { value: "transparent" } },
  fpsLimit: 60,
  particles: {
    number: { value: 28, density: { enable: true } },
    color: { value: ["#C9A84C", "#E8C96C", "#9A7A2E", "#D4C9B0"] },
    shape: { type: ["circle"] },
    opacity: {
      value: { min: 0.03, max: 0.18 },
      animation: { enable: true, speed: 0.4, sync: false },
    },
    size: {
      value: { min: 0.5, max: 2 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    links: { enable: false },
    move: {
      enable: true,
      speed: 0.2,
      direction: "top",
      random: true,
      outModes: { default: "out" },
      drift: 0.2,
    },
  },
  interactivity: {
    events: { onHover: { enable: true, mode: "bubble" } },
    modes: { bubble: { distance: 100, size: 2.5, opacity: 0.25, duration: 1 } },
  },
  detectRetina: true,
};

export function ParticlesBackground() {
  const [init, setInit] = useState(false);
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);
  if (!init) return null;
  return (
    <Particles
      id="gold-dust"
      options={GOLD_DUST_CONFIG}
      className="absolute inset-0 pointer-events-none z-0"
    />
  );
}
