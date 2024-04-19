function DCanvas(el) {
    let canvasVariable = document.getElementById('canv');
    const ctx = el.getContext('2d');
    const pixels = 10;

    let IsMouseDown = false;

    canvasVariable.width = 350;
    canvasVariable.height = 350;
    this.clear = function () {
        ctx.clearRect(0, 0, canvasVariable.width, canvasVariable.height);
    }

    this.calculate = function () {
        ctx.scale(0.1, 0.1);
        const w = canvasVariable.width;

        const h = canvasVariable.height;
        const p = 50;

        const xStep = w / p;
        const yStep = h / p;

        const vector = [];
        let data = [];
        let counter = 0;

        for ( let y = 0; y < h; y += yStep) {
            for (let x = 0; x < w; x += xStep) {
                data[counter] = ctx.getImageData(x, y, xStep, yStep);
                vector.push(data[counter++].data[3] / 255)
            }
        }

        /*for (let i = 0; i < p + 1; i++) {
            vector.pop()
        }*/

        // let tmp = 0;
        // for (let i = 0; i < p; i++) {
        //     vector.splice((p + 1) * i + p - tmp, 1);
        //     tmp++;
        // }

        ctx.scale(10, 10);
        return vector;
    }

    el.addEventListener('mousedown', function () {
        IsMouseDown = true;
        ctx.beginPath();
    })

    el.addEventListener('mouseup', function () {
        IsMouseDown = false;
    })

    el.addEventListener('mousemove', function (e) {
        if (IsMouseDown) {
            ctx.fillStyle = '#ff8800';
            ctx.strokeStyle = '#ff8800';
            ctx.lineWidth = 30//pixels + 20;

            ctx.lineTo(e.offsetX, e.offsetY);
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(e.offsetX, e.offsetY, 30 / 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(e.offsetX, e.offsetY);
        }
    })

}


const currentCanvas = new DCanvas(document.getElementById('canv'));

let vectorTest;
document.addEventListener('keypress', function (e) {
    if (e.key.toLowerCase() === 'c') {
        currentCanvas.clear();
    }

    if (e.key.toLowerCase() === 'v') {
        vectorTest = currentCanvas.calculate();
    }

    if (e.key.toLowerCase() === 's') {
        getNumberResult();
    }
})




