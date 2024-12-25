// Элементы
const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const exit = document.getElementById("exit");

// Размеры поля
const gameArea = document.getElementById("game-area");
const gameAreaRect = gameArea.getBoundingClientRect();

// Переменные для движения
let playerSpeed = 10;
let enemySpeed = 3;

// Установка начальных позиций
function setInitialPositions() {
    player.style.left = "50px";
    player.style.top = "50px";

    enemy.style.left = "80%";
    enemy.style.top = "50%";
}

// Движение игрока
window.addEventListener("keydown", (event) => {
    const rect = player.getBoundingClientRect();

    switch (event.key) {
        case "ArrowUp":
            if (rect.top > gameAreaRect.top) player.style.top = rect.top - playerSpeed + "px";
            break;
        case "ArrowDown":
            if (rect.bottom < gameAreaRect.bottom) player.style.top = rect.top + playerSpeed + "px";
            break;
        case "ArrowLeft":
            if (rect.left > gameAreaRect.left) player.style.left = rect.left - playerSpeed + "px";
            break;
        case "ArrowRight":
            if (rect.right < gameAreaRect.right) player.style.left = rect.left + playerSpeed + "px";
            break;
    }
});

// Движение Шлёпы (преследование игрока)
function moveEnemy() {
    const playerRect = player.getBoundingClientRect();
    const enemyRect = enemy.getBoundingClientRect();

    let dx = playerRect.left - enemyRect.left;
    let dy = playerRect.top - enemyRect.top;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Если Шлёпа достаточно далеко, он двигается к игроку
    if (distance > 50) {
        let moveX = (dx / distance) * enemySpeed;
        let moveY = (dy / distance) * enemySpeed;

        enemy.style.left = enemyRect.left + moveX + "px";
        enemy.style.top = enemyRect.top + moveY + "px";
    }

    // Проверка столкновений
    if (checkCollision(player, enemy)) {
        alert("Шлёпа поймал тебя! Игра окончена.");
        resetGame();
    }

    if (checkCollision(player, exit)) {
        alert("Поздравляем! Ты сбежал от Шлёпы!");
        resetGame();
    }

    requestAnimationFrame(moveEnemy);
}

// Проверка столкновений
function checkCollision(rect1, rect2) {
    const r1 = rect1.getBoundingClientRect();
    const r2 = rect2.getBoundingClientRect();

    return !(
        r1.right < r2.left ||
        r1.left > r2.right ||
        r1.bottom < r2.top ||
        r1.top > r2.bottom
    );
}

// Сброс игры
function resetGame() {
    setInitialPositions();
}

// Установить стартовые позиции и запустить движение Шлёпы
setInitialPositions();
moveEnemy();
