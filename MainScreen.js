"use strict";

function click() {
    alert("teste");
    return undefined;
}

function getStatsObj(territories,stats) {
    let ts = [];
    for (let i = 0; i < territories.length; i++)
        ts.push(territories[i].toObject());
    return {territories:ts,stats:{
            gold: stats.gold,
            iron: stats.iron,
            wood: stats.wood,
            food: stats.food,
            rock: stats.rock,
            blackSmith: stats.blackSmith,
            housing: stats.housing
        }}
}

class MainScreen extends createjs.Container {
    constructor(territories, backgr, stats, timeout, stage) {
        super();
        this.stg = stage;
        this.territories = territories;
        let bg = new Image();
        let background = new createjs.Bitmap(bg);
        bg.src = backgr;
        this.addChild(background);
        for (let i = 0; i < territories.length; i++) {
            let t = territories[i];

            let menu = new TerritoryMenu(t.x, t.y, 300, 30, 20, t, stats, this);
            let expMenu = new ExpeditionMenu(t, this, stats);
            let territoryClick = function () {
                if (t.conquered)
                    menu.show(500);
                else
                    expMenu.show(500);
            };
            let button = new TerritoryButton(t.x, t.y, territoryClick);
            this.addChildAt(button, 1);
            this.addChildAt(menu,2);
            this.addChild(expMenu);
        }
        let hud = new HUD(200, 30, stats);
        let updateResources = function () {
            console.log("updating...");
            for (let i = 0; i < territories.length; i++)
                territories[i].updateResources();
            hud.updateCounters();
        };


        let optMenu = new OptionsMenu(territories,stats);

        function showOptions() {
            optMenu.show(1000)
        }
        let optButton = new SpriteButton("Images/Icons/Options.png",1230,670,50,showOptions);

        window.setInterval(updateResources, timeout);
        this.addChild(optButton);
        this.addChild(hud);
        this.addChild(optMenu);
    }

    show(time) {
        return createjs.Tween.get(this).to({alpha: 1, x: 0}, time, createjs.Ease.sineOut);
    }

    hide(time) {
        let size = getScreenDimensions();
        return createjs.Tween.get(this).to({alpha: 0, x: -size.w}, time, createjs.Ease.sineIn);
    }

}
