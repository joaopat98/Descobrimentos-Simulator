defStats = {
    stats: {
        gold: 0,
        wood: 0,
        iron: 0,
        rock: 0,
        food: 0,
        blackSmith: 1,
        housing: 1
    },
    territories: [
        {
            name: "Lisboa", x: 450, y: 70, conquered: true,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Carpintaria", lvl: 1, maxLvl: 5},
                {type: "Mina de Ouro", lvl: 1, maxLvl: 5},
                {type: "Mina de Ferro", lvl: 1, maxLvl: 5},
                {type: "Pedreira", lvl: 1, maxLvl: 5},
                {type: "Ferreiro", lvl: 1, maxLvl: 5},
                {type: "Habitações", lvl: 1, maxLvl: 5}
            ]
        },
        {
            name: "Açores", x: 100, y: 100, conquered: false,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Carpintaria", lvl: 1, maxLvl: 5},
                {type: "Mina de Ouro", lvl: 1, maxLvl: 5},
                {type: "Mina de Ferro", lvl: 1, maxLvl: 5}
            ],
            expedition: Acores
        },
        {
            name: "Ceuta", x:490, y:90, conquered: false,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Carpintaria", lvl: 1, maxLvl: 5},
                {type: "Mina de Ouro", lvl: 1, maxLvl: 5},
                {type: "Mina de Ferro", lvl: 1, maxLvl: 5}
            ],
            expedition: Ceuta
        },
        {
            name: "Bojador", x: 405, y: 175, conquered: true,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Pedreira", lvl: 1, maxLvl: 5}
            ],
        },
        {
            name: "Madeira", x: 375, y: 120, conquered: false,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Pedreira", lvl: 1, maxLvl: 5}
            ],
            expedition: Madeira
        },

        {
            name: "Cabo Verde", x: 320, y: 260, conquered: true,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Pedreira", lvl: 1, maxLvl: 5}
            ]
        },
        {
            name: "Angola", x: 650, y: 500, conquered: true,
            facilities: [
                {type: "Campo", lvl: 1, maxLvl: 5},
                {type: "Pedreira", lvl: 1, maxLvl: 5}
            ]
        },

    ]
};