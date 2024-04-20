
class Matrix {
    matrix;
    row;
    col;
    init(row, col) {
        this.row = row;
        this.col = col;
        this.matrix = [];

        for (let i = 0; i < row; i++) {
            this.matrix[i] = new Array(col);
        }

        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                this.matrix[i][j] = 0;
            }
        }
    };

    rand() {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.col; j++) {
                this.matrix[i][j] = (Math.random() % 100) * 0.03 / (this.row + 35);
            }
        }
    };

    multi(matrix, neuron, n) {
        if (matrix.col !== n) {
            console.log('error multi');
            console.log(matrix.col, n)
            return;
        }

        let answer = [];

        for (let i = 0; i < matrix.row; i++) {
            let tmp = 0;

            for (let j = 0; j < matrix.col; j++) {
                tmp += matrix.matrix[i][j] * neuron[j];
            }

            answer[i] = tmp;
        }

        return answer;
    };

    multiTrans(matrix, neuron, n) {
        if (matrix.row !== n) {
            console.log('error multi');
            return;
        }

        let answer = [];

        for (let i = 0; i < matrix.col; i++) {
            let tmp = 0;

            for (let j = 0; j < matrix.row; j++) {
                tmp += matrix.matrix[j][i] * neuron[j];
            }

            answer[i] = tmp;
        }

        return answer;
    };

    sumVector(firstVector, secondVector, dimension) {
        let answer = new Array(dimension);

        for (let i = 0; i < dimension; i++) {
            answer[i] = firstVector[i] + secondVector[i];
        }

        return answer;
    };
}

class ActivateFunction {
    useSigmoid(answer, dimension) {
        for (let i = 0; i < dimension; i++) {
            answer[i] = 1 / (1 + Math.exp(-answer[i]));
        }

        return answer;
    }

    useReLu(answer, dimension) {
        for (let i = 0; i < dimension; i++) {
            if (answer[i] < 0) {
                answer[i] *= 0.01;
            }
            else if (answer[i] > 1) {
                answer[i] = 1 + 0.01 * (answer[i] - 1);
            }
        }

        return answer;
    }

    useDerivativeSigmoid(answer) {
        answer = 1 / (1 + Math.exp(-answer));
        return answer;
    };

    useDerivativeReLu(answer) {
        if (answer < 0 || answer > 1) {
            answer = 0.01;
        }

        return answer;
    };
}
class NetWork {
    layersNumber;
    layerSize;
    weights;
    bias;
    neuronsValues;
    neuronsErrors;
    neuronsBiasValues;

    initial(layersNumber, layerSize) {
        this.layersNumber = layersNumber;
        this.layerSize = new Array(this.layersNumber);

        for (let i = 0; i < layersNumber; i++) {
            this.layerSize[i] = layerSize[i];
        }

        this.weights = [];
        this.bias = [];

        for (let i = 0; i < layersNumber - 1; i++) {
            this.weights[i] = new Matrix();
            this.weights[i].init(layerSize[i + 1], layerSize[i]);
            this.bias[i] = new Array(layerSize[i + 1]);
            this.weights[i].rand();

            for (let j = 0; j < layerSize[i + 1]; j++) {
                this.bias[i][j] = (Math.random() % 50) * 0.06 / (this.layerSize[i] + 15);
            }
        }

        this.neuronsValues = new Array(layersNumber);
        this.neuronsErrors = new Array(layersNumber);

        for (let i = 0; i < layersNumber; i++) {
            this.neuronsValues[i] = new Array(layerSize[i]);
            this.neuronsErrors[i] = new Array(layerSize[i]);
        }

        this.neuronsBiasValues = new Array(layersNumber - 1);

        for (let i = 0; i < layersNumber - 1; i++) {
            this.neuronsBiasValues[i] = 1;
        }

    }

    setInput(values) {
        for (let i = 0; i < this.layerSize[0]; i++) {
            this.neuronsValues[0][i] = values[i];
        }
    }

    forwardFeed(isPrint) {
        for (let k = 1; k < this.layersNumber; k++) {
            this.neuronsValues[k] =
                Matrix.prototype.multi(this.weights[k - 1], this.neuronsValues[k - 1], this.layerSize[k - 1]);
            this.neuronsValues[k] =
                Matrix.prototype.sumVector(this.neuronsValues[k], this.bias[k - 1], this.layerSize[k]);

            this.neuronsValues[k] = ActivateFunction.prototype.useReLu(this.neuronsValues[k], this.layerSize[k]);
        }

        if (isPrint === true) {
            for (let i = 0; i < this.layerSize[this.layersNumber - 1]; i++) {
                console.log(i, ': ', (this.neuronsValues[this.layersNumber - 1][i] + 1.05) / 2.1 * 100, '%');
            }
        }

        let prediction = this.searchMaxIndex(this.neuronsValues[this.layersNumber - 1]);

        return prediction;

    }

    searchMaxIndex(valuesFromLastLayer) {
        let maxValue = valuesFromLastLayer[0];
        let prediction = 0;

        for (let i = 1; i < this.layerSize[this.layersNumber - 1]; i++) {
            if (valuesFromLastLayer[i] > maxValue) {
                maxValue = valuesFromLastLayer[i];
                prediction = i;
            }
        }

        return prediction;
    }

    backPropagation(rightAnswer) {
        for (let i = 0; i < this.layerSize[this.layersNumber - 1]; i++) {
            if (i !== Number(rightAnswer)) {
                this.neuronsErrors[this.layersNumber - 1][i] =
                    - this.neuronsValues[this.layersNumber - 1][i]
                    * ActivateFunction.prototype.useDerivativeReLu(this.neuronsValues[this.layersNumber - 1][i]);
            }
            else {
                this.neuronsErrors[this.layersNumber - 1][i] = (1 - this.neuronsValues[this.layersNumber - 1][i])
                    * ActivateFunction.prototype.useDerivativeReLu(this.neuronsValues[this.layersNumber - 1][i]);
            }
        }

        for (let i = this.layersNumber - 2; i > 0; i--) {
            this.neuronsErrors[i] =
                Matrix.prototype.multiTrans(this.weights[i], this.neuronsErrors[i + 1], this.layerSize[i + 1]);

            for (let j = 0; j < this.layerSize[i]; j++) {
                this.neuronsErrors[i][j] *= ActivateFunction.prototype.useDerivativeReLu(this.neuronsValues[i][j]);
            }
        }
    }

    weightsUpdater(learningRate) {
        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let j = 0; j < this.layerSize[i + 1]; j++) {
                for (let k = 0; k < this.layerSize[i]; k++) {
                    this.weights[i].matrix[j][k] += this.neuronsValues[i][k] * this.neuronsErrors[i + 1][j] * learningRate;
                }
            }
        }

        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let k = 0; k < this.layerSize[i + 1]; k++) {
                this.bias[i][k] += this.neuronsErrors[i + 1][k] * learningRate;
            }
        }
    }

    saveWeights(input) {
        weightsAfterLearning[0] = input;
        let counter = 1;

        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let j = 0; j < this.layerSize[i+1]; j++) {
                for (let k = 0; k < this.layerSize[i]; k++) {
                    weightsAfterLearning[counter++] = this.weights[i].matrix[j][k];
                }
            }

        }

        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let j = 0; j < this.layerSize[i+1]; j++) {
                weightsAfterLearning[counter++] = this.bias[i][j];
            }
        }

    }

    readWeights() {
        let counter = 0;

        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let j = 0; j < this.layerSize[i+1]; j++) {
                for (let k = 0; k < this.layerSize[i]; k++) {
                    this.weights[i].matrix[j][k] = weightsAfterLearning[counter];
                    counter++;
                }
            }

        }

        for (let i = 0; i < this.layersNumber - 1; i++) {
            for (let j = 0; j < this.layerSize[i+1]; j++) {
                this.bias[i][j] = weightsAfterLearning[counter++];

            }
        }


    }

}

class DataInfo {
    pixels;
    digit;
}

function readDataNetwork() {
    let netWork = new NetWork();
    netWork.initial(layersNumberStatic, config);
    return netWork;
}

function getLearningSet() {
    const regex = new RegExp('[ \n]+')
    if (typeof learningSet === 'string') {
        let chars = learningSet.split(regex);

        let learningNumbers = [];
        chars.forEach(ele => learningNumbers.push(+ele));

        Number(chars);
        learningSet = learningNumbers;
    } else {
        console.log('Переменная learningSet не является строкой');
    }



}

function resizeMatrix(matrix, newWidth, newHeight) {
    const scaleX = newWidth / matrix.length;
    const scaleY = newHeight / matrix[0].length;

    const newMatrix = Array(newWidth * newHeight).fill(0);


    for (let x = 0; x < newWidth; x++) {
        for (let y = 0; y < newHeight; y++) {
            const sourceX = x / scaleX;
            const sourceY = y / scaleY;

            const x1 = Math.floor(sourceX);
            const x2 = Math.ceil(sourceX);
            const y1 = Math.floor(sourceY);
            const y2 = Math.ceil(sourceY);

            const value1 = (matrix[x1] && matrix[x1][y1]) || 0;
            const value2 = (matrix[x2] && matrix[x2][y1]) || 0;
            const value3 = (matrix[x1] && matrix[x1][y2]) || 0;
            const value4 = (matrix[x2] && matrix[x2][y2]) || 0;

            const interpolatedValue = (value1 * (x2 - sourceX) * (y2 - sourceY) +
                value2 * (sourceX - x1) * (y2 - sourceY) +
                value3 * (x2 - sourceX) * (sourceY - y1) +
                value4 * (sourceX - x1) * (sourceY - y1));

            newMatrix[x * newWidth + y] = interpolatedValue;
        }
    }

    return newMatrix;
}

function readDataFromLearningSet(learningSetLocal) {
    let examplesNumber = learningSetLocal[0];

    let dataInfo = [];
    let counter = 1;



    for(let i = 0; i < examplesNumber; i++) {
        dataInfo[i] = new DataInfo();
        dataInfo[i].pixels = [];
        dataInfo[i].digit = learningSetLocal[counter++];
        let learningSetMatrix = new Array(28);

        for (let j = 0; j < 28; j++) {
            learningSetMatrix[j] = new Array(28);
        }

        for (let j = 0; j < 28; j++) {
            learningSetMatrix[j] = new Array(28);

            for (let u = 0; u < 28; u++) {
                learningSetMatrix[j][u] = learningSetLocal[counter++];
            }
        }

        dataInfo[i].pixels = resizeMatrix(learningSetMatrix, 50, 50);
    }

    return dataInfo;
}

function activateLearning() {
    study = true;
}

function deactivateLearning() {
    study = false;
}

let netWork = readDataNetwork();
let study = false;

function main() {
    getLearningSet();

    let rightDigit;
    let rightAnswer = 0;
    let predictDigit;
    let maxRightAnswerFromEpoch = 0;
    let epoch = 0;
    let repeat = true;

    if (repeat) {
        console.log(`study: ${study} `);

        if (study) {
            let examplesNumber = learningSet[0];
            let data = readDataFromLearningSet(learningSet);
            while (rightAnswer / examplesNumber * 100 < 100) {
                rightAnswer = 0;

                for (let i = 0; i < examplesNumber; i++) {
                    netWork.setInput(data[i].pixels);
                    rightDigit = data[i].digit;
                    predictDigit = netWork.forwardFeed(false);

                    if (predictDigit !== rightDigit) {
                        netWork.backPropagation(rightDigit);
                        netWork.weightsUpdater(0.15 * Math.exp(- epoch / 20));
                    }
                    else {
                        rightAnswer++;
                    }
                }

                if (rightAnswer > maxRightAnswerFromEpoch) {
                    maxRightAnswerFromEpoch = rightAnswer;
                }

                epoch++;

                console.log('epoch: ', epoch);
                console.log('%: ', rightAnswer / examplesNumber * 100 );

                if (epoch === 35) break;

            }

            console.log('start saving weights');
            netWork.saveWeights(learningSet[0]);
        }
        else {
            netWork.readWeights();
            testRun();
        }
    }

}


function testRun() {
    let examplesNumber = setForTesting[0];
    let data = readDataFromLearningSet(setForTesting);

    let rightDigit;
    let rightAnswer = 0;
    let predictDigit;

    for (let i = 0; i < examplesNumber; i++) {
        netWork.setInput(data[i].pixels);
        rightDigit = data[i].digit;
        predictDigit = netWork.forwardFeed(false);

        if (predictDigit === rightDigit) {
            rightAnswer++;
        }

    }

    console.log(rightAnswer / examplesNumber * 100, '%');
}



function exportLearningWeights() {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(weightsAfterLearning, null, 2)], {
        type: "text/plain"
    }));
    a.setAttribute("download", "data.txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

let answerFromNetwork;

function getNumberResult() {
    vectorTest = currentCanvas.calculate();
    netWork.readWeights();
    netWork.setInput(vectorTest);

    console.log(vectorTest);

    let predictDigit = netWork.forwardFeed(true);

    answerFromNetwork = predictDigit;

    console.log(predictDigit);

    pasteAnswer();
}


function pasteAnswer() {
    let answerDelete = document.getElementById('answer');

    if (answerDelete) {
        answerDelete.remove();
    }

    let controlBar = document.getElementById('controlBarAnswer');
    let answer = document.createElement('answer');
    answer.setAttribute('id', 'answer');


    answer.innerText = answerFromNetwork;
    controlBar.append(answer);
}