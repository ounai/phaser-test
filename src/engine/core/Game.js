class Game extends Phaser.Game {
  constructor(scenes) {
    super({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      scene: scenes
    });
  }
}

export default Game;

