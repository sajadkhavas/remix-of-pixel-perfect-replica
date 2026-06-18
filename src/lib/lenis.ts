import Lenis from "@studio-freight/lenis";

let lenisInstance: Lenis | null = null;

export function initLenis() {
  if (typeof window === "undefined" || lenisInstance) return;
  lenisInstance = new Lenis({
    duration: 1.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time: number) {
    lenisInstance?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
