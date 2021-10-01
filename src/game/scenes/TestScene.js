import Scene from '/src/engine/core/Scene';

import ImageResource from '/src/engine/resources/ImageResource';
import SpriteSheetResource from '/src/engine/resources/SpriteSheetResource';

import Image from '/src/engine/objects/Image';
import Sprite from '/src/engine/objects/Sprite';
import ArcadePhysicsSprite from '/src/engine/objects/ArcadePhysicsSprite';
import ArcadePhysicsImage from '/src/engine/objects/ArcadePhysicsImage';
import StaticGroup from '/src/engine/objects/StaticGroup';
import Text from '/src/engine/objects/Text';

export default class TestScene extends Scene {
  // Aliased to res
  resources = {
    sky: new ImageResource('assets/sky.png'),
    ground: new ImageResource('assets/platform.png'),
    star: new ImageResource('assets/star.png'),
    bomb: new ImageResource('assets/bomb.png'),
    dude: new SpriteSheetResource('assets/dude.png', {
      frameWidth: 32,
      frameHeight: 48
    })
  };

  eventHandlers = {
    keydown: {
      'SPACE': this.playerJump
    }
  };

  // Current score
  score = 0;

  // Creates scene
  constructor() {
    super({
      autoFocus: true,
      physics: {
        default: 'arcade',
        arcade: {
          debug: true,
          gravity: {
            y: 1000
          }
        }
      }
    });
  }

  createPlatforms() {
    const platformImages = [
      new Image(this, 600, 400, this.res.ground),
      new Image(this, 50, 250, this.res.ground),
      new Image(this, 750, 220, this.res.ground)
    ];

    this.platforms = new StaticGroup(this.physics.world, this);
    this.platforms.create(400, 568, this.res.ground).setScale(2).refreshBody();

    platformImages.forEach(p => {
      this.add.existing(p);
      this.platforms.add(p);
    });

    this.add.existing(this.platforms);
  }

  createPlayerAnimations() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers(this.res.dude, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [ { key: this.res.dude, frame: 4 } ],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers(this.res.dude, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  createStars() {
    this.stars = this.physics.add.group({
      key: this.res.star,
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.iterate(star => star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)));
  }

  createPlayer() {
    this.createPlayerAnimations();

    this.player = new ArcadePhysicsSprite(this, 100, 450, this.res.dude);
    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
  }

  getScoreText() {
    return `Score: ${this.score ?? 0}`;
  }

  createScoreText() {
    this.scoreText = new Text(this, 16, 16, this.getScoreText(), {
      fontSize: '32px',
      fill: '#000000'
    });

    this.add.existing(this.scoreText);
  }

  createColliders() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);

    const onCollectStar = (player, star) => {
      star.destroy();

      this.score += 10;

      this.scoreText.setText(this.getScoreText());
    };

    this.physics.add.overlap(this.player, this.stars, onCollectStar, null, this);
  }

  playerMoveLeft() {
    this.player.setVelocityX(-160);

    this.player.anims.play('left', true);
  }

  playerMoveRight() {
    this.player.setVelocityX(160);

    this.player.anims.play('right', true);
  }

  playerIdle() {
    this.player.setVelocityX(0);

    this.player.anims.play('turn');
  }

  playerJump() {
    if (this.player.body.touching.down) this.player.setVelocityY(-700);
  }

  cursorKeysDown({ up, down, left, right }) {
    if (left && !right) this.playerMoveLeft();
    else if (right && !left) this.playerMoveRight();
    else this.playerIdle();

    if (up) this.playerJump();
  }

  // Runs after scene is constructed
  onCreate() {
    console.log('Scene', this.constructor.name, 'create()');

    this.backgroundImage = new Image(this, 400, 300, this.res.sky);
    this.add.existing(this.backgroundImage);

    this.createPlatforms();
    this.createStars();
    this.createPlayer();
    this.createScoreText();
    this.createColliders();
  }

  // Runs every frame
  onUpdate(time, delta) {
    // TODO cool stuff
  }
}

