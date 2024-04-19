import { kMeans } from "./algorithms/kMeans.js";
import { hierarchicalClustering } from "./algorithms/hierarchical.js";
import { dbscanClustering } from "./algorithms/dbscan.js";
import { animatePoint, animateClusterColoring, animateCentroidColoring, animateNoisyPointColoring, redrawCanvas } from "./drawFunctions.js"
export { Point, canvasElements, RADIUS, points, centroids, noise, selectedMetrics }

class Point {
  constructor(x, y, radius, kMeansColor, hierarchicalColor, dbscanColor) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.kMeansColor = kMeansColor;
      this.hierarchicalColor = hierarchicalColor;
      this.dbscanColor = dbscanColor;
  }
}

const canvasConfigs = [
    { canvas: "canvasKMeans", card: "cardKMeans" },
    { canvas: "canvasHierarchical", card: "cardHierarchical" },
    { canvas: "canvasDBSCAN", card: "cardDBSCAN" }
];
const canvasElements = canvasConfigs.map(config => ({
    canvas: document.getElementById(config.canvas),
    card: document.getElementById(config.card),
    ctx: document.getElementById(config.canvas).getContext("2d")
}));

const progressConfigs = [
  { progress: "progressKMeans" },
  { progress: "progressHierarchical" },
  { progress: "progressDBSCAN" }
];
const progressElements = progressConfigs.map(config => ({
  progress: document.getElementById(config.progress)
}));

const rangeConfigs = [
  { range: "rangeKMeans", lable: "lableKMeans" },
  { range: "rangeHierarchical", lable: "lableHierarchical" },
  { range: "rangeRadiusDBSCAN", lable: "lableRadiusDBSCAN" },
  { range: "rangeMinPointsDBSCAN", lable: "lableMinPointsDBSCAN" }
];
const rangeElements = rangeConfigs.map(config => ({
  range: document.getElementById(config.range),
  lable: document.getElementById(config.lable),
}));

const goButton = document.getElementById('goButton')
const radioButtons = document.querySelectorAll('input[type="radio"]');
const RADIUS = 7;
const MIN_DISTANCE = RADIUS;
const CIRCLE_COLOR = 'rgb(255, 255, 255)';

let points = [];
let centroids = [];
let noise = [];
let kMeansClustersCount = 3;
let hierarchicalClustersCount = 3;
let eps = 26;
let minPts = 4;
let selectedMetrics = 'euclidean';

// Event Listeners
canvasElements.forEach(canvasElement => {
    canvasElement.canvas.addEventListener('mousedown', (event) => handleCanvasMousedown(event));
    canvasElement.canvas.width = canvasElement.card.getBoundingClientRect().width;
    canvasElement.canvas.height = canvasElement.card.getBoundingClientRect().height;
});
goButton.addEventListener('click', startAllAlgorithms);
window.addEventListener('resize', updateCanvasSize);

rangeElements[0].range.addEventListener('input', function() {
  kMeansClustersCount = this.value;
  rangeElements[0].lable.textContent = `Количество кластеров: ${kMeansClustersCount}`;
});
rangeElements[1].range.addEventListener('input', function() {
  hierarchicalClustersCount = this.value;
  rangeElements[1].lable.textContent = `Количество кластеров: ${hierarchicalClustersCount}`;
});
rangeElements[2].range.addEventListener('input', function() {
  eps = this.value;
  rangeElements[2].lable.textContent = `Радиус поиска точек: ${eps}`;
});
rangeElements[3].range.addEventListener('input', function() {
  minPts = this.value;
  rangeElements[3].lable.textContent = `Количество точек в округе: ${minPts}`;
});

radioButtons.forEach((radio) => {
    radio.addEventListener('change', (event) => {
        selectedMetrics = event.target.value;

        const relatedRadioButtons = document.querySelectorAll(`input[type="radio"][value="${selectedMetrics}"]`);
        relatedRadioButtons.forEach(relatedRadioButton => {
            relatedRadioButton.checked = true;
        });
    });
});


// Functions
function isCloseToBorder(x, y, radius) {
  return x - radius < MIN_DISTANCE || x + radius > canvasElements[0].canvas.width - MIN_DISTANCE ||
         y - radius < MIN_DISTANCE || y + radius > canvasElements[0].canvas.height - MIN_DISTANCE;
}

function isPointExist(x, y, radius) {
  return points.some(point => {
      const deltaX = point.x - x;
      const deltaY = point.y - y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      return distance < radius * 2;
  });
}

function handleCanvasMousedown(event) {
  const x = event.offsetX;
  const y = event.offsetY;

  if (!isCloseToBorder(x, y, RADIUS) && !isPointExist(x, y, RADIUS)) {
      const newPoint = new Point(x, y, RADIUS, CIRCLE_COLOR, CIRCLE_COLOR, CIRCLE_COLOR);

      points.push(newPoint);
      canvasElements.forEach(canvasElement => animatePoint(newPoint.x, newPoint.y, CIRCLE_COLOR, canvasElement.ctx));
  }
}

function appendAlert(message, type) {
  const wrapper = document.createElement('div');

  wrapper.innerHTML = `
      <div class="alert alert-${type} d-flex align-items-center alert-dismissible fade show" role="alert">
          <div>${message}</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`;
  document.getElementById('alert').append(wrapper);
}

async function startKMeans() {
  const kmeans = kMeans(points, kMeansClustersCount);

  centroids = kmeans.centroids;
  centroids.forEach(centroid => {
    centroid.kMeansColor = 'red';
    centroid.radius = RADIUS;
  });
  
  const totalPoints = points.length + centroids.length;
  let processedPoints = 0;
  let progress = 0;

  updateProgress(0, 0);
  for (let cluster of kmeans.clusters) {
    await animateClusterColoring([cluster], canvasElements[0].ctx);
    processedPoints += cluster.length;

    progress = (processedPoints / totalPoints) * 100;
    updateProgress(progress, 0);
  }

  for (let i = 0; i < centroids.length; i++) {
    animateCentroidColoring(centroids[i]);
    processedPoints++;

    progress = (processedPoints / totalPoints) * 100;
    updateProgress(progress, 0);
  }
}

async function startHierarchical() {
  const hierarchical = hierarchicalClustering(points, hierarchicalClustersCount);

  const totalPoints = points.length;
  let processedPoints = 0;
  let progress = 0;

  updateProgress(0, 1);
  for (let cluster of hierarchical) {
    await animateClusterColoring([cluster], canvasElements[1].ctx);
    processedPoints += cluster.length;

    progress = (processedPoints / totalPoints) * 100;
    updateProgress(progress, 1);
  }
}

async function startDbscan() {
  const dbscan = dbscanClustering(points, eps, minPts);

  noise = dbscan.noise;
  const totalPoints = points.length;
  let processedPoints = 0;
  let progress = 0;

  
  updateProgress(0, 2);
  for (let cluster of dbscan.clusters) {
    await animateClusterColoring([cluster], canvasElements[2].ctx);
    processedPoints += cluster.length;

    progress = (processedPoints / totalPoints) * 100;
    updateProgress(progress, 2);
  }

  for (let noisyPoint of noise) {
    await animateNoisyPointColoring(noisyPoint);
    processedPoints++;

    progress = (processedPoints / totalPoints) * 100;
    updateProgress(progress, 2);
  }
}

async function startAllAlgorithms() {
  if (kMeansClustersCount > points.length) {
    appendAlert('<strong>Ошибка в K-Means++!</strong> Недостаточное количество точек для кластеризации', 'danger');
    return;
  }
  else if (hierarchicalClustersCount > points.length) {
    appendAlert('<strong>Ошибка в Иерархическом!</strong> Недостаточное количество точек для кластеризации', 'danger');
    return;
  }
  
  goButton.disabled = true;
  canvasElements.forEach(canvasElement => canvasElement.ctx.reset());
  await Promise.all([
    startKMeans(),
    startHierarchical(),
    startDbscan()
  ]);

  goButton.disabled = false;
}

function updateCanvasSize() {
  const prevWidth = canvasElements[0].canvas.width

  canvasElements.forEach(canvasElement => canvasElement.canvas.width = canvasElement.card.getBoundingClientRect().width);
  points.forEach(point => point.x = (point.x / prevWidth) * canvasElements[0].canvas.width)
  centroids.forEach(centroid => centroid.x = (centroid.x / prevWidth) * canvasElements[0].canvas.width)
  redrawCanvas()
}

function updateProgress(progress, index) {
  progressElements[index].progress.style.width = progress + "%";
  progressElements[index].progress.setAttribute('aria-valuenow', progress);
}