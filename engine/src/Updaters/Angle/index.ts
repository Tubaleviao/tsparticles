import type { Main } from "../../main";
import { AngleUpdater } from "./AngleUpdater";

export function loadAngleUpdater(tsParticles: Main): void {
    tsParticles.addParticleUpdater("angle", () => new AngleUpdater());
}
