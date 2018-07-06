"use strict";

window.addEventListener("load", main);


let audio = true;
var Sound = {};

function playSound(sound, loop = false) {
    if (audio) {
        if (loop) {
            sound.addEventListener("ended", function () {
                sound.currentTime = 0;
                sound.play()
            });
        }
        sound.currentTime = 0;
        sound.play();
    }
}

function stopSound(sound) {
    sound.pause();
}

function registerSound(path, ID) {
    Sound[ID] = new Audio(path);
    Sound[ID].hidden = true;
}

function loadSound() {
    registerSound("Sound/click.mp3", "click");
    registerSound("Sound/cannon.wav", "cannon");
    registerSound("Sound/wave.wav", "wave");

}

function exit() {
    if (confirm("Tem a certeza que deseja sair?"))
        window.close();
}

function main() {
    loadSound();
    let canvas = document.getElementById("canvas");
    let w = canvas.width = 1280;
    let h = canvas.height = 720;
    let stage = new createjs.Stage(canvas);

    stage.enableMouseOver();

    function startGame() {
        function removeChildren() {
            stage.removeChild(playButton);
            stage.removeChild(exitButton);
            stage.removeChild(title);
            stage.removeChild(background);
        }


        let stats = localStorage.getItem("save");
        if (stats !== null) {
            stats = JSON.parse(stats);
        }
        else {
            stats = defStats;
        }

        let territories = [];
        for (let i = 0; i < stats.territories.length; i++)
            territories.push(territoryInstance(stats.territories[i], stats.stats));
        let mainScreen = new MainScreen(territories, "Images/rsz_sat.jpg", stats.stats, 1000, stage);
        mainScreen.x = -w;
        stage.addChild(mainScreen);
        function show() {
            mainScreen.show(1000).call(removeChildren);
        }
        mainScreen.hide(0).call(show);

    }

    let title = new createjs.Text("Descobrimentos\n\tSimulator", "100px Pirata One", "black");
    title.x = 200;
    title.y = 50;
    let bg = new Image();
    let background = new createjs.Bitmap(bg);
    bg.onload = function () {
        background.scale = w / bg.naturalWidth;
    };
    bg.src = "Images/backgroundMainMenu.jpg";
    let playButton = new Button(300,500, 140, 60, "Jogar", {round: 5}, {
        font: "Pirata One",
        size: "50"
    }, {color: "yellow", alpha: 0.3}, startGame);
    let exitButton = new Button(300,570, 100, 60, "Sair", {round: 5}, {
        font: "Pirata One",
        size: "50"
    }, {color: "yellow", alpha: 0.3}, exit);
    stage.addChild(background);
    stage.addChild(title);
    stage.addChild(playButton);
    stage.addChild(exitButton);

    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", stage);
}