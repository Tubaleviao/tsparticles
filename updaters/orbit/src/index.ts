import type { Main } from "tsparticles";
import { OrbitUpdater } from "./OrbitUpdater";

export function loadOrbitUpdater(tsParticles: Main): void {
    tsParticles.addParticleUpdater("orbit", () => new OrbitUpdater());
}
