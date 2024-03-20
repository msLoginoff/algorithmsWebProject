const GEN_CANVAS = document.getElementById("genetic-canvas");
const GEN_CTX = GEN_CANVAS.getContext("2d");
 
// Генерируем начальную популяцию
function generatePopulation(popSize, numVertices) {
    let population = [];
    for (let i = 0; i < popSize; i++) {
        let chromosome = [];
        for (let j = 0; j < numVertices; j++) {
            chromosome.push(j);
        }
        shuffleArray(chromosome);
        population.push(chromosome);
    }
    return population;
}
  
// Определяем функцию приспособленности
function fitness(chromosome, distances) {
    let totalDistance = 0;
    for (let i = 0; i < chromosome.length - 1; i++) {
      totalDistance += distances[chromosome[i]][chromosome[i+1]];
    }
    totalDistance += distances[chromosome[chromosome.length-1]][chromosome[0]];
    return totalDistance;
}
  
// Функция селекции
function selection(population, numParents) {
    let parents = [];
    let fitnesses = [];
    
    for (let i = 0; i < population.length; i++) {
        fitnesses.push(fitness(population[i]));
    }
    
    for (let i = 0; i < numParents; i++) {
        let maxFitness = Math.max(...fitnesses);
        let maxFitnessIdx = fitnesses.indexOf(maxFitness);
        parents.push(population[maxFitnessIdx]);
        fitnesses[maxFitnessIdx] = -1;
    }
    
    return parents;
}
  
// Выполняем операцию скрещивания
function crossover(parents) {
    let child = Array.from({length: parents[0].length}, () => -1);
    let start = Math.min(...randomSample(parents[0].length, 2));
    let end = Math.max(...randomSample(parents[0].length, 2));
    
    for (let i = start; i < end; i++) {
      child[i] = parents[0][i];
    }
    
    for (let i = 0; i < parents[1].length; i++) {
      let found = false;
      
      for (let j = start; j < end; j++) {
        if (parents[1][i] == child[j]) {
          found = true;
          break;
        }
      }
      
      if (!found) {
        for (let j = 0; j < child.length; j++) {
          if (child[j] == -1) {
            child[j] = parents[1][i];
            break;
          }
        }
      }
    }
    
    return child;
}  
  
// Выполняем операцию мутации
function mutation(chromosome) {
    let len = chromosome.length;
    let idx1 = Math.floor(Math.random() * len);
    let idx2 = Math.floor(Math.random() * len);
    
    if (idx1 > idx2) {
      [idx1, idx2] = [idx2, idx1];
    }
    
    let slice = chromosome.slice(idx1, idx2 + 1);
    let reversedSlice = slice.reverse();
    
    chromosome.splice(idx1, slice.length, ...reversedSlice);
    
    return chromosome;
}  

function geneticAlgorithm(distances, popSize, numParents, numGenerations) {
    let population = generatePopulation(popSize, distances.length);
    let bestChromosome = null;
    let bestFitness = Infinity;
    
    for (let i = 0; i < numGenerations; i++) {
      let parents = selection(population, numParents);
      let children = [];
      while (children.length < popSize - numParents) {
        let randomParents = randomSample(parents, 2);
        let child = crossover(randomParents);
        if (Math.random() < mutationRate) {
          child = mutation(child);
        }
        children.push(child);
      }
      population = parents.concat(children);
      let fitnesses = population.map(chromosome => fitness(chromosome, distances));
      let minFitnessIdx = fitnesses.indexOf(Math.min.apply(null, fitnesses));
      if (fitnesses[minFitnessIdx] < bestFitness) {
        bestFitness = fitnesses[minFitnessIdx];
        bestChromosome = population[minFitnessIdx];
      }
    }
    
    return {
      bestFitness: bestFitness,
      bestChromosome: bestChromosome
    };
}

function runGenetic() {
    let popSize = 100;
    let numParents = 10;
    let numGenerations = 50;

    let result = geneticAlgorithm(distances, popSize, numParents, numGenerations);

    console.log('Оптимальный маршрут:', result.bestChromosome);
    console.log('Длина маршрута:', result.bestFitness);
}