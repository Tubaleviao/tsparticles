import { ColorUtils, Container, ICoordinates, Particle } from "tsparticles";

export function drawLight(container: Container, context: CanvasRenderingContext2D, mousePos: ICoordinates): void {
    const lightOptions = container.actualOptions.interactivity.modes.light.area;

    context.beginPath();
    context.arc(mousePos.x, mousePos.y, lightOptions.radius, 0, 2 * Math.PI);

    const gradientAmbientLight = context.createRadialGradient(
        mousePos.x,
        mousePos.y,
        0,
        mousePos.x,
        mousePos.y,
        lightOptions.radius
    );

    const lightGradient = lightOptions.gradient;
    const gradientRgb = {
        start: ColorUtils.colorToRgb(lightGradient.start),
        stop: ColorUtils.colorToRgb(lightGradient.stop),
    };

    if (!gradientRgb.start || !gradientRgb.stop) {
        return;
    }

    gradientAmbientLight.addColorStop(0, ColorUtils.getStyleFromRgb(gradientRgb.start));
    gradientAmbientLight.addColorStop(1, ColorUtils.getStyleFromRgb(gradientRgb.stop));
    context.fillStyle = gradientAmbientLight;
    context.fill();
}

export function drawParticleShadow(
    container: Container,
    context: CanvasRenderingContext2D,
    particle: Particle,
    mousePos: ICoordinates
): void {
    const pos = particle.getPosition();
    const shadowOptions = container.actualOptions.interactivity.modes.light.shadow;

    context.save();

    const radius = particle.getRadius();
    const sides = particle.sides;
    const full = (Math.PI * 2) / sides;
    const angle = -particle.rotate.value + Math.PI / 4;
    const factor = 1; //Math.sqrt(2);
    const dots = [];

    for (let i = 0; i < sides; i++) {
        dots.push({
            x: pos.x + radius * Math.sin(angle + full * i) * factor,
            y: pos.y + radius * Math.cos(angle + full * i) * factor,
        });
    }

    const points = [];

    const shadowLength = shadowOptions.length;

    for (const dot of dots) {
        const dotAngle = Math.atan2(mousePos.y - dot.y, mousePos.x - dot.x);
        const endX = dot.x + shadowLength * Math.sin(-dotAngle - Math.PI / 2);
        const endY = dot.y + shadowLength * Math.cos(-dotAngle - Math.PI / 2);

        points.push({
            endX: endX,
            endY: endY,
            startX: dot.x,
            startY: dot.y,
        });
    }

    const shadowRgb = ColorUtils.colorToRgb(shadowOptions.color);

    if (!shadowRgb) {
        return;
    }

    const shadowColor = ColorUtils.getStyleFromRgb(shadowRgb);

    for (let i = points.length - 1; i >= 0; i--) {
        const n = i == points.length - 1 ? 0 : i + 1;

        context.beginPath();

        context.moveTo(points[i].startX, points[i].startY);

        context.lineTo(points[n].startX, points[n].startY);
        context.lineTo(points[n].endX, points[n].endY);
        context.lineTo(points[i].endX, points[i].endY);

        context.fillStyle = shadowColor;

        context.fill();
    }

    context.restore();
}
