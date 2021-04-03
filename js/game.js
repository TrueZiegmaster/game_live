let canvasContainer;
let canvas;
let ctx;
let cellSize = 20;
let playArea;
let counter;
let session = null;

document.addEventListener("DOMContentLoaded", function(event) {
    canvasContainer = document.getElementById("canvas-wrapper");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    console.debug("Detected screen resolution:", document.body.clientWidth, document.body.clientHeight);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvasContainer.offsetWidth;
    canvas.height = canvasContainer.offsetHeight;
    console.debug("Canvas rendering size: ", canvas.width, canvas.height);
    canvas.addEventListener("click", function (event) {
        console.log(playArea);
        let x = Math.floor(event.offsetX/cellSize);
        let y = Math.floor(event.offsetY/cellSize);
        console.log(x, y);
        playArea[y][x] = 1;
        render();
    });
    document.getElementById("start").addEventListener("click", function (event) {
        if (session){
            stop();
        }
        else{
            start();
        }
    })
    playArea = prepareArea();
});

function gameProcess() {
    let birthFlag = false;
    let yLen = playArea.length;
    let xLen = playArea[0].length;
    for (let i=0; i<playArea.length; i++){
        for (let j=0; j<playArea[i].length;j++){
            let neighbours = 0;
            //Левая верхняя
            if (playArea[cyclePath(i-1, yLen)][cyclePath(j-1, xLen)] === 1) neighbours++;
            //Левая центральная
            if (playArea[i][cyclePath(j-1, xLen)] === 1) neighbours++;
            //Левая нижняя
            if (playArea[cyclePath(i+1, yLen)][cyclePath(j-1, xLen)] === 1) neighbours++;
            //Центральная верхняя
            if (playArea[cyclePath(i-1, yLen)][j] === 1) neighbours++;
            //Центральная нижняя
            if (playArea[cyclePath(i+1, yLen)][j] === 1) neighbours++;
            //Правая верхняя
            if (playArea[cyclePath(i-1, yLen)][cyclePath(j+1, xLen)] === 1) neighbours++;
            //Правая центральная
            if (playArea[i][cyclePath(j+1, xLen)] === 1) neighbours++;
            //Правая нижняя
            if (playArea[cyclePath(i+1, yLen)][cyclePath(j+1, xLen)] === 1) neighbours++;
            if (neighbours<2 || neighbours>3){
                //Смерть если соседей меньше 2 или больше 3
                playArea[i][j]=0;
            }
            else if (neighbours===3){
                //Зарождение жизни если есть ровно 3 соседа
                playArea[i][j]=1;
                birthFlag = true;
            }
        }
    }
    render();
    counter++;
    document.getElementById("cycles").innerText = counter;
    if (!birthFlag){
        stop();
    }
}

function start() {
    counter = 0;
    session = setInterval(gameProcess, 250);
    document.getElementById("start").innerText = "Сброс";
}

function stop() {
    clearInterval(session);
    session=null;
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    playArea = prepareArea();
    document.getElementById("start").innerText = "Начать";
}

function cyclePath(axisIndex, axisLength) {
    if (axisIndex === axisLength) return 0;
    else if (axisIndex === -1) return axisLength-1;
    else return axisIndex;
}

function prepareArea(){
    let matrix = getAreaMatrixSize();
    let playArea = [];
    for(let i=0; i < matrix.lines; i++){
        playArea[i] = [];
        for(let j=0; j<matrix.rows;j++){
            playArea[i][j] = 0;
        }
    }
    return playArea;
}

function getAreaMatrixSize() {
    return {lines: Math.floor(canvas.height/cellSize), rows: Math.floor(canvas.width/cellSize)};
}

function render(){
    ctx.clearRect(0, 0 , canvas.width, canvas.height);
    for (let i=0; i<playArea.length; i++){
        for(let j=0; j<playArea[i].length;j++){
            if(playArea[i][j]===1){
                ctx.fillStyle = "#32cd32";
                ctx.fillRect(j*cellSize, i*cellSize, cellSize, cellSize);
                console.debug("Rendered:", j*cellSize, i*cellSize);
            }
        }
    }
}

