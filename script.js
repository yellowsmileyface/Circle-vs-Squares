import { game, circle, text, centeredText, rectangle } from "./components.js";
import { getBestScore, setBestScore } from "./bestscore.js";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("./sw.js");
}

game.init();

const WIDTH = function() {return game.area.width;}
const HEIGHT = function() {return game.area.height;}

const ENEMIES = [];

const SCORE = new text(10, 30, "Score: 0", "25px Arial", "white", 0, 0);

const PLAYER = new circle(35, HEIGHT()/2, 20, "skyblue", 0, 0, player => {
    if (player.HEALTH <= 0) {
        game.deletecomponent(player.name);
        if (PLAYER.score > (getBestScore() || 0)) setBestScore(PLAYER.score);
        game.addcomponent("lose screen", new rectangle(0, 0, window.innerWidth, window.innerHeight, "black", 0, 0));
        game.addcomponent("final score", new centeredText(WIDTH()/2, HEIGHT()/2-25, `Score: ${PLAYER.score}`, "40px Arial", "white", 0, 0));
        game.addcomponent("best score", new centeredText(WIDTH()/2, HEIGHT()/2+25, `Best score: ${getBestScore() || 0}`, "40px Arial", "white", 0, 0));
        game.addcomponent("play again", new centeredText(WIDTH()/2, HEIGHT()-35, "Press Enter to play again", "20px Arial", "white", 0, 0));
        window.addEventListener("keydown", (e) => {
            if (e.code == "Enter") window.location.reload();
        });
        clearInterval(PLAYER.shooting);
        clearInterval(PLAYER.blueEnemies);
        if (typeof PLAYER.greenEnemies === "number") clearInterval(PLAYER.greenEnemies);
        if (typeof PLAYER.blackEnemies === "number") clearInterval(PLAYER.blackEnemies);
        if (typeof PLAYER.randomEnemies === "number") clearInterval(PLAYER.randomEnemies);
        if (typeof PLAYER.yMoveEnemies === "number") clearInterval(PLAYER.yMoveEnemies);
    }
    if (player.score >= 12) {
        if (typeof PLAYER.greenEnemies === "function") {
            PLAYER.greenEnemies = PLAYER.greenEnemies();
        }
    }
    if (player.score >= 40) {
        if (typeof PLAYER.blackEnemies === "function") {
            PLAYER.blackEnemies = PLAYER.blackEnemies();
        }
    }
    if (player.score >= 48) {
        clearInterval(PLAYER.blueEnemies);
    }
    if (player.score >= 60) {
        if (typeof PLAYER.randomEnemies === "function") {
            PLAYER.randomEnemies = PLAYER.randomEnemies();
        }
    }
    if (player.score >= 100) {
        if (typeof PLAYER.yMoveEnemies === "function") {
            PLAYER.yMoveEnemies = PLAYER.yMoveEnemies();
        }
    }
});
PLAYER.numberOfBullets = 0;
PLAYER.numberOfEnemies = function() {return ENEMIES.length;}
PLAYER.HEALTH = 100;
PLAYER.score = 0;
PLAYER.greenEnemies = function() {
    return setInterval(() => {
        const ENEMY = new rectangle(WIDTH() - 60, Math.floor(Math.random() * (HEIGHT() - 110)) + 35, 50, 50, "green", Math.random() * (-2) - 2, 0, enemy => {
            if (enemy.HEALTH <= 0) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                PLAYER.score += 1;
                SCORE.text = `Score: ${PLAYER.score}`;
            }
            if (enemy.x <= -50) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                (PLAYER.HEALTH >= 4) ? PLAYER.HEALTH -= 4 : PLAYER.HEALTH = 0;
                PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
            }
        });
        ENEMY.HEALTH = 30;
        ENEMIES.push(ENEMY);
        game.addcomponent(`enemy${PLAYER.numberOfEnemies()}`, ENEMY);
    }, 8720);
}

PLAYER.blackEnemies = function() {
    return setInterval(() => {
        const ENEMY = new rectangle(WIDTH() - 60, Math.floor(Math.random() * (HEIGHT() - 110)) + 35, 50, 50, "black", Math.random() * (-2) - 1, 0, enemy => {
            if (enemy.HEALTH <= 0) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                PLAYER.score += 1;
                SCORE.text = `Score: ${PLAYER.score}`;
            }
            if (enemy.x <= -50) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                (PLAYER.HEALTH >= 5) ? PLAYER.HEALTH -= 5 : PLAYER.HEALTH = 0;
                PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
            }
            enemy.speedX = Math.random() * (-2) - 1;
        });
        ENEMY.HEALTH = 35;
        ENEMIES.push(ENEMY);
        game.addcomponent(`enemy${PLAYER.numberOfEnemies()}`, ENEMY)
    }, 11250)
}

PLAYER.randomEnemies = function() {
    return setInterval(() => {
        const ENEMY = new rectangle(WIDTH() - 60, Math.floor(Math.random() * (HEIGHT() - 110)) + 35, 50, 50, ["yellow", "orange", "purple", "gray"][Math.floor(Math.random() * 4)], Math.random() * (-2) - 2, 0, enemy => {
            if (enemy.HEALTH <= 0) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                PLAYER.score += 2;
                SCORE.text = `Score: ${PLAYER.score}`;
            }
            if (enemy.x <= -50) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                (PLAYER.HEALTH >= 7) ? PLAYER.HEALTH -= 7 : PLAYER.HEALTH = 0;
                PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
            }
        });
        ENEMY.HEALTH = 25;
        ENEMIES.push(ENEMY);
        game.addcomponent(`enemy${PLAYER.numberOfEnemies()}`, ENEMY);
    }, 7500);
}

PLAYER.yMoveEnemies = function() {
    return setInterval(() => {
        const ENEMY = new rectangle(WIDTH() - 60, Math.floor(Math.random() * (HEIGHT() - 110)) + 35, 50, 50, ["brown", "hotpink", "white", "darkolivegreen"][Math.floor(Math.random() * 4)], Math.random() * (-2), 0, enemy => {
            if (enemy.HEALTH <= 0) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                PLAYER.score += 2;
                PLAYER.HEALTH += 2;
                SCORE.text = `Score: ${PLAYER.score}`;
            }
            if (enemy.x <= -50) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                (PLAYER.HEALTH >= 7) ? PLAYER.HEALTH -= 7 : PLAYER.HEALTH = 0;
                PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
            }
            enemy.speedY = Math.floor(Math.random() * 6) - 3;
        });
        ENEMY.HEALTH = 20;
        ENEMIES.push(ENEMY);
        game.addcomponent(`enemy${PLAYER.numberOfEnemies()}`, ENEMY);
    }, 13500);
}

PLAYER.HEALTH_INDICATOR = new text(150, 30, "Health: 100", "25px Arial", "white", 0, 0);

window.addEventListener("keydown", function(e) {
    e.preventDefault();
    switch(e.code) {
        case "ArrowLeft":
        case "KeyA":
            PLAYER.speedX = -5;
            break;
        case "ArrowRight":
        case "KeyD":
            PLAYER.speedX = 5;
            break;
        case "ArrowUp":
        case "KeyW":
            PLAYER.speedY = -5;
            break;
        case "ArrowDown":
        case "KeyS":
            PLAYER.speedY = 5;
    }
    if (PLAYER.x - 5 < 20)
        PLAYER.x = 20;
    if (PLAYER.x + 5 > WIDTH() - 20)
        PLAYER.x = WIDTH() - 20;
    if (PLAYER.y - 5 < 55)
        PLAYER.y = 55;
    if (PLAYER.y + 5 > HEIGHT() - 55)
        PLAYER.y = HEIGHT() - 55;
});
window.addEventListener("keyup", function(e) {
    e.preventDefault();
    switch(e.code) {
        case "ArrowRight":
        case "ArrowLeft":
        case "KeyA":
        case "KeyD":
            PLAYER.speedX = 0;
            break;
        case "ArrowUp":
        case "ArrowDown":
        case "KeyW":
        case "KeyS":
            PLAYER.speedY = 0;
    }
    if (PLAYER.x - 5 < 20)
        PLAYER.x = 20;
    if (PLAYER.x + 5 > WIDTH() - 20)
        PLAYER.x = WIDTH() - 20;
    if (PLAYER.y - 5 < 55)
        PLAYER.y = 55;
    if (PLAYER.y + 5 > HEIGHT() - 55)
        PLAYER.y = HEIGHT() - 55;
});

window.onload = function() {
    PLAYER.shooting = setInterval(() => {
        game.addcomponent(`bullet${PLAYER.numberOfBullets}`, new circle(PLAYER.x, PLAYER.y, 5, "red", 24, 0, bullet => {
            if (bullet.x > 1.5 * window.innerWidth) {
                game.deletecomponent(bullet.name);
            }
            for (let enemy of ENEMIES) {
                if (typeof enemy !== "undefined") {
                    if ((enemy.x <= bullet.x) && (bullet.x <= (enemy.x + enemy.width)) && (bullet.y >= enemy.y) && ((enemy.y + enemy.height) >= bullet.y)) {
                        enemy.HEALTH -= 5;
                        game.deletecomponent(bullet.name);
                    }
                }
            }
        }));
        PLAYER.numberOfBullets += 1;
    }, 480);
    PLAYER.blueEnemies = setInterval(() => {
        const ENEMY = new rectangle(WIDTH() - 64, Math.random() * (HEIGHT() - 110) + 35, 50, 50, "blue", Math.random() * (-2), 0, enemy => {
            if (enemy.HEALTH <= 0) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                PLAYER.score += 1;
                SCORE.text = `Score: ${PLAYER.score}`;
            }
            if (enemy.x <= -50) {
                game.deletecomponent(enemy.name);
                ENEMIES[ENEMIES.indexOf(enemy)] = undefined;
                (PLAYER.HEALTH >= 6) ? PLAYER.HEALTH -= 6 : PLAYER.HEALTH = 0;
                PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
            }
        });
        ENEMY.HEALTH = 40;
        ENEMIES.push(ENEMY)
        game.addcomponent(`enemy${PLAYER.numberOfEnemies()}`, ENEMY);
    }, 4260);
};

PLAYER.heal = setInterval(function() {
    if (PLAYER.HEALTH > 0) {
        PLAYER.HEALTH += 3;
        PLAYER.HEALTH_INDICATOR.text = `Health: ${PLAYER.HEALTH}`;
    }
}, 24000);

const WALL1 = new rectangle(0, 0, WIDTH, 35, "brown", 0, 0)
const WALL2 = new rectangle(0, () => HEIGHT()-30, WIDTH, 35, "black", 0, 0);

game.addcomponent("player", PLAYER);
game.addcomponent("wall1", WALL1);
game.addcomponent("wall2", WALL2);
game.addcomponent("score", SCORE);
game.addcomponent("health indicator", PLAYER.HEALTH_INDICATOR);

document.body.appendChild(game.area);
game.play();