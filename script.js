
    // Получаем элементы
    const player = document.getElementById("player");
    const enemy = document.getElementById("enemy");
    const exit = document.getElementById("exit");
    const gameArea = document.getElementById("game-area");

    // Препятствия
    const obstacles = [];

    // Размеры поля (будем использовать, чтобы не выставлять врага за границы)
    const gameAreaRect = gameArea.getBoundingClientRect();

    // Скорость игрока и противника
    let playerSpeed = 10;
    let enemySpeed = 2;

    // Создание препятствия
    function createObstacle(x, y, width, height) {
      const obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.left = x + "px";
      obstacle.style.top = y + "px";
      obstacle.style.width = width + "px";
      obstacle.style.height = height + "px";
      obstacle.style.position = "absolute";
      obstacle.style.backgroundColor = "brown";
      gameArea.appendChild(obstacle);
      obstacles.push(obstacle);
    }

    // Установка начальных позиций
    function setInitialPositions() {
      // Позиция игрока
      player.style.left = "50px";
      player.style.top = "50px";

      // Позиция выхода (просто 90% для примера)
      exit.style.left = "90%";
      exit.style.top = "90%";

      // Случайная позиция для Шлёпы
      // Чтобы не вылезать за границы, учтём его примерную ширину/высоту (100px)
      // и границы поля
      const maxX = gameAreaRect.width - 100;
      const maxY = gameAreaRect.height - 100;
      let randomX = Math.floor(Math.random() * maxX);
      let randomY = Math.floor(Math.random() * maxY);

      enemy.style.left = randomX + "px";
      enemy.style.top = randomY + "px";

      // Очищаем и пересоздаём препятствия
      obstacles.forEach(obstacle => obstacle.remove());
      obstacles.length = 0;
      createObstacle(200, 200, 100, 20);
      createObstacle(400, 0, 20, 200);
      createObstacle(300, 300, 50, 50);
      createObstacle(900,0,20,500)
      createObstacle(500, 200, 20, 475)
      createObstacle(400, 200, 120, 20)
      createObstacle(0, 500, 200, 20)
      createObstacle(500, 750, 20, 200)
      createObstacle(250, 500, 300, 20)
    }

    // Проверка столкновения с препятствиями
    function isCollidingWithObstacles(x, y, width, height) {
      return obstacles.some(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();
        return (
          x < obstacleRect.right &&
          x + width > obstacleRect.left &&
          y < obstacleRect.bottom &&
          y + height > obstacleRect.top
        );
      });
    }

    // Движение игрока
    function movePlayer(event) {
      const playerRect = player.getBoundingClientRect();
      let newLeft = player.offsetLeft;
      let newTop = player.offsetTop;

      switch (event.key) {
        case "ArrowUp":
          if (playerRect.top > gameAreaRect.top) {
            newTop -= playerSpeed;
          }
          break;
        case "ArrowDown":
          if (playerRect.bottom < gameAreaRect.bottom) {
            newTop += playerSpeed;
          }
          break;
        case "ArrowLeft":
          if (playerRect.left > gameAreaRect.left) {
            newLeft -= playerSpeed;
          }
          break;
        case "ArrowRight":
          if (playerRect.right < gameAreaRect.right) {
            newLeft += playerSpeed;
          }
          break;
      }

      // Проверяем столкновение с препятствиями
      if (
        !isCollidingWithObstacles(
          newLeft,
          newTop,
          playerRect.width,
          playerRect.height
        )
      ) {
        player.style.left = newLeft + "px";
        player.style.top = newTop + "px";
      }
    }

    // Проверка столкновения между двумя элементами
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

    // Движение противника (Шлёпы)
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

      // Проверяем коллизию c игроком
      if (checkCollision(player, enemy)) {
        alert("Шлёпа поймал тебя! Игра окончена.");
        resetGame(); // после проигрыша сбрасываем игру
      }

      // Проверяем коллизию с «выходом»
      if (checkCollision(player, exit)) {
        alert("Поздравляем! Ты сбежал от Шлёпы!");
        resetGame(); // после выигрыша сбрасываем игру
      }

      requestAnimationFrame(moveEnemy);
    }

    // Сброс игры (вызываем setInitialPositions)
    function resetGame() {
      setInitialPositions();
    }

    // Инициализация игры
    function init() {
      document.addEventListener("keydown", movePlayer);
    }

    // Когда вся страница загружена, запускаем игру
    document.addEventListener('DOMContentLoaded', () => {
      setInitialPositions(); // Устанавливаем все начальные позиции
      init();               // Включаем обработчики
      moveEnemy();          // Запускаем движение противника
    });
