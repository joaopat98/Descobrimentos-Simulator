const hex_fac = Math.sqrt(3);

let use_last = false;
let y2;
let y1;

function gaussianRand(mean, stdev) {

    if (use_last) {
        y1 = y2;
        use_last = false;
    }
    else {
        let x1, x2, w;
        do {
            x1 = 2.0 * Math.random() - 1.0;
            x2 = 2.0 * Math.random() - 1.0;
            w = x1 * x1 + x2 * x2;
        } while (w >= 1.0);
        w = Math.sqrt((-2.0 * Math.log(w)) / w);
        y1 = x1 * w;
        y2 = x2 * w;
        use_last = true;
    }

    let retval = mean + stdev * y1;
    if (retval > 0)
        return retval;
    return -retval;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function angle(vertex_x, vertex_y, p1_x, p1_y, p2_x, p2_y) {
    function dist2(x1, y1, x2, y2) {
        return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
    }

    let P12 = dist2(vertex_x, vertex_y, p1_x, p1_y), P13 = dist2(vertex_x, vertex_y, p2_x, p2_y),
        P23 = dist2(p1_x, p1_y, p2_x, p2_y);
    return Math.acos(Math.max(-1, Math.min(1, (P12 + P13 - P23) / (2 * Math.sqrt(P12 * P13)))));
}

function convertToXY(tilesize, hex_x, hex_y) {
    let x = hex_x * 3 * tilesize + (3 / 2) * tilesize * (hex_y % 2);
    let y = hex_y * hex_fac * tilesize / 2;
    return {x: x, y: y};
}

class Hexagon extends createjs.Container {
    constructor(tilesize, hex_x, hex_y, tint = undefined, fill = undefined, clickable = false) {
        super();
        let self = this;
        this.tilesize = tilesize;
        this.hex_x = hex_x;
        this.hex_y = hex_y;
        let pos = convertToXY(tilesize, hex_x, hex_y);
        this.x = pos.x;
        this.y = pos.y;
        this.clickable = clickable;
        if (typeof(fill) === "object") {
            if (typeof(fill.img) !== "undefined") {
                this.map = new Sprite(fill.img, 0, 0, tilesize * hex_fac);
                this.addChild(this.map);
            }
            if (typeof(fill.frame) !== "undefined") {
                let frm = new createjs.Shape();
                frm.graphics.beginStroke(fill.frame).drawPolyStar(0, 0, tilesize, 6, 0, 120);
                this.addChild(frm);
            }
        }

        let hit = new createjs.Shape();
        hit.graphics.beginFill("rgba(0,0,0,255)").drawPolyStar(0, 0, tilesize, 6, 0, 120);
        hit.x = 0;
        hit.y = 0;
        this.hitArea = hit;
        let tintTile = function (ev) {
            if (self.clickable && ev.type === "mouseover")
                createjs.Tween.get(self.tint).to({alpha: self.tintAlpha}, 75);
            else
                createjs.Tween.get(self.tint).to({alpha: 0}, 75);
        };

        if (typeof(tint) !== "undefined") {
            this.tintAlpha = tint.alpha;
            this.tint = new createjs.Shape();
            this.tint.graphics.beginFill(tint.color).drawPolyStar(0, 0, tilesize, 6, 0, 120);
            this.tint.alpha = 0;
            this.tint.x = 0;
            this.tint.y = 0;
            this.addEventListener("mouseover", tintTile);
            this.addEventListener("mouseout", tintTile);
            this.addChild(this.tint);
        }
    }
}

class Tile extends Hexagon {
    constructor(tilesize, hex_x, hex_y, cost, dev, prize, hp, tint = undefined, frame, img, clickable = false, port = false, end = false, menu) {
        super(tilesize, hex_x, hex_y, tint, {frame: frame, img: img}, false);
        this.cost = cost;
        this.dev = dev;
        this.prize = prize;
        this.hp = hp;
        this.menu = menu;
        if (end || port) {
            let color;
            if (end)
                color = "green";
            else
                color = "blue";

            let point = new createjs.Shape();
            point.graphics.beginStroke("black").beginFill(color).drawCircle(0, 0, tilesize / 7);

            let halo = new createjs.Shape();
            halo.graphics.beginFill(color).drawPolyStar(0, 0, tilesize, 6, 0, 120);
            createjs.Tween.get(halo, {loop: true}).to({scale: 0.1, alpha: 1}, 0).to({
                scale: 1,
                alpha: 0.25
            }, 2000, createjs.Ease.sineOut).to({alpha: 0}, 500, createjs.Ease.sineOut);

            this.addChild(halo, point);
        }
    }

    getCost() {
        return Math.round(gaussianRand(this.cost, this.dev));
    }
}

class Unit extends Hexagon {
    constructor(tilesize, hex_x, hex_y, img, hexg) {
        super(tilesize, hex_x, hex_y, undefined, {img: img}, true);
        this.hexg = hexg;
        this.curTile = hexg.getTile(hex_x, hex_y);
        this.curTile.unit = this;
        this.moving = false;
    }

    fadeText(val) {
        let self = this;
        let text = new createjs.Text(String(val), "20px Helvetica", "red");
        text.x = 0;
        text.y = 0;
        self.addChild(text);
        let clean = function () {
            self.removeChild(text)
        };
        return createjs.Tween.get(text).to({y: -50, alpha: 0}, 500).call(clean);
    }
}

class Player extends Unit {
    constructor(tilesize, hex_x, hex_y, img, hexg, stats, hpbar, goldCounter, gameOverMenu) {
        super(tilesize, hex_x, hex_y, img, hexg);
        this.clickable = true;
        this.stats = stats;
        this.hpbar = hpbar;
        this.goldCounter = goldCounter;
        this.gameOverMenu = gameOverMenu;
    }

    moveTo(tile) {
        this.hexg.disableClickable();
        this.hex_x = tile.hex_x;
        this.hex_y = tile.hex_y;
        this.curTile.unit = undefined;
        this.curTile = tile;
        tile.unit = this;
        tile.dispatchEvent(new Event("mouseout"));
        let self = this;
        let reachTile = function () {
            self.hit(tile.getCost());
            self.getPrize(tile.prize);
            self.getHealth(tile.hp);
            tile.prize = undefined;
            tile.hp = undefined;
        };
        return createjs.Tween.get(this).to({
            x: tile.x,
            y: tile.y
        }, 1000, createjs.Ease.sineInOut).call(reachTile);
    }

    hit(val) {
        if (val !== undefined && val !== 0) {
            let self = this;
            let death = function () {
                if (self.stats.hp <= 0)
                    self.gameOverMenu.show(500);
            };
            this.stats.hp -= val;
            this.hpbar.update(this.stats.hp);
            this.fadeText(-val).call(death);
        }

    }

    getAttack() {
        return Math.round(gaussianRand(this.stats.firepower, this.stats.dev));
    }

    getHealth(val) {
        if (val !== undefined && val !== 0) {
            this.stats.hp += val;
            this.hpbar.update(this.stats.hp);
            let self = this;
            let text = new createjs.Text("+" + String(val), "20px Helvetica", "green");
            text.x = 0;
            text.y = 0;
            self.addChild(text);
            let clean = function () {
                self.removeChild(text)
            };
            return createjs.Tween.get(text).to({y: -50, alpha: 0}, 1500).call(clean);
        }
    }

    getPrize(val) {
        if (val !== undefined && val !== 0) {
            this.stats.gold += val;
            this.goldCounter.update(this.stats.gold);
            let self = this;
            let elem = new createjs.Container();
            let icon = new Sprite("Images/Icons/Ouro.png", 10, 10, 20);
            let margin = 4;
            let text = new createjs.Text("+" + String(val), "20px Helvetica", "white");
            text.x = 20 + margin;
            text.y = 0;
            elem.addChild(icon, text);
            this.addChild(elem);
            let clean = function () {
                self.removeChild(elem)
            };
            return createjs.Tween.get(elem).to({y: -50, alpha: 0}, 1500).call(clean);
        }
    }
}

class Enemy extends Unit {
    constructor(tilesize, hex_x, hex_y, img, hexg, char, radar, firepower, dev, hp, prize) {
        super(tilesize, hex_x, hex_y, img, hexg);
        this.clickable = true;
        this.char = char;
        this.radar = radar;
        this.firepower = firepower;
        this.dev = dev;
        this.hp = hp;
        this.prize = prize;
    }

    move() {
        let self = this;
        let final = undefined;
        let tiles = this.hexg.getAdjacent(this.hex_x, this.hex_y);
        if (dist(this.char.x, this.char.y, this.x, this.y) < this.radar * this.tilesize) {
            let ang = 360;
            for (let i = 0; i < tiles.length; i++) {
                let a = angle(this.x, this.y, this.char.x, this.char.y, tiles[i].x, tiles[i].y);
                if (a < ang) {
                    ang = a;
                    final = tiles[i];
                }
            }
            console.log(ang);
        }
        else {
            final = tiles[Math.floor(Math.random() * (tiles.length))]

        }
        if (final !== undefined) {
            this.curTile.unit = undefined;
            this.curTile = final;
            final.unit = this;
            this.hex_x = final.hex_x;
            this.hex_y = final.hex_y;
            let activateClick = function () {
                self.char.moving = false;
                self.hexg.updateClickable(self.char);
                if (HexGrid.isAdjacent(self.char.hex_x, self.char.hex_y, self.hex_x, self.hex_y)) {
                    playSound(Sound.cannon);
                    self.char.hit(self.getAttack());
                }

            };
            createjs.Tween.get(this).to({
                x: final.x,
                y: final.y
            }, 1000, createjs.Ease.sineInOut).call(activateClick);
        }
    }

    die() {
        let self = this;

        function clean() {
            self.hexg.removeEnemy(self);
            self.char.moving = false;
            this.curTile.unit = undefined;
            self.hexg.updateClickable(self.char);

        }

        return createjs.Tween.get(self).to({alpha: 0}, 1000).call(clean);
    }

    getAttack() {
        return Math.round(gaussianRand(this.firepower, this.dev));
    }

    hit(val) {
        let self = this;
        let check = function () {
            if (self.hp <= 0)
                self.die();
        };
        this.hp -= val;
        playSound(Sound.cannon);
        return this.fadeText(-val).call(check);
    }

    shoot() {
        let self = this;
        if (this.char.stats.hp > 0 && this.hp > 0) {
            this.char.hit(this.getAttack());
            let restart = function () {
                self.shoot();
            };
            this.hit(this.char.getAttack()).call(restart);

        }
        else {
            if (this.hp <= 0) {
                this.char.getPrize(this.prize);
            }
        }
    };
}

class HexGrid extends createjs.Container {
    constructor(tilesize, tint, frame) {
        super();
        this.tilesize = tilesize;
        this.frame = frame;
        this.tint = tint;
        this.tiles = [];
        this.enemies = [];
    }

    /*
    static isAdjacent(t1, t2) {
        switch (t1.hex_y - t2.hex_y) {
            case 2:
            case -2:
                return t1.hex_x === t2.hex_x;
            case 1:
            case -1:
                return t1.hex_x === t2.hex_x || (t2.hex_x === t1.hex_x + 1 && t1.hex_y % 2 === 1) || (t2.hex_x === t1.hex_x - 1 && t1.hex_y % 2 === 0);
        }
        return false;
    }

    static isAdjacent(hex_x, hex_y, tile) {
        switch (tile.hex_y - hex_y) {
            case 2:
            case -2:
                return tile.hex_x === hex_x;
            case 1:
            case -1:
                return tile.hex_x === hex_x || (hex_x === tile.hex_x + 1 && tile.hex_y % 2 === 1) || (hex_x === tile.hex_x - 1 && tile.hex_y % 2 === 0);
        }
        return false;
    }
    */

    static isAdjacent(hex_x1, hex_y1, hex_x2, hex_y2) {
        switch (hex_y1 - hex_y2) {
            case 2:
            case -2:
                return hex_x1 === hex_x2;
            case 1:
            case -1:
                return hex_x1 === hex_x2 || (hex_x2 === hex_x1 + 1 && hex_y1 % 2 === 1) || (hex_x2 === hex_x1 - 1 && hex_y1 % 2 === 0);
        }
        return false;
    }

    updateClickable(char) {
        for (let i = 0; i < this.tiles.length; i++)
            this.tiles[i].clickable = HexGrid.isAdjacent(char.hex_x, char.hex_y, this.tiles[i].hex_x, this.tiles[i].hex_y) && this.tiles[i].unit === undefined;
    }

    disableClickable() {
        for (let i = 0; i < this.tiles.length; i++)
            this.tiles[i].clickable = false;
    }

    newHex(hex_x, hex_y, cost, dev, prize, hp, click, port, end, img = undefined, menu = undefined) {
        let hex = new Tile(this.tilesize, hex_x, hex_y, cost, dev, prize, hp, this.tint, this.frame, img, false, port, end, menu);
        this.tiles.push(hex);
        hex.addEventListener("click", click);
        this.addChild(hex);
    }

    addEnemy(enemy) {
        this.enemies.push(enemy);
        this.addChild(enemy);
    }

    removeEnemy(enemy) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.removeChild(enemy);
    }

    getAdjacent(hex_x, hex_y) {
        let tiles = [];
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].unit === undefined && HexGrid.isAdjacent(hex_x, hex_y, this.tiles[i].hex_x, this.tiles[i].hex_y))
                tiles.push(this.tiles[i]);
        }
        return tiles;
    }

    getTile(hex_x, hex_y) {
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].hex_x === hex_x && this.tiles[i].hex_y === hex_y)
                return this.tiles[i];
        }
        return null;
    }
}