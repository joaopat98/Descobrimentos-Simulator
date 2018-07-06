function getScreenDimensions() {
    let canvas = document.getElementById("canvas");
    return {w: canvas.width, h: canvas.height};
}

function subObject(obj, sub) {
    let prop;
    for (prop in sub)
        obj[prop] -= sub[prop];
}

function centerText(text) {
    text.x = -(text.getBounds().width / 2);
    text.y = -(text.getBounds().height / 2);
    return text;
}

class CenteredText extends createjs.Container {
    constructor(text, font, color) {
        super();
        this.textElement = centerText(new createjs.Text(text, font, color));
        this.addChild(this.textElement);
    }

    updateText(text) {
        this.textElement.text = text;
        this.textElement = centerText(this.textElement);
    }
}

class Sprite extends createjs.Container {

    constructor(path, x, y, size) {
        let img = new Image();
        super(img);
        this.x = x;
        this.y = y;
        let self = this;
        img.onload = function () {
            let map = new createjs.Bitmap(img);
            map.scale = Math.min(size / img.naturalWidth, size / img.naturalHeight);
            map.x = -map.getBounds().width * map.scale / 2;
            map.y = -map.getBounds().height * map.scale / 2;
            self.addChild(map);
        };
        img.src = path;
    }
}

class SpriteButton extends Sprite {
    constructor(path, x, y, size, action) {
        super(path, x, y, size);

        function click() {
            playSound(Sound.click);
            action();
        }

        this.addEventListener("click", click);
    }
}

class Button extends createjs.Container {
    constructor(x, y, w, h, text, props, textProps, tint, action) {
        super();
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.clickable = true;
        let graphic = new createjs.Shape();
        graphic.graphics.beginFill(props.fill).beginStroke(props.stroke).drawRoundRect(-w / 2, -h / 2, w, h, props.round);
        this.textObj = new CenteredText(text, textProps.size + "px " + textProps.font, textProps.color);
        this.addChild(graphic);
        this.addChild(this.textObj);

        function click() {
            playSound(Sound.click);
            action();
        }

        this.addEventListener("click", click);
        let self = this;
        if (tint !== undefined) {
            let hit = new createjs.Shape();
            hit.graphics.beginFill("black").drawRoundRect(-w / 2, -h / 2, w, h, props.round);
            this.hitArea = hit;
        }
        let tintTile = function (ev) {
            console.log(text);
            if (self.clickable && ev.type === "mouseover")
                createjs.Tween.get(self.tint).to({alpha: self.tintAlpha}, 75);
            else
                createjs.Tween.get(self.tint).to({alpha: 0}, 75);
        };

        if (typeof(tint) !== "undefined") {
            this.tintAlpha = tint.alpha;
            this.tint = new createjs.Shape();
            this.tint.graphics.beginFill(tint.color).drawRoundRect(-w / 2, -h / 2, w, h, props.round);
            this.tint.alpha = 0;
            this.tint.x = 0;
            this.tint.y = 0;
            this.addEventListener("mouseover", tintTile);
            this.addEventListener("mouseout", tintTile);
            this.addChild(this.tint);
        }
    }
}

class Menu extends createjs.Container {
    constructor(w, h, title, elements, props, textProps) {
        super();
        let mainWindow = new createjs.Shape();
        mainWindow.graphics.beginStroke(props.stroke).beginFill(props.fill).drawRect(-w / 2, -h / 2, w, h);
        mainWindow.x = 0;
        mainWindow.y = 0;
        this.addChild(mainWindow);
        let banner = new createjs.Text(title, textProps.size + "px " + textProps.font, textProps.color);
        banner.textAlign = "center";
        banner.x = 0;
        banner.y = props.b_y;
        this.addChild(banner);
        for (let i = 0; i < elements.length; i++)
            this.addChild(elements[i]);
        this.hide(0);

    }

    show(time) {
        let size = getScreenDimensions();
        return createjs.Tween.get(this).to({alpha: 1, x: size.w / 2, y: size.h / 2}, time, createjs.Ease.sineOut);
    }

    hide(time) {
        let size = getScreenDimensions();
        return createjs.Tween.get(this).to({alpha: 0, x: size.w / 2, y: -size.h / 2}, time, createjs.Ease.sineIn);
    }
}

class Box extends createjs.Shape {
    constructor(w, h, stroke, fill, margin) {
        super();
        this.x = 0;
        this.y = 0;
        this.graphics.beginStroke(stroke).beginFill(fill).drawRect(-w / 2 - margin, -h / 2 - margin, w + 2 * margin, h + 2 * margin);
    }
}

class AttackMenu extends Menu {
    constructor(char, stats, enemy, gameOverMenu) {
        let self;
        let attack = function () {
            let shoot = function () {
                enemy.shoot();
            };
            self.hide(1000).call(shoot);
        };

        let cancel = function () {
            let clean = function () {
                char.moving = false;
            };
            self.hide(1000).call(clean);
        };

        let margin = 100;
        let box_margin = 10;

        let playerStats = new CenteredText("Jogador:\nPoder de fogo: " + char.stats.firepower + "\nHP: " + char.stats.hp, "20px Helvetica", "black");
        let boxPlayer = new Box(playerStats.getBounds().width, playerStats.getBounds().height, "black", "white", box_margin);
        let playerInfo = new createjs.Container();
        playerInfo.x = -100;
        playerInfo.y = 0;
        playerInfo.addChild(boxPlayer);
        playerInfo.addChild(playerStats);

        let enemyStats = new CenteredText("Inimigo:\nPoder de fogo: " + enemy.firepower + "\nHP: " + enemy.hp, "20px Helvetica", "black");
        let boxEnemy = new Box(enemyStats.getBounds().width, enemyStats.getBounds().height, "black", "white", box_margin);
        let enemyInfo = new createjs.Container();
        enemyInfo.x = 100;
        enemyInfo.y = 0;
        enemyInfo.addChild(boxEnemy);
        enemyInfo.addChild(enemyStats);

        let attackButton = new Button(-150, 150, 200, 60, "Atacar", {
            fill: "turquoise",
            stroke: "black",
            round: 5
        }, {font: "Helvetica", size: 20, color: "black"}, {color: "green", alpha: 0.5}, attack);
        let cancelButton = new Button(150, 150, 200, 60, "Cancelar", {
            fill: "turquoise",
            stroke: "black",
            round: 5
        }, {font: "Helvetica", size: 20, color: "black"}, {color: "green", alpha: 0.5}, cancel);
        super(700, 500, "Abordagem!", [attackButton, cancelButton, playerInfo, enemyInfo], {
            stroke: "black",
            fill: "beige",
            b_y: -getScreenDimensions().h / 2 + margin * 2
        }, {
            color: "black",
            size: 30,
            font: "Helvetica"
        });
        self = this;
        this.char = char;
        this.playerStats = playerStats;
        this.enemyStats = enemyStats;
        this.enemy = enemy;
    }

    updatePlayerText() {
        this.playerStats.textElement.text = "Jogador:\nPoder de fogo: " + this.char.stats.firepower + "\nHP: " + this.char.stats.hp;
    }

    updateEnemyText() {
        this.enemyStats.textElement.text = "Inimigo:\nPoder de fogo: " + this.enemy.firepower + "\nHP: " + this.enemy.hp;
    }

    show(time) {
        this.updatePlayerText();
        this.updateEnemyText();
        super.show(time)
    }
}

class GameOverMenu extends Menu {
    constructor(navWindow, mainScreen) {
        let exitClick = function () {
            navWindow.hide(1000);
            mainScreen.show(1000);
        };

        let exitButton = new Button(0, 150, 300, 100, "Ecrã Principal", {
            stroke: "black",
            fill: "Crimson",
            round: 8
        }, {font: "Helvetica", size: 35, color: "black"}, {color: "LightPink", alpha: 0.5}, exitClick);

        super(700, 500, "GAME OVER", [exitButton], {fill: "beige", stroke: "black", b_y: -200}, {
            color: "DarkRed",
            size: 100,
            font: "Pirata One"
        });
    }
}

class WinMenu extends Menu {
    constructor(navWindow, mainScreen, territory) {
        let exitClick = function () {
            territory.conquered = true;
            navWindow.hide(1000);
            mainScreen.show(1000);
        };

        let exitButton = new Button(0, 150, 300, 100, "Ecrã Principal", {
            stroke: "black",
            fill: "Green",
            round: 8
        }, {font: "Helvetica", size: 35, color: "black"}, {color: "LightGreen", alpha: 0.5}, exitClick);

        super(700, 500, "PARABÉNS!", [exitButton], {fill: "beige", stroke: "black", b_y: -200}, {
            color: "DarkGreen",
            size: 100,
            font: "Pirata One"
        });
    }
}

class TerritoryButton extends Button {
    constructor(x, y, action) {
        super(x, y, 10, 10, " ", {round: 5, fill: "red",}, {}, {color: "orange", alpha: 0.7}, action);
    }
}

class FacilityMenu extends Menu {
    constructor(facility, stats) {
        function checkResources() {
            let c = Values.lvlCosts[val];
            return stats.wood >= c.wood[facility.lvl + 1] && stats.iron >= c.iron[facility.lvl + 1] && stats.rock >= c.rock[facility.lvl + 1];
        }

        function updateCounters() {
            let c = Values.lvlCosts[val];
            woodCounter.update(c.wood[facility.lvl + 1]);
            ironCounter.update(c.iron[facility.lvl + 1]);
            rockCounter.update(c.rock[facility.lvl + 1]);
        }

        let lvlUpClick = function () {
            if (checkResources()) {
                if (facility.lvl < facility.maxLvl) {
                    let c = Values.lvlCosts[val];
                    subObject(stats, {
                        wood: c.wood[facility.lvl + 1],
                        iron: c.iron[facility.lvl + 1],
                        rock: c.rock[facility.lvl + 1]
                    });
                    facility.lvl += 1;
                    updateCounters();
                    text.updateText("Nível " + facility.lvl);
                }

            }
            else
                createjs.Tween.get(noResourcesText).to({alpha: 1}, 0).to({alpha: 0}, 1500);
        };

        let val;
        switch (facility.type) {
            case "Campo":
                val = "camp";
                break;
            case "Carpintaria":
                val = "mill";
                break;
            case "Mina de Ferro":
                val = "iron";
                break;
            case "Mina de Ouro":
                val = "gold";
                break;
            case "Pedreira":
                val = "rock";
                break;
            case "Ferreiro":
                val = "blackSmith";
                lvlUpClick = function () {
                    if (checkResources()) {
                        if (facility.lvl < facility.maxLvl) {
                            let c = Values.lvlCosts[val];
                            subObject(stats, {
                                wood: c.wood[facility.lvl + 1],
                                iron: c.iron[facility.lvl + 1],
                                rock: c.rock[facility.lvl + 1]
                            });
                            facility.lvl += 1;
                            stats.blackSmith += 1;
                            updateCounters();
                            text.updateText("Nível " + facility.lvl);
                        }

                    }
                    else
                        createjs.Tween.get(noResourcesText).to({alpha: 1}, 0).to({alpha: 0}, 1500);
                };
                break;
            case "Habitações":
                val = "housing";
                lvlUpClick = function () {
                    if (checkResources()) {
                        if (facility.lvl < facility.maxLvl) {
                            let c = Values.lvlCosts[val];
                            subObject(stats, {
                                wood: c.wood[facility.lvl + 1],
                                iron: c.iron[facility.lvl + 1],
                                rock: c.rock[facility.lvl + 1]
                            });
                            facility.lvl += 1;
                            stats.blackSmith += 1;
                            updateCounters();
                            text.updateText("Nível " + facility.lvl);
                        }

                    }
                    else
                        createjs.Tween.get(noResourcesText).to({alpha: 1}, 0).to({alpha: 0}, 1500);
                };
                break;
        }
        let iconpath = "Images/Icons/";
        switch (facility.type) {
            case "Campo":
                iconpath += "Trigo";
                break;
            case "Carpintaria":
                iconpath += "Lumber Mill";
                break;
            case "Mina de Ferro":
                iconpath += "Mina de Ferro";
                break;
            case "Mina de Ouro":
                iconpath += "Mina de Ouro";
                break;
            case "Pedreira":
                iconpath += "Pedreira";
                break;
            case "Ferreiro":
                iconpath += "Anvil";
                break;
            case "Habitações":
                iconpath += "House";
                break;
        }
        iconpath += ".png";
        let icon = new Sprite(iconpath, 0, -30, 150);
        let text = new CenteredText("Nível " + facility.lvl, "20px Helvetica", "black");
        text.x = -50;
        text.y = 80;
        let costText = new CenteredText("Evoluir:", "20px Helvetica", "black");
        costText.x = -50;
        costText.y = 130;
        let noResourcesText = new CenteredText("Sem recursos!", "12px Helvetica", "red");
        noResourcesText.x = 85;
        noResourcesText.y = 80;
        noResourcesText.alpha = 0;
        let lvlUpButton = new Button(25, 80, 30, 30, "+", {
            fill: "turquoise",
            stroke: "black",
            round: 3
        }, {font: "Helvetica", size: 30, color: "black"}, {color: "green", alpha: 0.5}, lvlUpClick);

        let y = 105;
        let x = 0;
        let i = 0;
        let size = 20;
        let icons = "Images/Icons/";
        let woodCounter = new Counter(x, y + i++ * size, size, icons + "madeira.png", 0, "black");
        let ironCounter = new Counter(x, y + i++ * size, size, icons + "Ferro.png", 0, "black");
        let rockCounter = new Counter(x, y + i * size, size, icons + "Pedra.png", 0, "black");

        let self;
        let backClick = function () {
            self.hide(500);
        };

        let backButton = new SpriteButton("Images/Icons/cancel.png", 125, -175, 30, backClick);

        super(300, 400, facility.type, [backButton, icon, text, costText, lvlUpButton, woodCounter, ironCounter, rockCounter, noResourcesText], {
            fill: "beige",
            stroke: "black",
            b_y: -170
        }, {font: "Helvetica", size: 40, color: "black"});
        self = this;
        updateCounters();
    }
}

class FacilityButton
    extends Button {
    constructor(x, y, w, h, margin, facility, menu) {
        function showMenu() {
            menu.show(1000);
        }

        super(x, y, w, h, facility.type, {
            fill: "beige",
            stroke: "black",
            round: 0
        }, {font: "Helvetica", size: h - 2 * margin, color: "black"}, {color: "turquoise", alpha: 0.5}, showMenu);
        let iconpath = "Images/Icons/";
        switch (facility.type) {
            case "Campo":
                iconpath += "Trigo";
                break;
            case "Carpintaria":
                iconpath += "Lumber Mill";
                break;
            case "Mina de Ferro":
                iconpath += "Mina de Ferro";
                break;
            case "Mina de Ouro":
                iconpath += "Mina de Ouro";
                break;
            case "Pedreira":
                iconpath += "Pedreira";
                break;
            case "Ferreiro":
                iconpath += "Anvil";
                break;
            case "Habitações":
                iconpath += "House";
                break;
        }
        iconpath += ".png";
        this.icon = new Sprite(iconpath, h / 2 - w / 2, 0, h - 2 * margin);
        this.addChild(this.icon);
    }
}

class TerritoryMenu extends createjs.Container {
    constructor(x, y, w, item_h, arrow_size, territory, stats, main) {
        super();
        let s_h = getScreenDimensions().h;
        this.x = x;
        this.y = y;
        let mainWindow = new createjs.Shape();
        let left = x - w - arrow_size > 0;
        let height = item_h * (territory.facilities.length + 1);
        let window_y = Math.min(s_h - height - y, -arrow_size);

        let margin = 2;

        let self = this;

        let cancelButton;

        let cancelClick = function () {
            self.hide(500)
        };

        let title = new CenteredText(territory.name, (item_h - 2 * margin) + "px Pirata One", "black");

        if (left) {
            mainWindow.graphics.beginStroke("black").beginFill("beige").lineTo(-arrow_size, -arrow_size).lineTo(-arrow_size, arrow_size).lineTo(0, 0);
            mainWindow.graphics.beginStroke("black").beginFill("beige").rect(-w - arrow_size, window_y, w, height);
            cancelButton = new SpriteButton("Images/Icons/cancel.png", item_h / 2 - w - arrow_size, item_h / 2 + window_y, item_h - 2 * margin, cancelClick);
            title.x = -w / 2 - arrow_size;
        }
        else {
            mainWindow.graphics.beginStroke("black").beginFill("beige").lineTo(arrow_size, -arrow_size).lineTo(arrow_size, arrow_size).lineTo(0, 0);
            mainWindow.graphics.beginStroke("black").beginFill("beige").rect(arrow_size, window_y, w, height);
            cancelButton = new SpriteButton("Images/Icons/cancel.png", item_h / 2 + arrow_size, item_h / 2 + window_y, item_h - 2 * margin, cancelClick);
            title.x = w / 2 + arrow_size;

        }
        title.y = (1 / 2) * item_h + window_y;

        this.addChild(mainWindow);
        this.addChild(title);
        this.addChild(cancelButton);

        for (let i = 0; i < territory.facilities.length; i++) {
            let menu = new FacilityMenu(territory.facilities[i], stats);

            let button;
            if (left)
                button = new FacilityButton(-w / 2 - arrow_size, (i + 3 / 2) * item_h + window_y, w, item_h, margin, territory.facilities[i], menu);
            else
                button = new FacilityButton(w / 2 + arrow_size, (i + 3 / 2) * item_h + window_y, w, item_h, margin, territory.facilities[i], menu);
            this.addChild(button);
            main.addChild(menu);
        }
        this.hide(0);


    }

    show(time) {
        return createjs.Tween.get(this).to({alpha: 1, scale: 1}, time, createjs.Ease.sineOut);
    }

    hide(time) {
        return createjs.Tween.get(this).to({alpha: 0, scale: 0}, time, createjs.Ease.sineIn);
    }
}

class ValuePicker extends createjs.Container {
    constructor(x, y, size, obj, property) {
        function valUpdate(val) {
            obj[property] = Math.max(0, obj[property] + val);
            text.updateText(String(obj[property]));
            obj.change();
        }

        super();
        this.x = x;
        this.y = y;
        let icons = "Images/Icons/";
        let margin = 2;
        let text = new CenteredText(String(obj[property]), size + "px Helvetica", "black");
        let minus10 = new SpriteButton(icons + "10.png", -5 / 2 * size, 0, size - 2 * margin, function () {
            valUpdate(-10)
        });
        let minus = new SpriteButton(icons + "Minus.png", -3 / 2 * size, 0, size - 2 * margin, function () {
            valUpdate(-1)
        });
        let plus = new SpriteButton(icons + "Plus.png", 3 / 2 * size, 0, size - 2 * margin, function () {
            valUpdate(1)
        });
        let plus10 = new SpriteButton(icons + "10.png", 5 / 2 * size, 0, size - 2 * margin, function () {
            valUpdate(10)
        });

        this.addChild(text, minus10, minus, plus, plus10);
        valUpdate(0);
    }
}

class ExpeditionMenu extends Menu {
    constructor(territory, mainWindow, stats) {
        function calcFirepower() {
            return (1 + 0.2 * stats.blackSmith + 0.05 * troops.small + 0.1 * troops.medium + 0.3 * troops.big) * (
                troops.soldiers * Values.soldier.firepower +
                troops.sailors * Values.sailor.firepower +
                troops.captains * Values.captain.firepower);
        }

        function calcHP() {
            return troops.soldiers * Values.soldier.hp +
                troops.sailors * Values.sailor.hp +
                troops.captains * Values.captain.hp +
                troops.small * Values.small +
                troops.medium * Values.medium +
                troops.big * Values.big;
        }

        function calcCosts() {
            return {
                food: troops.captains * 100 + troops.sailors * 20 + troops.soldiers * 60,
                iron: troops.captains * 80 + troops.sailors * 40 + troops.soldiers * 100
                + troops.small * 200 + troops.medium * 400 + troops.big * 1000,
                gold: troops.captains * 200 + troops.sailors * 40 + troops.soldiers * 80
                + troops.small * 300 + troops.medium * 450 + troops.big * 600,
                wood: troops.small * 400 + troops.medium * 700 + troops.big * 800
            }
        }

        function checkResources() {
            let c = calcCosts();
            return stats.gold >= c.gold && stats.wood >= c.wood && stats.iron >= c.iron && stats.food >= c.food;
        }

        function startClick() {
            if (checkResources()) {
                let curStats = {hp: calcHP(), firepower: calcFirepower(), gold: stats.gold, dev: 2};
                let exp = new Navigation(territory, territory.expedition, curStats, mainWindow);
                mainWindow.stg.addChild(exp);

                function show() {
                    exp.show(1000);
                    mainWindow.hide(1000);
                }
                self.hide(1000);
                exp.hide(0).call(show)

            }
            else
                createjs.Tween.get(noResourcesText).to({alpha: 1}, 0).to({alpha: 0}, 1500);
        }

        let firstrow = -125;
        let secondRow = 75;
        let hpText = new createjs.Text("HP: 0", "20px Helvetica");
        hpText.x = -400;
        hpText.y = 235;
        let firepowerText = new createjs.Text("Ataque: 0", "20px Helvetica");
        firepowerText.x = -275;
        firepowerText.y = 235;
        let troops = {soldiers: 0, sailors: 0, captains: 0, small: 0, medium: 0, big: 0};
        let noResourcesText = new CenteredText("Não tem recursos suficientes para esta expedição!", "12px Helvetica", "red");
        noResourcesText.x = 200;
        noResourcesText.y = 270;
        noResourcesText.alpha = 0;

        let y = 200;
        let x = -100;
        let i = 0;
        let size = 20;
        let icons = "Images/Icons/";
        let foodCounter = new Counter(x, y + i++ * size, size, icons + "bread.png", 0, "black");
        let woodCounter = new Counter(x, y + i++ * size, size, icons + "madeira.png", 0, "black");
        let ironCounter = new Counter(x, y + i++ * size, size, icons + "Ferro.png", 0, "black");
        let goldCounter = new Counter(x, y + i * size, size, icons + "Ouro.png", 0, "black");

        let startButton = new Button(200, 235, 200, 50, "Iniciar", {
            stroke: "black",
            fill: "turquoise",
            round: 5
        }, {size: 20, font: "Helvetica", color: "black"}, {color: "green", alpha: 0.5}, startClick);

        troops.change = function () {
            hpText.text = "HP: " + calcHP();
            firepowerText.text = "Ataque: " + calcFirepower();
            let c = calcCosts();
            foodCounter.update(c.food);
            woodCounter.update(c.wood);
            ironCounter.update(c.iron);
            goldCounter.update(c.gold);
        };
        let soldierIcon = new Sprite("Images/Soldier.png", -250, firstrow, 150);
        let soldierPicker = new ValuePicker(-250, firstrow + 100, 30, troops, "soldiers");
        let sailorIcon = new Sprite("Images/Icons/sailor hat.png", 0, firstrow, 150);
        let sailorPicker = new ValuePicker(0, firstrow + 100, 30, troops, "sailors");
        let captainIcon = new Sprite("Images/Icons/Captain hat.png", 250, firstrow, 150);
        let captainPicker = new ValuePicker(250, firstrow + 100, 30, troops, "captains");
        let smallIcon = new Sprite("Images/Icons/Barca.png", -250, secondRow, 150);
        let smallPicker = new ValuePicker(-250, secondRow + 100, 30, troops, "small");
        let mediumIcon = new Sprite("Images/Icons/Ship.png", 0, secondRow, 150);
        let mediumPicker = new ValuePicker(0, secondRow + 100, 30, troops, "medium");
        let bigIcon = new Sprite("Images/Ship-galleon.png", 250, secondRow, 150);
        let bigPicker = new ValuePicker(250, secondRow + 100, 30, troops, "big");

        let backClick = function () {
            self.hide(500);
        };

        let backButton = new SpriteButton("Images/Icons/cancel.png", 400, -250, 50, backClick);

        super(900, 600, "Expedição a " + territory.name, [backButton, foodCounter, woodCounter, ironCounter, goldCounter, noResourcesText, hpText, firepowerText, startButton, soldierIcon, soldierPicker, sailorIcon, sailorPicker, captainIcon, captainPicker, smallIcon, smallPicker, mediumIcon, mediumPicker, bigIcon, bigPicker], {
            fill: "beige",
            stroke: "black",
            b_y: -275
        }, {font: "Helvetica", size: 40, color: "black"});
        let self = this;
    }
}

class OptionsMenu extends Menu {
    constructor(territories, stats) {
        function onClick() {
            audio = false;
            self.removeChild(onButton);
            self.addChild(offButton);
        }

        function offClick() {
            audio = true;
            self.removeChild(offButton);
            self.addChild(onButton);
        }

        function saveClick() {
            localStorage.setItem("save",JSON.stringify(getStatsObj(territories,stats)));
        }

        let icons = "Images/Icons/";
        let onButton = new SpriteButton(icons + "Volume on.png", 100, 0, 50,onClick);
        let offButton = new SpriteButton(icons + "Volume off.png", 100, 0, 50,offClick);
        let soundText = new CenteredText("Volume:", "20px Helvetica", "black");
        soundText.x = -100;
        soundText.y = 0;
        let saveButton = new SpriteButton(icons + "save icon.png",100,100,50,saveClick);
        let saveText = new CenteredText("Salvar:", "20px Helvetica", "black");
        saveText.x = -100;
        saveText.y = 100;

        let self;
        let backClick = function () {
            self.hide(500);
        };

        let backButton = new SpriteButton("Images/Icons/cancel.png", 175, -175, 30, backClick);

        super(400,400,"Opções",[backButton,onButton,soundText,saveButton,saveText],{fill:"beige",stroke:"black",b_y:-150},{font:"Helvetica",size:40,color:"black"});
        self = this;
    }
}