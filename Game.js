"use strict";

class Game {
    constructor(territories, expeditions, events, stats) {
        this.territories = territories;
        this.expeditions = expeditions;
        this.events = events;
        this.stats = stats;
    }
}

class Expedition {
    constructor(minTripulation, hexmap, player, fleet, enemies) {
        this.minTripulation = minTripulation;
        this.hexmap = hexmap;
        this.player = player;
        this.fleet = fleet;
        this.enemies = enemies;
    }
}

class Territory {
    constructor(x, y, expedition, facilities, conquered, name) {
        this.x = x;
        this.y = y;
        this.expedition = expedition;
        this.facilities = facilities;
        this.conquered = conquered;
        this.name = name;
    }

    updateResources() {
        if (this.conquered) {
            for (let i = 0; i < this.facilities.length; i++)
                this.facilities[i].updateResources();
        }
    }

    toObject() {
        let facilities = [];
        for (let i = 0; i < this.facilities.length; i++)
            facilities.push(this.facilities[i].toObject());
        return {
            name: this.name,
            x: this.x,
            y: this.y,
            conquered: this.conquered,
            facilities: facilities,
            expedition: this.expedition
        };
    }
}

class Facility {
    constructor(lvl, maxLvl, type, stats) {
        this.lvl = lvl;
        this.maxLvl = maxLvl;
        this.stats = stats;
        this.type = type;
        switch (type) {
            case "Campo":
                this.resource = "food";
                break;
            case "Carpintaria":
                this.resource = "wood";
                break;
            case "Mina de Ferro":
                this.resource = "iron";
                break;
            case "Mina de Ouro":
                this.resource = "gold";
                break;
            case "Pedreira":
                this.resource = "rock";
                break;
            case "Ferreiro":
                this.resource = undefined;
                break;
            case "Habitações":
                this.resource = undefined;
                break;
        }
    }

    updateResources() {
        if (this.resource !== undefined)
            this.stats[this.resource] += Values[this.resource][this.lvl];
    }

    toObject() {
        return {type: this.type, lvl: this.lvl, maxLvl: this.maxLvl};
    }

}

class Stats {
    constructor(resources, territories, difficulty) {
        this.resources = resources;
        this.territories = territories;
        this.difficulty = difficulty;
    }
}

class Ship {
    constructor(tripulation, size, firepower) {
        this.tripulation = tripulation;
        this.size = size;
        this.firepower = firepower;
    }
}