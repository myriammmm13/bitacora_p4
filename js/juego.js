const board = document.getElementById("game-board");
const scoreDisplay = document.getElementById("score");
const totalDisplay = document.getElementById("total");

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
let playerIndex = 16; // Posición de inicio del jugador
let gameActive = true;

// Enemigos
const ghosts = [
    { index: 28, color: '#FF0000' }, // Rojo
    { index: 196, color: '#FFB8FF' }, // Rosa
    { index: 118, color: '#00FFFF' }  // Cyan
];

// Función para renderizar el mapa
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
            totalDots++; // Contamos el total para la condición de victoria
        }

        board.appendChild(cell);
        cells.push(cell);
    }
    totalDisplay.innerText = totalDots;
}

createBoard();

// Función para dibujar jugador y fantasmas en sus posiciones
function draw() {
    // Limpiar posiciones anteriores
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

// REQUISITO: Sistema de puntuación y Condición de victoria
function eatDot() {
    if (layout[playerIndex] === 0) {
        layout[playerIndex] = 2; // Marcar la celda como vacía
        const dot = cells[playerIndex].querySelector('.dot');
        if (dot) dot.remove();
        score++;
        scoreDisplay.innerText = score;

        // Verificar si ganó
        if (score === totalDots) {
            gameActive = false;
            setTimeout(() => {
                alert("¡VICTORIA! Has recolectado todos los puntos.");
                location.reload();
            }, 100);
        }
    }
}

// REQUISITO: Detección de colisión (Jugador - Enemigo) y Condición de derrota
function checkCollision() {
    ghosts.forEach(ghost => {
        if (ghost.index === playerIndex) {
            gameActive = false;
            setTimeout(() => {
                alert("¡DERROTA! Un fantasma te ha atrapado.");
                location.reload();
            }, 100);
        }
    });
}

// REQUISITO: Movimiento mediante el teclado
function movePlayer(event) {
    if (!gameActive) return;

    let direction = 0;
    if (event.key === "ArrowLeft") direction = -1;
    if (event.key === "ArrowRight") direction = 1;
    if (event.key === "ArrowUp") direction = -15;
    if (event.key === "ArrowDown") direction = 15;

    // Evitar que la pantalla haga scroll al jugar
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].indexOf(event.key) > -1) {
        event.preventDefault();
    }

    const nextIndex = playerIndex + direction;

    // Validar que el siguiente movimiento no sea una pared
    if (direction !== 0 && layout[nextIndex] !== 1) {
        playerIndex = nextIndex;
        eatDot();
        checkCollision();
        draw();
    }
}

// REQUISITO: Enemigos con comportamiento básico (Movimiento Aleatorio)
function moveGhosts() {
    if (!gameActive) return;

    ghosts.forEach(ghost => {
        const directions = [-1, 1, -15, 15]; // Izquierda, Derecha, Arriba, Abajo

        // Filtrar solo las direcciones que no chocan con paredes
        const validMoves = directions.filter(dir => layout[ghost.index + dir] !== 1);

        if (validMoves.length > 0) {
            // Seleccionar un movimiento aleatorio de los válidos
            const randomDir = validMoves[Math.floor(Math.random() * validMoves.length)];
            ghost.index += randomDir;
        }
    });

    checkCollision();
    draw();
}

// Inicializar el juego
draw();
document.addEventListener("keydown", movePlayer);
// Intervalo para mover automáticamente a los fantasmas (400 milisegundos)
setInterval(moveGhosts, 400);
