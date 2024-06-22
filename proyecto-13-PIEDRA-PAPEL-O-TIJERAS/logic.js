// Elementos del DOM
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");

const buttonRock1 = document.getElementById('button-player1-rock');
const buttonScissors1 = document.getElementById('button-player1-scissors');
const buttonPaper1 = document.getElementById('button-player1-paper');

const buttonRock2 = document.getElementById('button-player2-rock');
const buttonScissors2 = document.getElementById('button-player2-scissors');
const buttonPaper2 = document.getElementById('button-player2-paper');
document.getElementById("reset").addEventListener("click", function() {
    location.reload();
})



const buttonsArray1 = [buttonRock1, buttonScissors1, buttonPaper1];
const buttonsArray2 = [buttonRock2, buttonScissors2, buttonPaper2];

// Variables de juego y puntuación
let rock = 1, scissors = 2, paper = 3;
let player1Wins = 0, player1Draw = 0, player1Lose = 0;
let player2Wins = 0, player2Draw = 0, player2Lose = 0;
let totalTurns = 0, turns = 0;
let playerMove = 0, player2Move = 0;
let gameIA = 1, gameMulti = 2;


// Event Listeners para los botones de modo de juego
button1.addEventListener('click', () => setGame(gameMulti));
button2.addEventListener('click', () => setGame(gameIA));

// Función para establecer el modo de juego y manejar los eventos de juego
function setGame(gamemode) {
    const classButton = document.getElementsByClassName("button-choose");
    Array.from(classButton).forEach(button => button.style.display = "none");

    const turnInput = document.getElementById("select-turns");
    turnInput.style.display = "block";

    const sendButton = document.getElementById('boton-enviar');
    const inputTurns = document.getElementById('input-turns');

    sendButton.addEventListener('click', function handleTurns() {
        totalTurns = parseInt(inputTurns.value);

        if (gamemode === gameIA) {
            buttonsArray1.forEach(button => {
                button.addEventListener('click', () => singlePlayer(buttonsArray1, getMoveValue(button)));
            });
        } else if (gamemode === gameMulti) {
            buttonsArray1.forEach(button => {
                button.addEventListener('click', () => multiPlayer(getMoveValue(button)));
            });

            buttonsArray2.forEach(button => {
                button.addEventListener('click', () => player2Turn(getMoveValue(button)));
            });
        }
        loadGame(gamemode);
    });
}

// Función para cargar el juego y gestionar la visibilidad de elementos según el modo
function loadGame(gamemode) {
    const main = document.getElementById('main-game');
    const chooseMode = document.getElementById('choose-mode');
    chooseMode.remove()
    main.style.display = "block";

    if (gamemode === gameIA) {
        const buttonsSecondPlayer = document.getElementById("second-player-buttons");
        buttonsSecondPlayer.style.display = "none";
    } else if (gamemode === gameMulti) {
        buttonsArray2.forEach(button => button.disabled = true);
    }
}

// Función para jugar un turno en modo de un jugador contra la IA
function singlePlayer(buttonArray, playerChoice) {
    disableButtons(buttonArray);

    let IAchoice = Math.ceil(Math.random() * 3);
    animateAndDisplay(playerChoice, IAchoice, buttonArray);

    updatePoints(playerChoice, IAchoice);
}

// Función para jugar un turno en modo multijugador
function multiPlayer(move) {
    disableButtons(buttonsArray1);
    enableButtons(buttonsArray2);

    playerMove = move;
}

// Función para que el jugador 2 juegue su turno en modo multijugador
function player2Turn(move) {
    disableButtons(buttonsArray2);
    animateAndDisplay(playerMove, move, buttonsArray1);
    updatePoints(playerMove, move);
}

// Función para deshabilitar botones
function disableButtons(buttonArray) {
    buttonArray.forEach(button => button.disabled = true);
}

// Función para habilitar botones
function enableButtons(buttonArray) {
    buttonArray.forEach(button => button.disabled = false);
}

// Función para obtener el valor del movimiento (rock, scissors, paper)
function getMoveValue(button) {
    if (button === buttonRock1 || button === buttonRock2) return rock;
    if (button === buttonScissors1 || button === buttonScissors2) return scissors;
    if (button === buttonPaper1 || button === buttonPaper2) return paper;
}

// Función para animar y mostrar imágenes
function animateAndDisplay(playerChoice, IAchoice, buttonArray) {
    const firstContainer = document.querySelector('.first-container');
    const secondContainer = document.querySelector('.second-container');
    firstContainer.classList.add('animate');
    secondContainer.classList.add('animate-reverse');

    setTimeout(() => {
        firstContainer.classList.remove('animate');
        document.getElementById("first-img").src = getImagePath(playerChoice);
        enableButtons(buttonArray);
    }, 2000);

    setTimeout(() => {
        secondContainer.classList.remove('animate-reverse');
        document.getElementById("second-img").src = getImagePath(IAchoice);
    }, 2000);
}

// Función para obtener la ruta de la imagen según la opción seleccionada
function getImagePath(choice) {
    if (choice === rock) return "assets/punch.png";
    if (choice === scissors) return "assets/two.png";
    if (choice === paper) return "assets/five.png";
}

// Función para actualizar los puntos y el conteo de turnos
function updatePoints(playerChoice, IAchoice) {
    const statusText = document.getElementById("status-text");
    let text = "";

    if ((playerChoice === rock && IAchoice === scissors) ||
        (playerChoice === scissors && IAchoice === paper) ||
        (playerChoice === paper && IAchoice === rock)) {
        player1Wins++;
        player2Lose++;
        text = "Jugador 1 gana ronda";
    } else if ((IAchoice === rock && playerChoice === scissors) ||
        (IAchoice === scissors && playerChoice === paper) ||
        (IAchoice === paper && playerChoice === rock)) {
        player2Wins++;
        player1Lose++;
        text = "Jugador 2 gana ronda";
    } else {
        text = "Empate";
        player1Draw++;
        player2Draw++;
    }

    turns++;
    if (turns >= totalTurns) endGame();


    const player1Victory = document.getElementById("player1-victory");
    const player1loses = document.getElementById("player1-lose");
    const player1draws = document.getElementById("player1-draw");
    const player2Victory = document.getElementById("player2-victory");
    const player2loses = document.getElementById("player2-lose");
    const player2draws = document.getElementById("player2-draw");

    setTimeout(() => {
        player1Victory.innerHTML = "Victorias: " + player1Wins;
        player1loses.innerHTML = "Derrotas: " + player1Lose;
        player1draws.innerHTML = "Empates: " + player1Draw;
        player2Victory.innerHTML = "Victorias: " + player2Wins;
        player2loses.innerHTML = "Derrotas: " + player2Lose;
        player2draws.innerHTML = "Empates: " + player2Draw;
        statusText.innerHTML = text;
    }, 2000);
}

// Función para finalizar el juego
function endGame() {
    setTimeout(() => {
        const main = document.getElementById('main-game');
        const winMessage = document.getElementById('Final');
        let text = "";

        if (player1Wins > player2Wins) {
            text = "Jugador 1 gana el juego";
        }
        else if (player1Wins == player2Wins) {
            text = "Empate";
        }
        else if (player1Wins < player2Wins) {
            text = "Jugador 2 gana el juego";
        }
        console.log(text)
        console.log(player1Wins)
        console.log(player2Wins)


        winMessage.style.display = "block";
        winMessage.innerHTML = text;
        main.style.display = "none";

    }, 2000);

}