import { calculateDistance } from "./kMeans.js"
import { selectedMetrics } from "./clusteringAlgPage.js"

export function hierarchicalClustering(points, clustersCount) {
    let clusters = points.map(point => [point]);

    function findClosestClusters() {
        let minDistance = Infinity;
        let closestClusters = [];

        for (let i = 0; i < clusters.length; i++) {
            for (let j = i + 1; j < clusters.length; j++) {
                const distance = calculateClusterDistance(clusters[i], clusters[j]);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestClusters = [i, j];
                }
            }
        }

        return closestClusters;
    }

    function calculateClusterDistance(cluster1, cluster2) {
        let minDistance = Infinity;

        for (let i = 0; i < cluster1.length; i++) {
            for (let j = 0; j < cluster2.length; j++) {
                const distance = calculateDistance(cluster1[i], cluster2[j], selectedMetrics);

                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }

        return minDistance;
    }

    while (clusters.length > clustersCount) {
        const [index1, index2] = findClosestClusters();

        clusters[index1] = clusters[index1].concat(clusters[index2]);
        clusters.splice(index2, 1);
    }

    return clusters;
}