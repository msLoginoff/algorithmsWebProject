//constants
const CANVAS_KMEANS = document.getElementById("canvasKMeans")
const CTX = CANVAS_KMEANS.getContext("2d")

const RADIUS = 7
const ANIMATION_DURATION = 90
const MIN_DISTANCE = RADIUS
const CIRCLE_COLOR = 'rgb(255, 255, 255)'

let points = []

CANVAS_KMEANS.width = CANVAS_KMEANS.getBoundingClientRect().width
CANVAS_KMEANS.height = CANVAS_KMEANS.getBoundingClientRect().height

CANVAS_KMEANS.addEventListener('mousedown', (event) => handleMousedown(event))
window.addEventListener('resize', updateCanvasSize)

class Point {
  constructor(x, y, radius) {
    this.x = x
    this.y = y
    this.radius = radius
  }
}

function handleMousedown(event) {
  let x = event.offsetX
  let y = event.offsetY

  if(!isCloseToBorder(new Point(x, y, RADIUS))) animatePoint(x, y)

  console.log(points)
}

function isCloseToBorder(point) {
  if (point.x - point.radius < MIN_DISTANCE || point.x + point.radius > CANVAS_KMEANS.width - MIN_DISTANCE) {
      return true
  }
  
  if (point.y - point.radius < MIN_DISTANCE || point.y + point.radius > CANVAS_KMEANS.height - MIN_DISTANCE) {
      return true
  }
  
  return false
}

function animatePoint(x, y) {
  let startTime = null

  function animation(timestamp) {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime

      const radius = progress / ANIMATION_DURATION * RADIUS

      drawCircle(CIRCLE_COLOR, new Point(x, y, radius))

      if (progress < ANIMATION_DURATION) {
          requestAnimationFrame(animation)
      } else {
          points.push(new Point(x, y, RADIUS))
      }
  }

  requestAnimationFrame(animation)
}

function drawCircle(color, Point) {
  CTX.beginPath()
  CTX.arc(Point.x, Point.y, Point.radius, 0, Math.PI * 2)
  CTX.closePath()
  CTX.fillStyle = color
  CTX.fill()
}

function updateCanvasSize() {
  const prevWidth = CANVAS_KMEANS.width
  const prevHeight = CANVAS_KMEANS.height

  CANVAS_KMEANS.width = CANVAS_KMEANS.getBoundingClientRect().width
  CANVAS_KMEANS.height = CANVAS_KMEANS.getBoundingClientRect().height

  points.forEach(point => {
      point.x = (point.x / prevWidth) * CANVAS_KMEANS.width
      point.y = (point.y / prevHeight) * CANVAS_KMEANS.height
  });

  redrawCanvas()
}

function redrawCanvas() {
  CTX.clearRect(0, 0, CANVAS_KMEANS.width, CANVAS_KMEANS.height)
  points.forEach(point => drawCircle(CIRCLE_COLOR, point))
}