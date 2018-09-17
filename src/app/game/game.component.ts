import { Component, OnInit } from '@angular/core';
declare var PIXI: any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  // The canvas
  public renderer = new PIXI.Application({
    width: 1065,
    height: 600,
    autoResize: true,
    backgroundColor: 0x72AC50
  });

  // Variables
  houses = [];
  zombies = [];
  simulationResults = [];
  simulationResultsSum = 0;
  currentRound = 0;
  infectedHouses = 0;
  amountOfHouses = 0;
  infectedTown = false;
  gameInterval;
  intervalMS = 200;

  constructor() {}

  // Just a true or false coin flip
  coinFlip() {
    return (Math.floor(Math.random() * 2) === 0);
  }

  gameLoopLogic() {
    this.currentRound++;
    // Zombie movement AI, the zombie does not go out of bounds and goes into a random direction
    for (let i = 0; i <= this.zombies.length - 1; i++) {
      const element = this.zombies[i];
      // Checks if the zombie should go left/right or up/down
      const horizontalMovement = this.coinFlip();
      // If it goes left/right
      if (horizontalMovement) {
        if (element.xPos === 9) {
          element.xPos--;
        } else if (element.xPos === 0) {
          element.xPos++;
        } else {
          this.coinFlip() ? element.xPos++ : element.xPos--;
        }
      } else { // If it goes up/down
        if (element.yPos === 9) {
          element.yPos--;
        } else if (element.yPos === 0) {
          element.yPos++;
        } else {
          this.coinFlip() ? element.yPos++ : element.yPos--;
        }
      }
    }

    // Checks every zombie
    for (let i = 0; i <= this.zombies.length - 1; i++) {
      const element = this.zombies[i];
      // Checks if the houses that the zombies are in are infected
      if (this.houses[element.yPos][element.xPos].texture === PIXI.loader.resources.blueHouse.texture) {
        // Infects the house and adds a new zombie
        this.houses[element.yPos][element.xPos].texture = PIXI.loader.resources.redHouse.texture;
        this.zombies.push({xPos: element.xPos, yPos: element.yPos});
        this.infectedHouses++;
      }
    }

    // Check if all houses have been infected
    if (this.infectedHouses === this.amountOfHouses) {
      // Updates the result
      this.simulationResults.push(this.currentRound);
      this.simulationResultsSum = this.simulationResults.reduce((acc, current) => acc + current, 0);

      // Keeps doing simulations until it has done 10 simulations
      if (this.simulationResults.length < 10) {
        // Pauses the simulation after it is done for a while for better visualization
        setTimeout(() => {
          clearInterval(this.gameInterval);
          this.resetTown();
          this.sendZombie();
          this.createInterval();
        }, 300);
      }
    }
  }

  // Creates the town for the first time
  createTown(rowsOfHouse, colsOfHouse) {
    // Calculates the amount of houses in the town
    this.amountOfHouses = rowsOfHouse * colsOfHouse;

    // The houses are stored in a 2D array
    for (let row = 1; row <= rowsOfHouse; row++) {
      const colHouse = [];
      for (let col = 1; col <= colsOfHouse; col++) {
        // Creates a new house and assigns values to it
        const blueHouse = new PIXI.Sprite(
          PIXI.loader.resources.blueHouse.texture
        );
        blueHouse.y = 50 * row;
        blueHouse.x = 90 + 80 * col;
        blueHouse.anchor.set(0.5);

        // Adds the house to the render
        colHouse.push(blueHouse);
        this.renderer.stage.addChild(blueHouse);
      }
      this.houses.push(colHouse);
    }
  }

  // Disinfects the town
  resetTown() {
    for (let row = 0; row <= this.houses.length - 1; row++) {
      for (let col = 0; col <= this.houses[row].length - 1; col++) {
        this.houses[row][col].texture = PIXI.loader.resources.blueHouse.texture;
      }
    }
    this.infectedHouses = 0;
  }

  // Sends the first zombie to the town
  sendZombie() {
    this.zombies = [];
    this.currentRound = 1;

    // The first zombie goes to a random house and another zombie gets added
    const selectedRow = Math.floor(Math.random() * this.houses.length);
    const selectedCol = Math.floor(Math.random() * this.houses[0].length);
    this.houses[selectedRow][selectedCol].texture = PIXI.loader.resources.redHouse.texture;
    this.infectedHouses++;
    this.zombies.push({xPos: selectedCol, yPos: selectedRow});
    this.zombies.push({xPos: selectedCol, yPos: selectedRow});
  }

  // Creates a delay for each round for better visualization
  createInterval() {
    this.gameInterval = setInterval(() => {
      if (this.infectedHouses < this.amountOfHouses) {
        this.gameLoopLogic();
      } else {
        // Removes the interval when the simulation is complete
        clearInterval(this.gameInterval);
      }
    }, this.intervalMS);
  }

  ngOnInit() {
    // Adds the canvas to the site
    document.getElementById('game-canvas').appendChild(this.renderer.view);

    // Loads the game assets and launches the start code
    PIXI.loader
      .add('blueHouse', 'assets/blue_house.png')
      .add('redHouse', 'assets/infected_house.png')
      .add('arrow', 'assets/arrow.png')
      .load(() => {
        // Creates the town
        this.createTown(10, 10);

        // Adds the arrow button to start the simulation
        const arrowButton = new PIXI.Sprite(PIXI.loader.resources.arrow.texture);
        arrowButton.buttonMode = true;
        arrowButton.interactive = true;
        arrowButton.x = 970;
        arrowButton.y = 540;
        this.renderer.stage.addChild(arrowButton);

        // Launches the code when the player clicks the arrow button
        arrowButton.on('click', () => {
          arrowButton.destroy();
          this.infectedTown = true;
          this.sendZombie();
          this.createInterval();
        });
      });
  }

}
