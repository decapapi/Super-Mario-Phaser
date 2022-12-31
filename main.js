const mobileDevice = isMobileDevice();

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight * 1.1;

const velocityX = screenWidth / 4.5;
const velocityY = screenHeight / 1.15;

const levelGravity = velocityY * 2;

var config = {
    type: Phaser.AUTO,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: 0x8585FF,
    // Next three properties are needed to get the screenshot at the end of the game
    parent: 'game',
    preserveDrawingBuffer: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: levelGravity },
            debug: true
        }
    },
    scene: {
        key: 'level-1',
        preload: preload,
        create: create,
        update: update
    }
};

const worldWidth = screenWidth * 10;
const platformHeight = screenHeight / 5;

const startOffset = mobileDevice ? screenWidth / 2 : screenWidth / 3.5;

// Hole with is calculated dividing the world width in x holes of the same size.
const platformPieces = 50;
const platformPiecesWidth = worldWidth / platformPieces;

// Create empty holes array, every hole will have their object with the hole start and end
var worldHolesCoords = [];

var emptyBlocksList = [];

var player;
var playerController;
var playerState = 0;
var playerInvulnerable = false;
var playerBlocked = false;

var flagRaised = false;

var arrowKeys;
var controlKeys = {
    W: null,
    A: null,
    S: null,
    D: null,
    SPACE: null
};

var cursors;
var score = 0;

var smoothedControls;
var gameOver = false;
var gameWinned = false;

var game = new Phaser.Game(config);

function isMobileDevice() {
    const userAgent = navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

// Smoothed horizontal controls helper. This gives us a value between -1 and 1 depending on how long
// the player has been pressing left or right, respectively.
// Source: https://github.com/photonstorm/phaser3-examples/blob/master/public/src/tilemap/collision/matter%20destroy%20tile%20bodies.js#L35

var SmoothedHorionztalControl = new Phaser.Class({

    initialize:

        function SmoothedHorionztalControl(speed) {
            this.msSpeed = speed;
            this.value = 0;
        },

    moveLeft: function(delta) {
        if (this.value > 0) { this.reset(); }
        this.value -= this.msSpeed * delta;
        if (this.value < -1) { this.value = -1; }
        playerController.time.rightDown += delta;
    },

    moveRight: function(delta) {
        if (this.value < 0) { this.reset(); }
        this.value += this.msSpeed * delta;
        if (this.value > 1) { this.value = 1; }
    },

    reset: function() {
        this.value = 0;
    }
});

function preload() {
    // Load entities
    this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });
    this.load.spritesheet('mario-grown', 'assets/entities/mario-grown.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('mario-fire', 'assets/entities/mario-fire.png', { frameWidth: 18, frameHeight: 32 });
    this.load.spritesheet('goomba', 'assets/entities/goomba.png', { frameWidth: 16, frameHeight: 16 });
    
    this.load.image('arrows', 'assets/controls/arrows.png');

    // Load props
    this.load.image('cloud1', 'assets/scenery/cloud1.png');
    this.load.image('cloud2', 'assets/scenery/cloud2.png');
    this.load.image('mountain1', 'assets/scenery/mountain1.png');
    this.load.image('mountain2', 'assets/scenery/mountain2.png');
    this.load.image('fence', 'assets/scenery/fence.png');
    this.load.image('bush1', 'assets/scenery/bush1.png');
    this.load.image('bush2', 'assets/scenery/bush2.png');
    this.load.image('castle', 'assets/scenery/castle.png');
    this.load.image('flag-mast', 'assets/scenery/flag-mast.png');
    this.load.image('final-flag', 'assets/scenery/final-flag.png');

    // Load platform bricks and structures
    this.load.image('floorbricks', 'assets/scenery/floorbricks.png');
    this.load.image('block', 'assets/scenery/block.png');
    this.load.image('misteryBlock', 'assets/scenery/misteryBlock.png');
    this.load.image('emptyBlock', 'assets/scenery/emptyBlock.png');
    this.load.image('immovableBlock', 'assets/scenery/immovableBlock.png');

    // Load collectibles
    this.load.spritesheet('coin', 'assets/collectibles/coin.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('fire-flower', 'assets/collectibles/fire-flower.png');
    this.load.image('live-mushroom', 'assets/collectibles/live-mushroom.png');
    this.load.image('super-mushroom', 'assets/collectibles/super-mushroom.png');


    // Load sounds and music
    this.load.audio('music', 'assets/sound/music.mp3');
    this.load.audio('gameoversong', 'assets/sound/gameover.mp3');
    this.load.audio('win', 'assets/sound/win.wav');
    this.load.audio('jumpsound', 'assets/sound/jump.mp3');
    this.load.audio('coin', 'assets/sound/coin.mp3');
    this.load.audio('powerup-appears', 'assets/sound/powerup-appears.mp3');
    this.load.audio('consume-powerup', 'assets/sound/consume-powerup.mp3');
    this.load.audio('powerdown', 'assets/sound/powerdown.mp3');
    this.load.audio('goomba-stomp', 'assets/sound/goomba-stomp.wav');
    this.load.audio('flagpole', 'assets/sound/flagpole.mp3');

    // Load Fonts
    this.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');

    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true);
}

function initSounds() {
    this.musicTheme = this.sound.add('music', { volume: 0.05 });
    this.musicTheme.play({ loop: -1 });
    this.gameOverSong = this.sound.add('gameoversong', { volume: 0.2 });
    this.winSound = this.sound.add('win', { volume: 0.2 });
    this.jumpSound = this.sound.add('jumpsound', { volume: 0.02 });
    this.coinSound = this.sound.add('coin', { volume: 0.1 });
    this.powerUpAppears = this.sound.add('powerup-appears', { volume: 0.1 });
    this.consumePowerUp = this.sound.add('consume-powerup', { volume: 0.1 });
    this.powerDown = this.sound.add('powerdown', { volume: 0.2 });
    this.goombaStomp = this.sound.add('goomba-stomp', { volume: 1 });
    this.flagPole = this.sound.add('flagpole', { volume: 0.2 });
}

function create() {
    playerController = {
        time: {
            leftDown: 0,
            rightDown: 0
        },
        speed: {
            run: velocityX,
        }
    };

    initSounds.call(this);

    this.physics.world.setBounds(0, 0, worldWidth, screenHeight);

    // Create camera
    this.cameras.main.setBounds(0, 0, worldWidth, screenHeight);

    createAnimations.call(this);
    createPlayer.call(this);
    generateWorld.call(this);
    generateStructures.call(this);
    createGoombas.call(this);
    createControls.call(this);
    createHUD.call(this);

    smoothedControls = new SmoothedHorionztalControl(0.001);
}

function createHUD() {
    this.scoreText = this.add.text(32, 32, '', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 65), align: 'left'});
    this.scoreText.setScrollFactor(0).depth = 3;

    this.highScoreText = this.add.text(screenWidth / 2, 32, 'HIGH SCORE\n 000000', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 65), align: 'center'}).setOrigin(0.5, 0);
    this.highScoreText.setScrollFactor(0).depth = 3;

    let localHighScore = localStorage.getItem('high-score');
    if (localHighScore !== null) {
        this.highScoreText.setText('HIGH SCORE\n' + localHighScore.toString().padStart(6, '0'))
    }
}

function updateScore() {
    if (!this.scoreText) return;

    this.scoreText.setText('MARIO\n' + score.toString().padStart(6, '0'));
}

function createControls() {
    
    // Create JoyStick
    // https://codepen.io/rexrainbow/pen/oyqvQY

    this.joyStick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
        x: screenWidth * 0.118,
        y: screenHeight / 1.68,
        radius: mobileDevice ? 100 : 0,
        base: this.add.circle(0, 0, mobileDevice ? 75 : 0, 0x0000000, 0.05),
        thumb: this.add.circle(0, 0, mobileDevice ? 25 : 0, 0xcccccc, 0.2),
        // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
        // forceMin: 16,
        // enable: true
    });

    // Create controls cursor keys
    cursors = this.input.keyboard.createCursorKeys();

    // Create WASD Controls
    controlKeys.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    controlKeys.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    controlKeys.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    controlKeys.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    controlKeys.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}


// Game over functions

function gameOverScreen() {
    if (localStorage.getItem('high-score') !== null) {
        if (localStorage.getItem('high-score') < score) {
            localStorage.setItem('high-score', score);
            this.highScoreText.setText('NEW HIGH SCORE!\n' + score.toString().padStart(6, '0'))
        }
    } else {
        localStorage.setItem('high-score', score);
    }

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    let gameOverScreen = this.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x000000).setScrollFactor(0);
    gameOverScreen.alpha = 0;
    gameOverScreen.depth = 2;
    this.tweens.add({
        targets: gameOverScreen,
        duration: 200,
        alpha: 1
    });
    this.add.bitmapText(screenCenterX, screenHeight / 3, 'carrier_command', 'GAME OVER', screenWidth / 30).setOrigin(0.5).depth = 3;
    this.add.bitmapText(screenCenterX, screenHeight / 2, 'carrier_command', '> RESTART   ', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => location.reload()).depth = 3;
    this.add.bitmapText(screenCenterX, screenHeight / 1.7, 'carrier_command', '> SCREENSHOT', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => getScreenshot()).depth = 3;
}

function gameOverFunc() {
    player.anims.play('hurt', true);
    player.body.enable = false;
    this.finalFlagMast.body.enable = false;
    let goombas = this.goombasGroup.getChildren();
    for (let i = 0; i < goombas.length; i++) {
        goombas[i].body.enable = false;
    }
    let platformPieces = this.platformGroup.getChildren();
    for (let i = 0; i < platformPieces.length; i++) {
        platformPieces[i].body.enable = false;
    }
    let blocks = this.blocksGroup.getChildren();
    for (let i = 0; i < blocks.length; i++) {
        blocks[i].body.enable = false;
    }
    let misteryBlocks = this.misteryBlocksGroup.getChildren();
    for (let i = 0; i < misteryBlocks.length; i++) {
        misteryBlocks[i].body.enable = false;
    }
    player.body.setSize(16, 16).setOffset(0);
    player.setVelocityX(0);
    setTimeout(() => {
    player.body.enable = true;
    player.setVelocityY(-velocityY * 1.1);
    }, 500);
    this.musicTheme.pause();
    this.gameOverSong.play();
    setTimeout(() => {
        player.depth = 0;
        gameOverScreen.call(this);
        this.physics.pause();
    }, 3000);
    return;
}

function winScreen() {
    if (localStorage.getItem('high-score') !== null) {
        if (localStorage.getItem('high-score') < score) {
            localStorage.setItem('high-score', score);
            this.highScoreText.setText('NEW HIGH SCORE!\n' + score.toString().padStart(6, '0'))
        }
    } else {
        localStorage.setItem('high-score', score);
        this.highScoreText.setText('NEW HIGH SCORE!\n' + score.toString().padStart(6, '0'))
    }

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    let winScreen = this.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x000000).setScrollFactor(0);
    winScreen.alpha = 0;
    winScreen.depth = 2;
    this.tweens.add({
        targets: winScreen,
        duration: 300,
        alpha: 1
    });
    this.add.bitmapText(screenCenterX, screenHeight / 3, 'carrier_command', 'YOU WON!', screenWidth / 30).setOrigin(0.5).depth = 3;
    this.add.bitmapText(screenCenterX, screenHeight / 2, 'carrier_command', '> RESTART   ', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => location.reload()).depth = 3;
    this.add.bitmapText(screenCenterX, screenHeight / 1.7, 'carrier_command', '> SCREENSHOT', screenWidth / 50).setOrigin(0.5).setInteractive().on('pointerdown', () => getScreenshot()).depth = 3;
}


// This will generate a random coordinate, that can't be within a hole

function generateRandomCoordinate(entitie=false) {

    let coordinate = Phaser.Math.Between(entitie ? startOffset * 1.5 : 0, entitie ? worldWidth - (worldWidth / 20) : worldWidth);
    for (let hole of worldHolesCoords) {
      if (coordinate >= hole.start && coordinate <= (hole.end + platformPiecesWidth)) {
        return coordinate + platformPiecesWidth * 2;
      }
    }
    return coordinate;
}

// World generation

function generateWorld() {

    //Drawing scenery

    //> Drawing the Sky
    this.add.rectangle(0, 0, worldWidth, screenHeight, 0x8585FF).setOrigin(0);

    //> Clouds
    for (i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 760), Math.trunc(worldWidth / 380)); i++) {
        let x = Phaser.Math.Between(0, worldWidth);
        let y = Phaser.Math.Between(0, screenHeight / 2.2);
        if (Phaser.Math.Between(0, 10) < 5) {
            this.add.image(x, y, 'cloud1').scale = screenHeight / 1725;
        } else {
            this.add.image(x, y, 'cloud2').scale = screenHeight / 1725;
        }
    }

    //> Creating the platform

    // pieceStart will be the next platform piece start pos. This value will be modified after each execution
    let pieceStart = 0;
    // This will tell us if last generated piece of platform was empty, to avoid generating another empty piece next to it.
    let lastWasHole = 0;
    
    this.platformGroup = this.add.group();
    this.fallProtectionGroup = this.add.group();

    for (i=0; i <= platformPieces; i++) {
        // Holes will have a 10% chance of spawning
        let number = Phaser.Math.Between(0, 100);

        // Check if its not a hole, this means is not that 10%, is not in the spawn safe area and is not close to the end castle.
        if (pieceStart >= (worldWidth - platformPiecesWidth * 4) || number <= 89 || pieceStart <= screenWidth || lastWasHole > 0 || pieceStart >= worldWidth - (worldWidth / 40)) {
            lastWasHole--;

            //> Create platform
            let Npiece = this.add.tileSprite(pieceStart, screenHeight, platformPiecesWidth, platformHeight, 'floorbricks').setScale(1).setOrigin(1);
            this.physics.add.existing(Npiece);
            Npiece.body.immovable = true;
            Npiece.body.allowGravity = false;
            this.platformGroup.add(Npiece);
            // Apply player collision with platform
            this.physics.add.collider(player, Npiece);

            // Save every hole start and end for later use
            worldHolesCoords.push({ start: pieceStart, 
                end: pieceStart + platformPiecesWidth});

        } else {
            lastWasHole = 2;
            this.fallProtectionGroup.add(this.add.rectangle(pieceStart, screenHeight - platformHeight, 5, 5).setOrigin(0, 1));
            this.fallProtectionGroup.add(this.add.rectangle(pieceStart - platformPiecesWidth, screenHeight - platformHeight, 5, 5).setOrigin(1, 1));
        }
        pieceStart += platformPiecesWidth;
    }

    let fallProtections = this.fallProtectionGroup.getChildren();
    for (let i = 0; i < fallProtections.length; i++) {
        this.physics.add.existing(fallProtections[i]);
        fallProtections[i].body.allowGravity = false;
        fallProtections[i].body.immovable = true;
    }

    let propsY = screenHeight - (platformHeight);

    //> Mountains
    for (i = 0; i < Phaser.Math.Between(worldWidth / 6400, worldWidth / 3800); i++) {
        let x = generateRandomCoordinate();

        if (typeof x === 'number') {
            if (Phaser.Math.Between(0, 10) < 5) {
                this.add.image(x, propsY, 'mountain1').setOrigin(1).scale = screenHeight / 517;
            } else {
                this.add.image(x, propsY, 'mountain2').setOrigin(1).scale = screenHeight / 517;
            }
        }
    }
    
    //> Bushes
    for (i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 960), Math.trunc(worldWidth / 760)); i++) {
        let x = generateRandomCoordinate();

        if (typeof x === 'number') {
            if (Phaser.Math.Between(0, 10) < 5) {
                this.add.image(x, propsY, 'bush1').setOrigin(1).scale = screenHeight / 609;
            } else {
                this.add.image(x, propsY, 'bush2').setOrigin(1).scale = screenHeight / 609;
            }
        }
    }

    //> Fences
    for (i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 4000), Math.trunc(worldWidth / 2000)); i++) {
        let x = generateRandomCoordinate();

        if (typeof x === 'number') {
            this.add.tileSprite(x, propsY, Phaser.Math.Between(100, 250), 35, 'fence').setOrigin(1).scale = screenHeight / 863;
        }
    }

    //> Final flag
    this.finalFlagMast = this.add.tileSprite(worldWidth - (worldWidth / 25), propsY, 16, 167, 'flag-mast').setOrigin(0, 1);
    this.finalFlagMast.scale = screenHeight / 400;
    this.physics.add.existing(this.finalFlagMast);
    this.finalFlagMast.body.setSize(3, 167);
    this.finalFlagMast.immovable = true;
    this.physics.add.collider(this.platformGroup.getChildren(), this.finalFlagMast);
    this.physics.add.collider(player, this.finalFlagMast, null, raiseFlag, this);

    //> Flag
    this.finalFlag = this.add.image(worldWidth - (worldWidth / 25), propsY * 0.93, 'final-flag').setOrigin(0.5, 1);
    this.finalFlag.scale = screenHeight / 400;

    //> Castle
    this.add.image(worldWidth - (worldWidth / 75), propsY, 'castle').setOrigin(0.5, 1).scale = screenHeight / 300;
}

function raiseFlag() {
    if (flagRaised) {
        return false;
    }

    this.musicTheme.stop();
    this.flagPole.play();

    this.tweens.add({
        targets: this.finalFlag,
        duration: 1000,
        y: screenHeight / 2.2
    });

    setTimeout(() => {
        this.winSound.play();
    }, 1000);
    
    flagRaised = true;
    playerBlocked = true;

    addToScore.call(this, 2000);

    return false;
}

function generateStructures() {

    //> Creating world structures

    // pieceStart will be the next platform piece start pos. This value will be modified after each execution
    let pieceStart = platformPiecesWidth * 3;
    
    this.blocksGroup = this.add.group();
    this.misteryBlocksGroup = this.add.group();

    for (i=0; i <= platformPieces; i++) {

        for (let hole of worldHolesCoords) {
            if (pieceStart == hole.start || pieceStart == hole.end || 
                pieceStart - platformPiecesWidth == hole.start || pieceStart + platformPiecesWidth == hole.end ||
                pieceStart - platformPiecesWidth == hole.start || pieceStart + platformPiecesWidth == hole.end) 
                continue;
        }

        // Structures will have a 70% chance of spawning
        let number = 30//Phaser.Math.Between(0, 100)

        if (number <= 69 && !(pieceStart >= (worldWidth - platformPiecesWidth * 3))) {

            let random = Phaser.Math.Between(0, 5);
    
            //> Generate random structure an add it to blocksGroup
            switch (random) {
                case 0:
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 32, 16, 'block').setScale(screenHeight / 345).setOrigin(1.25, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 32, 16, 'block').setScale(screenHeight / 345).setOrigin(-0.25, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));

                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(3.6, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(5.61, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(4.6, 0.5));

                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-2.6, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-4.61, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-3.6, 0.5));
                    break;
                case 1:
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(3.6, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(5.61, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(4.6, 0.5));
                    
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-2.6, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-4.61, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-3.6, 0.5));

                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                    break;
                case 2:
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                    break;
                case 3:
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 32, 16, 'block').setScale(screenHeight / 345));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(0, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(1, 0.5));
                    break;
                case 4:
                    let random = Phaser.Math.Between(0, 4)
                    switch (random) {
                        case 0:
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(4, 0.5));
                            break;
                        case 1:
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                            break;
                        case 2:
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                            break;
                        case 3:
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(1.5 , 0.5));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-0.5 , 0.5));
                            break;
                        case 4:
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(1.75, 0.5));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(0.75, 0.5));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-0.25, 0.5));
                            this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-1.25, 0.5));
                            break;
                    }
                    break;
                case 5:
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 32, 16, 'block').setScale(screenHeight / 345).setOrigin(0.75, 0.5));
                    this.misteryBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'misteryBlock').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                    this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                    break;
            }

        }
        
        // Structures will generate every 2/4 platform pieces
        pieceStart += platformPiecesWidth * Phaser.Math.Between(2, 4);
    }

    // Stablish properties for every generated structure
    let misteryBlocks = this.misteryBlocksGroup.getChildren();
    for (let i = 0; i < misteryBlocks.length; i++) {
        this.physics.add.existing(misteryBlocks[i]);
        misteryBlocks[i].body.allowGravity = false;
        misteryBlocks[i].body.immovable = true;
        misteryBlocks[i].depth = 2
        //misteryBlocks[i].anims.play('default', true)
        this.physics.add.collider(player, misteryBlocks[i], revealHiddenBlock, null, this);
    }
    
    // Apply player collision with blocks
    let blocks = this.blocksGroup.getChildren();
    this.physics.add.collider(player, blocks);
    for (let i = 0; i < blocks.length; i++) {
        this.physics.add.existing(blocks[i]);
        blocks[i].body.allowGravity = false;
        blocks[i].body.immovable = true;
    }
}

function revealHiddenBlock(player, block) {
    if (player.body.blocked.up && !emptyBlocksList.includes(block)) {
        emptyBlocksList.push(block);
        block.setTexture('emptyBlock');
        this.tweens.add({
            targets: block,
            duration: 75,
            y: block.y - 30
        });
        setTimeout(() => {
            this.tweens.add({
                targets: block,
                duration: 75,
                y: block.y + 30
            });
        }, 100);

        let random = Phaser.Math.Between(0, 100);
        if (random < 90) {
            addToScore.call(this, 100, block);
            this.coinSound.play();
            let coin = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'coin').setScale(screenHeight / 357).setOrigin(0).anims.play('coin-default');
            coin.immovable = true;
            coin.smoothed = true;
            coin.depth = 0;
            this.tweens.add({
                targets: coin,
                duration: 300,
                y: coin.y - (screenHeight / 8.25)
            });
            setTimeout(() => {
                this.tweens.add({
                    targets: coin,
                    duration: 300,
                    y: coin.y + (screenHeight / 10.35)
                });
            }, 300);
            setTimeout(() => { coin.destroy(); }, 600);
        } else if (random >= 90 && random < 96 ) {
            this.powerUpAppears.play();
            let mushroom = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'super-mushroom').setScale(screenHeight / 345).setOrigin(0).setBounce(1, 0);
            this.tweens.add({
                targets: mushroom,
                duration: 300,
                y: mushroom.y - (screenHeight / 20)
            });
            setTimeout(() => {
                if (Phaser.Math.Between(0, 10) <= 4) {
                    mushroom.setVelocityX(125)
                } else {
                    mushroom.setVelocityX(-125)
                }
            }, 300);
            this.physics.add.overlap(player, mushroom, consumeMushroom, null, this);
            let blocks = this.blocksGroup.getChildren();
            this.physics.add.collider(mushroom, blocks);
            let misteryBlocks = this.misteryBlocksGroup.getChildren();
            this.physics.add.collider(mushroom, misteryBlocks);
            let platformPieces = this.platformGroup.getChildren();
            this.physics.add.collider(mushroom, platformPieces);
        } else {
            this.powerUpAppears.play();
            let fireFlower = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'fire-flower').setScale(screenHeight / 345).setOrigin(0);
            fireFlower.body.immovable = true;
            fireFlower.body.allowGravity = false;
            this.tweens.add({
                targets: fireFlower,
                duration: 300,
                y: fireFlower.y - (screenHeight / 23)
            });
            this.physics.add.overlap(player, fireFlower, consumeFireflower, null, this);
            let misteryBlocks = this.misteryBlocksGroup.getChildren();
            this.physics.add.collider(fireFlower, misteryBlocks);
        }
    }
}

function consumeMushroom(player, mushroom) {
    this.consumePowerUp.play();
    addToScore.call(this, 1000, mushroom);
    mushroom.destroy();

    if (playerState > 0 )
    return;

    playerBlocked = true;
    this.physics.pause();
    player.setTint(0xfefefe).anims.play('idle');
    setTimeout(()=> {
        player.anims.play('grown-mario-idle');
        setTimeout(()=> {
            player.anims.play('idle');
            setTimeout(()=> {
                player.anims.play('grown-mario-idle');
                setTimeout(()=> {
                    player.anims.play('idle');
                    setTimeout(()=> {
                        player.anims.play('grown-mario-idle');
                        setTimeout(()=> {
                            player.clearTint();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);

    setTimeout(() => { 
        this.physics.resume();
        playerBlocked = false;
        playerState = 1;
    }, 1000);
    //player.body.setSize(16, 32).setOffset(1,0);
}

function consumeFireflower(player, fireFlower) {
    this.consumePowerUp.play();
    addToScore.call(this, 1000, fireFlower);
    fireFlower.destroy();

    if (playerState > 1 )
    return;

    let anim = playerState > 0 ? 'grown-mario-idle' : 'idle';

    playerBlocked = true;
    this.physics.pause();
    player.setTint(0xfefefe).anims.play(anim);
    setTimeout(()=> {
        player.anims.play('fire-mario-idle');
        setTimeout(()=> {
            player.anims.play(anim);
            setTimeout(()=> {
                player.anims.play('fire-mario-idle');
                setTimeout(()=> {
                    player.anims.play(anim);
                    setTimeout(()=> {
                        player.anims.play('fire-mario-idle');
                        setTimeout(()=> {
                            player.clearTint();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);

    setTimeout(() => { 
        this.physics.resume();
        playerBlocked = false;
        playerState = 2;
    }, 1000);
    //player.body.setSize(16, 32).setOffset(1,0);
}

function addToScore(num, originObject) {

    for (i = 1; i <= num; i++) {
        setTimeout(() => {
            score += 1;
        }, i);
    }

    if (originObject != null) {
        let textEffect = this.add.text(originObject.getBounds().x, originObject.getBounds().y, num, { fontFamily: 'pixel_nums', fontSize: (screenWidth / 150), align: 'center'}).setOrigin(0);
        textEffect.smoothed = true;
        textEffect.depth = 5;
        this.tweens.add({
            targets: textEffect,
            duration: 400,
            y: textEffect.y - screenHeight / 6.5
        });
        setTimeout(() => { 
            this.tweens.add({
                targets: textEffect,
                duration: 200,
                alpha: 0
            });
         }, 200);

        setTimeout(() => { textEffect.destroy(); }, 400);
    }
}

function createAnimations() {

    //> Mario animations
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'mario', frame: 0 }]
    });
    this.anims.create({
        key: 'run',
        frames: this.anims.generateFrameNumbers('mario', { start: 3, end: 1 }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'hurt',
        frames: [{ key: 'mario', frame: 4 }]
    });
    this.anims.create({
        key: 'jump',
        frames: [{ key: 'mario', frame: 5 }]
    });

    //> Grown Mario animations
    this.anims.create({
        key: 'grown-mario-idle',
        frames: [{ key: 'mario-grown', frame: 0 }]
    });
    this.anims.create({
        key: 'grown-mario-run',
        frames: this.anims.generateFrameNumbers('mario-grown', { start: 3, end: 1 }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'grown-mario-crouch',
        frames: [{ key: 'mario-grown', frame: 4 }]
    });
    this.anims.create({
        key: 'grown-mario-jump',
        frames: [{ key: 'mario-grown', frame: 5 }]
    });

    //> Fire Mario animations
    this.anims.create({
        key: 'fire-mario-idle',
        frames: [{ key: 'mario-fire', frame: 0 }]
    });
    this.anims.create({
        key: 'fire-mario-run',
        frames: this.anims.generateFrameNumbers('mario-fire', { start: 3, end: 1 }),
        frameRate: 12,
        repeat: -1
    });
    this.anims.create({
        key: 'fire-mario-crouch',
        frames: [{ key: 'mario-fire', frame: 4 }]
    });
    this.anims.create({
        key: 'fire-mario-jump',
        frames: [{ key: 'mario-fire', frame: 5 }]
    });

    //> Goomba animations
    this.anims.create({
        key: 'goomba-walk',
        frames: this.anims.generateFrameNumbers('goomba', { start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1
    });
    this.anims.create({
        key: 'goomba-hurt',
        frames: [{ key: 'goomba', frame: 2 }]
    });

    //> Coins
    this.anims.create({
        key: 'coin-default',
        frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
}

function createPlayer() {
    // Draw player
    player = this.physics.add.sprite(startOffset, screenHeight - platformHeight, 'mario').setOrigin(1).setBounce(0).setCollideWorldBounds(true);
    player.scale = screenHeight / 376;
    player.smoothed = true;
    player.depth = 3;
    // Tell the camera to start following the player
    this.cameras.main.startFollow(player, true, 0.05, 0.05);
    this.cameras.main.followOffset.set(startOffset / 6, 0);
}

function createGoombas() {
    this.goombasGroup = this.add.group();

    for (i = 0; i < Phaser.Math.Between(Math.trunc(worldWidth / 960), Math.trunc(worldWidth / 760)); i++) {
        let x = generateRandomCoordinate(true);
        let goomba = this.physics.add.sprite(x, screenHeight - platformHeight, 'goomba').setOrigin(0.5, 1).setBounce(1, 0).setCollideWorldBounds(true);
        goomba.anims.play('goomba-walk', true)
        goomba.scale = screenHeight / 376;
        goomba.smoothed = true;
        goomba.depth = 2;
        if (Phaser.Math.Between(0, 10) <= 4) {
            goomba.setVelocityX(110)
        } else {
            goomba.setVelocityX(-110)
        }
        goomba.setMaxVelocity(250, levelGravity)
        this.goombasGroup.add(goomba);
        let platformPieces = this.platformGroup.getChildren();
        this.physics.add.collider(goomba, platformPieces);
        let blocks = this.blocksGroup.getChildren();
        this.physics.add.collider(goomba, blocks);
        let misteryBlocks = this.misteryBlocksGroup.getChildren();
        this.physics.add.collider(goomba, misteryBlocks);
        let goombas = this.goombasGroup.getChildren();
        this.physics.add.collider(goomba, goombas);
        this.physics.add.overlap(player, goomba, checkGoombaCollision, null, this);
    }

    // Create collision with fall protections to stop goombas from falling off the map
    this.physics.add.collider(this.goombasGroup.getChildren(), this.fallProtectionGroup.getChildren(), revealHiddenBlock, null, this);
}

function checkGoombaCollision(player, goomba) {

    let goombaBeingStomped = player.body.touching.down && goomba.body.touching.up;

    if (playerInvulnerable) {
        if (!goombaBeingStomped) {
            return;
        }
    }
    
    if (goombaBeingStomped) {
        goomba.anims.play('goomba-hurt', true);
        goomba.body.enable = false;
        this.goombasGroup.remove(goomba);
        this.goombaStomp.play();
        player.setVelocityY(-velocityY / 1.5);
        addToScore.call(this, 100, goomba);
        setTimeout(() => {
            this.tweens.add({
                targets: goomba,
                duration: 300,
                alpha: 0
            });
        }, 200);
        setTimeout(() => {
            goomba.destroy();
        }, 500);
        return;
    }
    
    decreasePlayerState.call(this);
        
    return;
}

function decreasePlayerState() {
    if (playerState == 0) {
        gameOver = true;
        gameOverFunc.call(this);
        return;
    }

    let blinkAnim = this.tweens.add({
        targets: player,
        duration: 100,
        alpha: { from: 1, to: 0 },
        ease: 'Linear',
        repeat: -1,
        yoyo: true
    });

    this.powerDown.play();

    if (playerState == 1) {
        //player.body.setSize(16, 16).setOffset(0.3, 0.5);
        playerState = 0;
    }

    if (playerState == 2) {
        playerState = 1;
    }

    playerInvulnerable = true;
    setTimeout(() => {
        playerInvulnerable = false;
        blinkAnim.stop();
        player.alpha = 1;
    }, 2000);
}

function update(delta) {
    if (gameOver || gameWinned) return;

    // Check if player has fallen
    if (player.y > screenHeight - 10) {
        gameOver = true;
        gameOverFunc.call(this);
        return;
    }
   
    updateScore.call(this);

    // Win animation
    if (playerBlocked && flagRaised) {
        player.setVelocityX(200);
        if (playerState == 0)
        player.anims.play('run', true).flipX = false;
        if (playerState == 1)
        player.anims.play('grown-mario-run', true).flipX = false;
        if (playerState == 2)
        player.anims.play('fire-mario-run', true);

        if(player.x >= worldWidth - (worldWidth / 75)) {
            this.tweens.add({
                targets: player,
                duration: 75,
                alpha: 0
            });
        }
        setTimeout(() => {
            player.destroy();
            winScreen.call(this);
            gameWinned = true;
        }, 5000);
        return;
    }

    if (playerBlocked)
        return;

    // Player controls
    // https://github.com/photonstorm/phaser3-examples/blob/master/public/src/tilemap/collision/matter%20destroy%20tile%20bodies.js#L323
    // https://codepen.io/rexrainbow/pen/oyqvQY

    // > Vertical movement
    if ((cursors.up.isDown || controlKeys.SPACE.isDown || this.joyStick.up) && player.body.touching.down) {
        this.jumpSound.play();
        (playerState > 0 && (cursors.down.isDown || controlKeys.S.isDown|| this.joyStick.down)) ? player.setVelocityY(-velocityY / 1.25) : player.setVelocityY(-velocityY);
    }

    // > Horizontal movement and animations
    var oldVelocityX;
    var targetVelocityX;
    var newVelocityX;

    if (cursors.left.isDown || controlKeys.A.isDown || this.joyStick.left) {
        smoothedControls.moveLeft(delta);
        if (playerState == 0)
        player.anims.play('run', true).flipX = true;

        if (playerState == 1)
        player.anims.play('grown-mario-run', true).flipX = true;

        if (playerState == 2)
        player.anims.play('fire-mario-run', true).flipX = true;
        
        // Lerp the velocity towards the max run using the smoothed controls.
        // This simulates a player controlled acceleration.
        oldVelocityX = player.body.velocity.x;
        targetVelocityX = -playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, -smoothedControls.value);

        player.setVelocityX(newVelocityX);
    } else if (cursors.right.isDown  || controlKeys.D.isDown|| this.joyStick.right) {
        smoothedControls.moveRight(delta);
        if (playerState == 0)
        player.anims.play('run', true).flipX = false;

        if (playerState == 1)
        player.anims.play('grown-mario-run', true).flipX = false;

        if (playerState == 2)
        player.anims.play('fire-mario-run', true).flipX = false;

        // Lerp the velocity towards the max run using the smoothed controls.
        // This simulates a player controlled acceleration.
        oldVelocityX = player.body.velocity.x;
        targetVelocityX = playerController.speed.run;
        newVelocityX = Phaser.Math.Linear(oldVelocityX, targetVelocityX, smoothedControls.value);

        player.setVelocityX(newVelocityX);    
    } else {
        if (player.body.velocity.x != 0)
            smoothedControls.reset();
        if (player.body.touching.down)
            player.setVelocityX(0);
        if (!cursors.up.isDown) {
            if (playerState == 0)
            player.anims.play('idle', true);
    
            if (playerState == 1)
            player.anims.play('grown-mario-idle', true);

            if (playerState == 2)
            player.anims.play('fire-mario-idle', true);
        }
    }

    if (playerState > 0 && (cursors.down.isDown || controlKeys.S.isDown|| this.joyStick.down)) {

        if (playerState == 1)
        player.anims.play('grown-mario-crouch', true);

        if (playerState == 2)
        player.anims.play('fire-mario-crouch', true);

        if (player.body.touching.down) {
            player.setVelocityX(0);
        } 

        player.body.setSize(16, 22).setOffset(0.5, 10.5);

        return;
    } else {
        if (playerState > 0)
            player.body.setSize(16, 32).setOffset(1,0);

        if (playerState == 0)
            player.body.setSize(16, 16).setOffset(0.3, 0.5);
    }
    
    // Apply jump animation
    if (!player.body.touching.down) {
        if (playerState == 0)
        player.anims.play('jump', true);

        if (playerState == 1)
        player.anims.play('grown-mario-jump', true);

        if (playerState == 2)
        player.anims.play('fire-mario-jump', true);
    }
}

function getScreenshot() {
    html2canvas(document.getElementById('game')).then(canvas => {
        // create a link to download the image
        var link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
        link.click();
    });
}
