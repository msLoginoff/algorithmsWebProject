{
    let coords = [];
    let matr = [];
    let size = 20;
    let minWay = [];
    let canvas = document.getElementById('canvas3');
    let ctx = canvas.getContext('2d');
    canvas.width = document.getElementsByClassName('tab').tab.offsetWidth-4;
    canvas.height = window.innerHeight-150;
    let kw = canvas.width;
    let kh = canvas.height;
    
    canvas.addEventListener('mousedown',
    function(e)
    {
        let loc = windowToCanvas(canvas, e.clientX, e.clientY);
        let k = true;
        for (let i = 0; i<coords.length; i++)
        {
            if (Math.abs(loc.x - coords[i][0]) <= size*2 & Math.abs(loc.y - coords[i][1]) <= size*2) {k = false; break;}
        }
        if (k == true)
        {
            coords.push([loc.x, loc.y, coords.length]);
            matr.push([]);
            minWay = [];
            draw(minWay);
        }
    });

    function resizeCanvas() {
        canvas.width = document.getElementsByClassName('tab').tab.offsetWidth-4;
        canvas.height = window.innerHeight-150;
        size *= (canvas.width + canvas.height)/(kw+kh);
        draw(minWay);
        kw = canvas.width;
        kh = canvas.height;
    }

    window.addEventListener('resize', resizeCanvas, false);

    function findIn(arr, target)
    {
        for (let i = 0; i<arr.length; i++)
        {
            if (arr[i] == target) return true;
        }
        return false;
    }
    function find(arr, target)
    {
        for (let i = 0; i<arr.length; i++)
        {
            if (arr[i] == target) return i;
        }
        return -1;
    }
    function sum(arr)
    {
        let sum = 0;
        if (arr.length>0)
        {
            for (let i = 1; i<arr.length; i++)
            {
                sum+=Math.hypot(coords[arr[i-1]][0] - coords[arr[i]][0], coords[arr[i-1]][1] - coords[arr[i]][1]);
            }
            sum += Math.hypot(coords[arr[arr.length-1]][0] - coords[arr[0]][0], coords[arr[arr.length-1]][1] - coords[arr[0]][1]);
        }
        return sum;
    }

    function draw(Way)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (i = 0; i<coords.length; i++)
        {
            coords[i][0]*=canvas.width/kw;
            coords[i][1]*=canvas.height/kh;
        }

        if (Way == minWay) ctx.strokeStyle = 'red';
        else ctx.strokeStyle = 'black';
        ctx.fillStyle = 'red';
        ctx.lineWidth = size/4;
        ctx.font = String(size) + "px sans-serif";

        if (Way.length > 0)
        {
            for (j = 1; j<Way.length; j++)
            {
                ctx.moveTo(coords[Way[j-1]][0], coords[Way[j-1]][1]);
                ctx.lineTo(coords[Way[j]][0], coords[Way[j]][1]);
                ctx.stroke();
                ctx.beginPath();
            }
            ctx.moveTo(coords[Way[Way.length-1]][0], coords[Way[Way.length-1]][1]);
            ctx.lineTo(coords[Way[0]][0], coords[Way[0]][1]);
            ctx.stroke();
            ctx.beginPath();
        }

        ctx.fillStyle = 'black';
        ctx.beginPath();

        for (i = 0; i<coords.length; i++)
        {
            ctx.arc(coords[i][0], coords[i][1], size, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
        }
        if (Way == minWay & Way.length>0) document.getElementById('Way').style.color = 'black';
        else document.getElementById('Way').style.color = 'white';
        document.getElementById('Way').value = String(Math.ceil(sum(Way)));

        ctx.font = String(size) + "px sans-serif";
        ctx.fillStyle = 'white';
        for (i = 0; i<coords.length; i++)
        {
            ctx.fillText(String(i+1), coords[i][0]-size*String(i+1).length/4, coords[i][1]+size*String(i+1).length/4);
        }

        ctx.fillStyle = 'black';
        ctx.beginPath();
    }

    function runAntAlg()
    {
        let pheromones = new Array(coords.length);
        for (let k = 0; k<pheromones.length; k++)
        {
            pheromones[k] = new Array(coords.length).fill(0.2);
        }

        for (let k = 0; k<coords.length*20; k++)
        {
            matr = [];
            for (let i = 0; i<coords.length; i++)
            {
                let toVisit = coords.slice(0);
                let currentVertex = i;

                toVisit.splice(currentVertex, 1);
                matr.push([i]);
                while (toVisit.length > 0)
                {
                    let chances = Array(toVisit.length);
    
                    chances[0] = (400/Math.hypot(coords[currentVertex][0] - coords[toVisit[0][2]][0], coords[currentVertex][1] - coords[toVisit[0][2]][1]))**4 * pheromones[currentVertex][toVisit[0][2]];
                    for (let j = 1; j<chances.length; j++)
                    {
                        chances[j] = (400/Math.hypot(coords[currentVertex][0] - coords[toVisit[j][2]][0], coords[currentVertex][1] - coords[toVisit[j][2]][1]))**4 * pheromones[currentVertex][toVisit[j][2]] + chances[j-1];
                    }
    
                    let antDirection = Math.random()*chances[chances.length-1];
                    for (let j = 0; j<chances.length; j++)
                    {
                        if (antDirection <= chances[j]) {currentVertex = toVisit[j][2]; break;}
                    }
                    matr[i].push(currentVertex);
                    for (let j = 0; j<toVisit.length; j++)
                    {
                        if (currentVertex == toVisit[j][2]) {toVisit.splice(j, 1); break;}
                    }
                }
            }


            let L = [];
            let av = 0;
            for (let i = 0; i<matr.length; i++)
            {
                L.push(0);
                for (let j = 0; j<matr[i].length; j++)
                {
                    pheromones[i][j] *= 0.6;
                }
                L[i] = sum(matr[i]);
                av += L[i];
                if (sum(minWay) > L[i] || sum(minWay) == 0)
                {
                    minWay = matr[i];
                }
            }
            av/=L.length;
            for (let i = 0; i<matr.length; i++)
            {
                for (let j = 1; j<matr[i].length; j++)
                {
                    pheromones[matr[i][j-1]][matr[i][j]] += L[i]/av * 10;
                    pheromones[matr[i][j]][matr[i][j-1]] += L[i]/av * 10;
                }
                pheromones[matr[i][matr.length-1]][matr[i][0]] += L[i]/av * 10;
                pheromones[matr[i][0]][matr[i][matr.length-1]] += L[i]/av * 10;
            }
        }
        let i = 0;
        let time = 500;

        setTimeout(function run() {
            draw(matr[i++]);
            if (i < matr.length) setTimeout(run, time*=4/5);
            else draw(minWay);
        }, 0);

    }
}