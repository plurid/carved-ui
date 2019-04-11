export function shadowPositioning(shadowAngle: number, shadowDistance: number) {
    const { horizontal, vertical } = computeShadowPositioning(shadowAngle, shadowDistance);
    const horizontalShadowPosition = horizontal;
    const verticalShadowPosition = vertical;

    return {
        horizontalShadowPosition,
        verticalShadowPosition,
    }
}

function computeShadowPositioning(angle: number, distance: number) {
    angle = angle * ((Math.PI) / 180);
    let horizontal = Math.round(distance * Math.cos(angle));
    let vertical = Math.round(distance * Math.sin(angle));

    return {
        horizontal,
        vertical,
    };
}
