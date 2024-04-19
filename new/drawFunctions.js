import { Point, canvasElements, RADIUS, points, centroids, noise } from "./clusteringAlgPage.js";
export { drawCircle, animatePoint, animateClusterColoring, animateCentroidColoring, animateNoisyPointColoring, redrawCanvas }

const COLORS = ["aqua", "aquamarine", "burlywood", "cadetblue", "chartreuse", "chocolate", "crimson", "darkblue",
    "deeppink", "forestgreen", "gold", "firebrick", "green", "indigo", "lightgray", "lightgreen",
    "lightseagreen", "limegreen", "magenta", "mediumpurple", "mistyrose", "olive", "orange", "purple",
    "red", "slategray", "tomato", "yellow", "yellowgreen", "darkslategray", "white"
];
const ANIMATION_DURATION = 90;

function drawCircle(color, point, ctx) {
    ctx.beginPath()
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = color
    ctx.fill()
}

function drawCross(color, crossSize, lineWidth, point, ctx){
  ctx.beginPath();
  ctx.moveTo(point.x - crossSize, point.y - crossSize);
  ctx.lineTo(point.x + crossSize, point.y + crossSize);
  ctx.moveTo(point.x + crossSize, point.y - crossSize);
  ctx.lineTo(point.x - crossSize, point.y + crossSize);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

async function animatePoint(x, y, color, ctx) {
    return new Promise((resolve) => {
      let startTime = null
  
      function animation(timestamp) {
        if (!startTime) startTime = timestamp
        const progress = timestamp - startTime
        const radius = (progress / ANIMATION_DURATION) * RADIUS
  
        drawCircle(color, new Point(x, y, radius), ctx)
        if (progress < ANIMATION_DURATION) {
          requestAnimationFrame(animation)
        } else {
          resolve()
        }
      }
      requestAnimationFrame(animation)
    })
}
  
async function animateCentroid(x, y, color) {
  return new Promise((resolve) => {
      let startTime = null;

      function animation(timestamp) {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const radius = (progress / ANIMATION_DURATION) * RADIUS
          const crossSize = (progress / ANIMATION_DURATION) * (RADIUS - 3)

          drawCircle(color, new Point(x, y, radius), canvasElements[0].ctx)
          drawCross('white', crossSize, 2, new Point(x, y, radius), canvasElements[0].ctx)
          if (progress < ANIMATION_DURATION) {
              requestAnimationFrame(animation);
          } else {
              resolve();
          }
      }
      requestAnimationFrame(animation);
  });
}

async function animateNoisyPoint(x, y) {
  return new Promise((resolve) => {
    let startTime = null

    function animation(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const radius = (progress / ANIMATION_DURATION) * RADIUS
      const crossSize = (progress / ANIMATION_DURATION) * (RADIUS - 3)

      drawCircle('black', new Point(x, y, radius), canvasElements[2].ctx)
      drawCross('white', crossSize, 2, new Point(x, y, radius), canvasElements[2].ctx)
      if (progress < ANIMATION_DURATION) {
        requestAnimationFrame(animation)
      } else {
        resolve()
      }
    }
    requestAnimationFrame(animation)
  })
}

async function animateClusterColoring(clusters, ctx) {
    for (let i = 0; i < clusters.length; i++) {
      let colorIndex = Math.floor((Math.random() * COLORS.length / clusters.length) + (COLORS.length / clusters.length * i))

      for (let j = 0; j < clusters[i].length; j++) { 
        let index = points.indexOf(clusters[i][j])

        switch (ctx) {
            case canvasElements[0].ctx:
                points[index].kMeansColor = COLORS[colorIndex]
                break;
            case canvasElements[1].ctx:
                points[index].hierarchicalColor = COLORS[colorIndex]
                break;
            case canvasElements[2].ctx:
                points[index].dbscanColor = COLORS[colorIndex]
                break;
        }
        await animatePoint(points[index].x, points[index].y, COLORS[colorIndex], ctx)
      }
    }
}
  
async function animateCentroidColoring(centroid) {
  await animateCentroid(centroid.x, centroid.y, centroid.kMeansColor)
}

async function animateNoisyPointColoring(noisyPoint) {
  await animateNoisyPoint(noisyPoint.x, noisyPoint.y)
}

function redrawCanvas() {
    canvasElements.forEach(canvasElement => canvasElement.ctx.reset());
    points.forEach(point => {
      drawCircle(point.kMeansColor, point, canvasElements[0].ctx)
      drawCircle(point.hierarchicalColor, point, canvasElements[1].ctx)
      if(!noise.includes(point)) drawCircle(point.dbscanColor, point, canvasElements[2].ctx)
    })
    centroids.forEach(centroid => {
      drawCircle(centroid.kMeansColor, centroid, canvasElements[0].ctx)
      drawCross('white', RADIUS - 3, 2, centroid, canvasElements[0].ctx)
    })
    noise.forEach(point => {
      drawCircle('black', point, canvasElements[2].ctx)
      drawCross('white', 4, 2, point, canvasElements[2].ctx)
    })
  }