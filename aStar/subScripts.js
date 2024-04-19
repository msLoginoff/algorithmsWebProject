

const buttonGo = document.querySelector('button');
const windowValue = document.getElementById("num");

const attentionText = document.createElement('p');
attentionText.classList.add('attentionText');
const link = document.querySelector('a');


function activateLink(num) {
    if (num.value > 1 && num.value <= 100) {
        link.href = "page.html"
    }

    else {
        link.href = "javascript: void(0)";
    }
}


buttonGo.addEventListener("click", function () {
    if (windowValue.value % 1 !== 0) {
        Math.round(window.value);
    }

    if (attentionText.hasAttribute('id') === false) {
        if (windowValue.value < 2 || windowValue.value > 100) {
            const box = document.getElementById('box');
            attentionText.innerText = '*Введите значение от 2 до 100';
            attentionText.setAttribute('id', 'attention');
            box.append(attentionText);
        }

    }

    else {
        if (windowValue.value > 1 && windowValue.value <= 100) {
            attentionText.innerText = "";
            attentionText.removeAttribute('id');
        }

    }

    localStorage.setItem('fieldSize', windowValue.value);
}
)