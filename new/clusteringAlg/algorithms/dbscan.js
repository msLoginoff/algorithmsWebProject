import { calculateDistance } from "./kMeans.js";
import { selectedMetrics } from "../clusteringAlgPage.js";

function findNeighbors(points, point, eps) {
    let neighbors = [];

    for (let i = 0; i < points.length; i++) {
        if (calculateDistance(point, points[i], selectedMetrics) <= eps) {
            neighbors.push(points[i]);
        }
    }
    return neighbors;
}

export function dbscanClustering(points, eps, minPts) {
    let clusters = [];
    let visited = new Set();
    let noise = new Set();

    function expandCluster(point, neighbors) {
        let cluster = [point];
        let inputPointNeighbors = new Set(neighbors);

        while (inputPointNeighbors.size > 0) { 
            for (const neighbor of inputPointNeighbors) {
                const neighborNeighbors = findNeighbors(points, neighbor, eps);

                visited.add(neighbor);
                if (neighborNeighbors.length >= minPts) {
                    neighborNeighbors.forEach(element => {
                        if (!visited.has(element)) {
                            inputPointNeighbors.add(element);
                            visited.add(element);
                        }
                    });
                }
                if (!noise.has(neighbor)) cluster.push(neighbor);
                inputPointNeighbors.delete(neighbor);
            }
        }

        return cluster
    }

    for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (visited.has(point)) continue;
        visited.add(point);

        const neighbors = findNeighbors(points, point, eps);
        if (neighbors.length < minPts) {
            noise.add(point);
            continue;
        }
        
        clusters.push(expandCluster(point, neighbors));
    }

    return { clusters, noise: Array.from(noise) };
}