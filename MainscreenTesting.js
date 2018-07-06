"use strict";

window.addEventListener("load", mainscreen);

function mainscreen() {
    loadSound();
    let canvas = document.getElementById("canvas");
    let w = canvas.width;
    let h = canvas.height;
    let stage = new createjs.Stage(canvas);
    stage.enableMouseOver();
    let stats = {gold:0,wood:0,iron:0,rock:0,food:0,blackSmith:1};

    let territories = [];
    for (let i = 0; i < mainscreendata.territories.length; i++)
        territories.push(territoryInstance(mainscreendata.territories[i],stats));
    let main = new MainScreen(territories, "Images/rsz_sat.jpg", stats,1000,stage);
    stage.addChild(main);
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
}

