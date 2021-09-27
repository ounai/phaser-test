import TestScene from './scenes/TestScene';

class Game extends Phaser.Game {
  constructor() {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: [TestScene]
    });
  }
}

export default Game;

