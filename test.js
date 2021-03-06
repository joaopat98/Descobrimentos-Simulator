test1 = {
    start_x: 0,
    start_y: 0,
    tilesize: 50,
    enemies: [
        {
            x: 1, y: 1, radar: 4, firepower: 10, dev: 1, hp: 40, img: "Images/Ship-galleon.png",
            prize: 20
        },
        {
            x: 6, y: 7, radar: 6, firepower: 20, dev: 2, hp: 50, img: "Images/Enemy.png",
            prize: 20
        }
    ],
    hexmap: [
        {x: 0, y: 0, cost: 10, dev: 1, prize: 10, port: false, end: false},
        {x: 1, y: 0, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 1, cost: 30, dev: 3, port: false, end: false},
        {x: 1, y: 1, cost: 30, dev: 3, port: false, end: false},
        {x: 6, y: 6, cost: 30, dev: 3, port: false, end: false},
        {x: 6, y: 7, cost: 30, dev: 3, port: false, end: false},
        {x: 6, y: 5, cost: 30, dev: 3, port: false, end: false},
        {x: 6, y: 8, cost: 30, dev: 3, port: false, end: false},
        {x: 5, y: 6, hp: 1000, dev: 3, port: true}
    ],
    background: "Images/sat.jpg",
    background_properties: {x: -2250, y: -1000, scale: 1.2},
    tint: {color: "rgb(255,255,0)", alpha: 0.6},
    frame: "green",
    boatImg: "Images/boat.png"
};

Ceuta = {
    map_x: 200,
    map_y: 50,
    start_x: 0,
    start_y: 1,
    tilesize: 32.5,
    enemies: [
        {
            x: 6, y: 8, radar: 4, firepower: 200, dev: 30, hp: 5000, img: "Images/Ship-galleon.png",
            prize: 250
        },
        {
            x: 1, y: 8, radar: 6, firepower: 100, dev: 15, hp: 1000, img: "Images/Enemy.png",
            prize: 100
        },
        {
            x: 2, y: 12, radar: 6, firepower: 100, dev: 15, hp: 1000, img: "Images/Enemy.png",
            prize: 100
        },
        {
            x: 3, y: 6, radar: 6, firepower: 100, dev: 15, hp: 1000, img: "Images/Enemy.png",
            prize: 100
        }

    ],

    hexmap: [
        {x: 0, y: 1, cost: 10, dev: 1, port: false, end: false},
        {x: 0, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 11, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 13, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 15, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 16, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 17, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 19, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 20, cost: 20, dev: 2, port: false, end: false},
        {x: 0, y: 21, cost: 20, dev: 2, port: false, end: false},

        {x: 1, y: 1, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 2, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 9, hp: 1000, cost: 20, dev: 2, port: true, end: false},
        {x: 1, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 11, cost: 20, dev: 2, port: true, end: false},
        {x: 1, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 13, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 14, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 15, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 16, cost: 20, dev: 2, prize: 500, port: false, end: false},
        {x: 1, y: 17, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 18, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 19, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 20, cost: 20, dev: 2, port: false, end: false},
        {x: 1, y: 21, cost: 20, dev: 2, port: false, end: false},

        {x: 2, y: 0, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 2, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 11, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 13, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 14, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 15, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 16, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 18, cost: 20, dev: 2, port: false, end: false},
        {x: 2, y: 20, cost: 20, dev: 2, port: false, end: false},

        {x: 3, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 3, y: 11, cost: 20, dev: 2, port: false, end: false},

        {x: 4, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 4, y: 11, cost: 20, dev: 2, port: false, end: true},
        {x: 4, y: 12, cost: 20, dev: 2, port: false, end: false},

        {x: 5, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 11, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 13, cost: 20, dev: 2, port: false, end: false},
        {x: 5, y: 15, cost: 20, dev: 2, port: false, end: false},

        {x: 6, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 4, cost: 500, dev: 50, port: false, end: false, img: "Images/Treasure Islands.png"},
        {x: 6, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 7, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 11, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 13, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 14, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 15, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 16, cost: 20, dev: 2, port: false, end: false},
        {x: 6, y: 17, cost: 20, dev: 2, port: false, end: false},

        {x: 7, y: 3, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 4, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 5, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 6, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 8, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 9, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 10, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 11, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 12, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 14, cost: 500, dev: 50, port: false, end: false, img: "Images/Treasure Islands.png"},
        {x: 7, y: 15, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 16, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 17, cost: 20, dev: 2, port: false, end: false},
        {x: 7, y: 18, cost: 20, dev: 2, port: false, end: false},
    ],

    background: "Images/Ceuta.png",
    background_properties: {x: -20, y: -70, scale: 0.9},
    tint: {color: "rgb(255,255,0)", alpha: 0.6},
    frame: "green",
    boatImg: "Images/boat.png"
};