const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const totalDisplay = document.getElementById("total");

// 1: Pared, 0: Fruta, 2: Espacio vacío
const layout = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1,
    1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];

const cells = [];
let score = 0;
let totalDots = 0;

let playerIndex = 16; // Posición inicial del jugador

// Array de fantasmas (puedes agregar más)
const ghosts = [
    { index: 28, color: 'red' },
    { index: 196, color: 'pink' },
    { index: 118, color: 'cyan' }
];

let gameActive = true;

// Construir el tablero
function createBoard() {
    for (let i = 0; i < layout.length; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        if (layout[i] === 1) {
            cell.classList.add("wall");
        } else if (layout[i] === 0) {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            cell.appendChild(dot);
            totalDots++;
        }

        board.appendChild(cell);
        cells.push(cell);
    }
    totalDisplay.innerText = totalDots;
}

createBoard();

// Dibujar elementos dinámicos
function draw() {
    // Limpiar posiciones
    cells.forEach(cell => {
        const p = cell.querySelector('.player');
        if (p) p.remove();

        const g = cell.querySelector('.ghost');
        if (g) g.remove();
    });

    // Dibujar Jugador
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player");
    cells[playerIndex].appendChild(playerDiv);

    // Dibujar Fantasmas
    ghosts.forEach(ghost => {
        const ghostDiv = document.createElement("div");
        ghostDiv.classList.add("ghost");
        ghostDiv.style.backgroundColor = ghost.color;
        cells[ghost.index].appendChild(ghostDiv);
    });
}

// Comer fruta
function eatDot() {
    if (layout[playerIndex] === 0) {
        layout[playerIndex] = 2; // Marcar como vacío
        const dot = cells[playerIndex].querySelector('.dot');
        if (dot) dot.remove();
        score++;
        scoreDisplay.innerText = score;

        if (score === totalDots) {
            gameActive = false;
            setTimeout(() => {
                alert("¡Felicidades, ganaste! Te comiste todo.");
                location.reload();
            }, 100);
        }
    }
}

// Colisión con fantasmas
function checkCollision() {
    ghosts.forEach(ghost => {
        if (ghost.index === playerIndex) {
            gameActive = false;
            setTimeout(() => {
                alert("¡Oh no! Un fantasma te atrapó. Fin del juego.");
                location.reload();
            }, 100);
        }
    });
}

// Mover jugador
function movePlayer(event) {
    if (!gameActive) return;

    let direction = 0;
    if (event.key === "ArrowLeft") direction = -1;
    if (event.key === "ArrowRight") direction = 1;
    if (event.key === "ArrowUp") direction = -15;
    if (event.key === "ArrowDown") direction = 15;

    // Prevenir el scroll de la página con las flechas
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.code) > -1) {
        event.preventDefault();
    }

    const nextIndex = playerIndex + direction;

    // Validar que no sea pared
    if (direction !== 0 && layout[nextIndex] !== 1) {
        playerIndex = nextIndex;
        eatDot();
        checkCollision();
        draw();
    }
}

// Mover fantasmas de forma aleatoria
function moveGhosts() {
    if (!gameActive) return;

    ghosts.forEach(ghost => {
        const directions = [-1, 1, -15, 15]; // Izquierda, Derecha, Arriba, Abajo

        // Filtrar direcciones válidas (que no sean paredes)
        const validMoves = directions.filter(dir => layout[ghost.index + dir] !== 1);

        if (validMoves.length > 0) {
            // Escoger una dirección válida al azar
            const randomDir = validMoves[Math.floor(Math.random() * validMoves.length)];
            ghost.index += randomDir;
        }
    });

    checkCollision();
    draw();
}

draw();
document.addEventListener("keydown", movePlayer);
// Intervalo de movimiento de fantasmas (dificultad)
setInterval(moveGhosts, 400);