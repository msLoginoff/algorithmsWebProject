function windowToCanvas(canvas, x, y) {
    let bbox = canvas.getBoundingClientRect();
    return { x: x - bbox.left * (canvas.width / bbox.width), y: y - bbox.top * (canvas.height / bbox.height) };
}