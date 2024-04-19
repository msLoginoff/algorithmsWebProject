import { Point, selectedMetrics } from "./clusteringAlgPage.js"
export { kMeans, calculateDistance }

function calculateDistance(point1, point2, metrics) {
    switch (metrics) {
        case 'euclidean':
            return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
        case 'chebyshev':
            return Math.max(Math.abs(point2.x - point1.x), Math.abs(point2.y - point1.y))
        case 'manhattan':
            return Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y)
    }
}

function recalculateCentroids(clusters) {
    let newCentroids = []

    for (let i = 0; i < clusters.length; i++) {
        let cluster = clusters[i]
        const clusterSize = cluster.length
        let clusterSumX = 0
        let clusterSumY = 0

        for (let j = 0; j < clusterSize; j++) {
            clusterSumX += cluster[j].x
            clusterSumY += cluster[j].y
        }
        newCentroids.push(new Point(clusterSumX / clusterSize, clusterSumY / clusterSize))
    }

    return newCentroids
}

function assignPointsToCentroids(points, centroids) {
    let clusters = []

    for (let i = 0; i < centroids.length; i++) {
        clusters.push([])
    }
    points.forEach(point => {
        let minDistance = Infinity
        let closestCentroidIndex = -1

        for (let i = 0; i < centroids.length; i++) {
          let distance = calculateDistance(point, centroids[i], selectedMetrics)

          if (distance < minDistance) {
            minDistance = distance
            closestCentroidIndex = i
          }
        }
        clusters[closestCentroidIndex].push(point)
    })
    
    return clusters
}

function initializeCentroids(points, k) {
    let centroids = []

    centroids.push(points[Math.floor(Math.random() * points.length)])

    function calculateMinDistance(point, centroids) {
        let minDistanceSquared = Infinity

        centroids.forEach(centroid => {
            const distSquared = Math.pow(calculateDistance(point, centroid, selectedMetrics), 2)

            if (distSquared < minDistanceSquared) {
                minDistanceSquared = distSquared
            }
        })
        return minDistanceSquared
    }

    while (centroids.length < k) {
        let probabilities = []
        let totalDistanceSquared = 0

        points.forEach(point => {
            const distSquared = calculateMinDistance(point, centroids)

            probabilities.push(distSquared)
            totalDistanceSquared += distSquared
        })
        probabilities.forEach(probability => probability /= totalDistanceSquared)

        let cumulativeProbability = 0
        const randomValue = Math.random();

        for (let i = 0; i < probabilities.length; i++) {
            cumulativeProbability += probabilities[i]
            if (cumulativeProbability >= randomValue) {
                centroids.push(points[i])
                break
            }
        }
    }

    return centroids
}

function kMeans(points, k) {
    let clusters = []
    let centroids = initializeCentroids(points, k)
    let converged = false

    for (let i = 0; i < centroids.length; i++) {
        clusters.push([])
    }
    while (!converged) {
      clusters = assignPointsToCentroids(points, centroids)
      
      let newCentroids = recalculateCentroids(clusters)
      converged = true
      
      for (let i = 0; i < centroids.length; i++) {
        if (calculateDistance(centroids[i], newCentroids[i], selectedMetrics) > 0.001) {
            converged = false
            break
        }
      }
      centroids = newCentroids
    }
  
    return { clusters, centroids }
}