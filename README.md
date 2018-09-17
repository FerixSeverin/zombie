# Zombie

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.1.

## About

This site simulates a zombie invasion of a town with 100 houses.

In the beginning of the simulation a zombie appears in a random house and infects the house and its inhabitants. Each house only has one inhabitant.

Each round every zombie goes to a random nearby house and infects it.

Zombies can move up, down, left and right but not diagonally.

The simulation is complete when every house has been infected.

## Compilation

If you want to compile the project yourself you need to get the latest version of LTS Nodejs and NPM.

https://nodejs.org/en/

Check that you have Nodejs correctly installed by typing "node -v" in the terminal (on linux) or cmd (on windows).

Clone the repository from github.

Get the dependencies by typing "npm install". The install may take a while.

To run the project localy type "ng serve", after the loading is complete you should be able to see the page on http://localhost:4200/

If you want a production version of the site you can type "ng build --prod". The site should be in /dist/zombie.