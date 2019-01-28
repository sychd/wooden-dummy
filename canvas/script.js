window.onload = main;
const el = (selector, host = document) => host.querySelector(selector);

function main() {
    canvasWithPaths();
    canvasWithGradientFill();
    canvasWithArcTo();
}

function canvasWithArcTo() {
    const ctx = prepareCanvas('canvasArcTo');

    ctx.strokeStyle = 'gray';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(40, 50);
    ctx.lineTo(60, 30);
    ctx.stroke();
    ctx.strokeStyle = 'black';
    ctx.fillStyle = 'orange';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.arcTo(40, 50, 60, 30, 5);
    ctx.stroke();

    const arc = {
        x: 250,
        y: 80,
        r: 40,
        startAngle: 0,
        endAngle: 1.5 * Math.PI
    };
    
    ctx.beginPath();
    
    ctx.arc(arc.x, arc.y, arc.r, arc.startAngle, arc.endAngle, true);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(arc.x - 5, arc.y + 5, arc.r, arc.startAngle, arc.endAngle);
    ctx.fill();
    ctx.stroke();
}

function canvasWithGradientFill() {
    const ctx = prepareCanvas('canvasGradient');
    drawRectsWithGradientFill(ctx);
}

function drawRectsWithGradientFill(ctx) {
    const arc = {
        x: 250,
        y: 80,
        r: 40,
        startAngle: 0,
        endAngle: 2 * Math.PI
    };
    const rect = {
        point: new Point(50, 50),
        size: new Size(50, 70)
    };
    const gradientShift = 100;
    const gradientPoint = {
        x0: rect.point.x,
        y0: rect.point.y,
        x1: rect.point.x + gradientShift,
        y1: rect.point.y + gradientShift
    };
    ctx.save();

    ctx.lineWidth = 12;
    ctx.lineJoin = 'bevel';
    const gradientRect = ctx.createLinearGradient(gradientPoint.x0, gradientPoint.y0, gradientPoint.x1, gradientPoint.y1);
    addColorStops(gradientRect);
    ctx.strokeStyle = gradientRect;
    ctx.strokeRect(rect.point.x, rect.point.y, rect.size.width, rect.size.height);

    ctx.restore();
    ctx.arc(arc.x, arc.y, arc.r, arc.startAngle, arc.endAngle);
    const gradientRadial = ctx.createRadialGradient(arc.x, arc.y, 40, arc.x, arc.y, 5); //random
    addColorStops(gradientRadial);
    ctx.fillStyle = gradientRadial;
    ctx.stroke();
    ctx.fill();

    function addColorStops(gradient) {
        gradient.addColorStop('0', 'magenta');
        gradient.addColorStop('.25', 'blue');
        gradient.addColorStop('.50', 'green');
        gradient.addColorStop('1.0', 'red');
    }
}

function canvasWithPaths() {
    const ctx = prepareCanvas('canvasPath');

    drawTriangle(ctx);
    drawTriangle(ctx, 150, true);
}

function drawTriangle(ctx, shiftX = 0, strokeFirst = false) {
    const point = {
        top: new Point(100 + shiftX, 50),
        right: new Point(150 + shiftX, 100),
        left: new Point(50 + shiftX, 100)
    };

    ctx.fillStyle = "cyan";
    ctx.strokeStyle = "salmon";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(point.top.x, point.top.y);
    ctx.stroke();
    ctx.lineTo(point.right.x, point.right.y);
    ctx.stroke();
    ctx.lineTo(point.left.x, point.left.y);
    ctx.stroke();
    ctx.lineTo(point.top.x, point.top.y);
    ctx.closePath();

    if (strokeFirst) {
        ctx.stroke();
        ctx.fill();
    } else {
        ctx.fill();
        ctx.stroke();
    }
}

function prepareCanvas(id) {
    const canvasEl = el(`#${id}`);
    const ctx = canvasEl.getContext('2d');
    canvasEl.height = 150;
    canvasEl.width = 400;

    return ctx;
}

function Point(x, y) {
    return {
        x,
        y
    };
}

function Size(width, height) {
    return {
        width,
        height
    };
}