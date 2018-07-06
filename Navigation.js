"use strict";

class NavArea extends createjs.Container {
    constructor(hexGrid) {
        super();
        this.hexGrid = hexGrid;
        this.addChild(this.background);
        this.addChild(this.hexGrid)
    }
}

class Navigation extends createjs.Container {
    constructor(territory, expedition, stats, mainWindow) {
        super();

        let curStats = stats;

        let winMenu = new WinMenu(this, mainWindow, territory);

        let tileClick = function (ev) {
            let target = ev.currentTarget;
            if (!char.moving && HexGrid.isAdjacent(char.hex_x, char.hex_y, target.hex_x, target.hex_y) && (target.clickable)) {
                char.moving = true;
                if (target.menu !== undefined)
                    target.menu.show(1000);
                else {
                    let finish_move = function () {
                        for (let i = 0; i < hexg.enemies.length; i++)
                            hexg.enemies[i].move();
                        if (hexg.enemies.length === 0)
                            char.moving = false;
                        hexg.updateClickable(char);
                    };
                    char.moveTo(target).call(finish_move);
                }
            }
        };


        this.background = new createjs.Bitmap(expedition.background);
        this.background.x = expedition.background_properties.x;
        this.background.y = expedition.background_properties.y;
        this.background.scale = expedition.background_properties.scale;
        this.addChild(this.background);

        let hexg = new HexGrid(expedition.tilesize, expedition.tint, expedition.frame);
        for (let i = 0; i < expedition.hexmap.length; i++) {
            let tile = expedition.hexmap[i];
            let menu = undefined;
            if (tile.end)
                menu = winMenu;
            hexg.newHex(tile.x, tile.y, tile.cost, tile.dev, tile.prize, tile.hp, tileClick, tile.port, tile.end, tile.img, menu);
        }
        let hud = new createjs.Container();
        let bar = new Bar(10, 200, 100, 15, curStats.hp, "red");
        let goldCounter = new Counter(10, 220, 20, "Images/Icons/Ouro.png", stats.gold);
        hud.addChild(bar, goldCounter);

        let gameOverMenu = new GameOverMenu(this, mainWindow);

        let char = new Player(expedition.tilesize, expedition.start_x, expedition.start_y, expedition.boatImg, hexg, stats, bar, goldCounter, gameOverMenu);

        let navArea = new NavArea(hexg);
        navArea.x = expedition.map_x;
        navArea.y = expedition.map_y;

        for (let i = 0; i < expedition.enemies.length; i++) {
            let enemy = expedition.enemies[i];
            enemy = new Enemy(expedition.tilesize, enemy.x, enemy.y, enemy.img, hexg, char, enemy.radar, enemy.firepower, enemy.dev, enemy.hp, enemy.prize);
            enemy.addEventListener("click", tileClick);
            enemy.menu = new AttackMenu(char, stats, enemy, bar);
            hexg.addEnemy(enemy);
        }

        hexg.addChild(char);
        this.addChild(navArea);
        this.addChild(gameOverMenu);
        this.addChild(winMenu);

        this.addChild(hud);
        for (let i = 0; i < hexg.enemies.length; i++) {
            this.addChild(hexg.enemies[i].menu);
        }

        hexg.updateClickable(char);
    }

    show(time) {
        playSound(Sound.wave, true);
        return createjs.Tween.get(this).to({alpha: 1, x: 0}, time, createjs.Ease.sineOut);
    }

    hide(time) {
        stopSound(Sound.wave);
        let size = getScreenDimensions();
        return createjs.Tween.get(this).to({alpha: 0, x: size.w}, time, createjs.Ease.sineIn);
    }
}