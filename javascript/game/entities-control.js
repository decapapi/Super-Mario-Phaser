
const goombasVelocityX = screenWidth / 19

function createGoombas() {
    this.goombasGroup = this.add.group();

    for (i = 0; i < Math.trunc(worldWidth / 960); i++) {
        let x = generateRandomCoordinate(true);
        let goomba = this.physics.add.sprite(x, screenHeight - platformHeight, 'goomba').setOrigin(0.5, 1).setBounce(1, 0).setScale(screenHeight / 376);
        goomba.anims.play('goomba-walk', true);
        goomba.smoothed = true;
        goomba.depth = 2;
        if (Phaser.Math.Between(0, 10) <= 4) {
            goomba.setVelocityX(goombasVelocityX)
        } else {
            goomba.setVelocityX(-goombasVelocityX)
        }
        goomba.setMaxVelocity(goombasVelocityX, levelGravity)
        this.goombasGroup.add(goomba);
        let platformPieces = this.platformGroup.getChildren();
        this.physics.add.collider(goomba, platformPieces);
        let blocks = this.blocksGroup.getChildren();
        this.physics.add.collider(goomba, blocks);
        let misteryBlocks = this.misteryBlocksGroup.getChildren();
        this.physics.add.collider(goomba, misteryBlocks);
        let goombas = this.goombasGroup.getChildren();
        this.physics.add.collider(goomba, goombas);
        this.physics.add.collider(goomba, this.finalFlagMast);
        this.physics.add.overlap(player, goomba, checkGoombaCollision, null, this);
    }

    // Create collision with fall protections to stop goombas from falling off the map
    this.physics.add.collider(this.goombasGroup.getChildren(), this.immovableBlocksGroup.getChildren());
    this.physics.add.collider(this.goombasGroup.getChildren(), this.fallProtectionGroup.getChildren());
    this.physics.add.collider(this.goombasGroup.getChildren(), this.finalTrigger);

    setInterval(clearGoombas.call(this), 250);
}

function checkGoombaCollision(player, goomba) {

    if (goomba.dead)
        return;
    
    let goombaBeingStomped = player.body.touching.down && goomba.body.touching.up;

    if (flagRaised)
        return;

    if (playerInvulnerable) {
        if (!goombaBeingStomped) {
            return;
        }
    }
    
    if (goombaBeingStomped) {
        goomba.anims.play('goomba-hurt', true);
        goomba.body.enable = false;
        this.goombasGroup.remove(goomba);
        this.goombaStompSound.play();
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

function clearGoombas() {
    let goombas = this.goombasGroup.getChildren();

    for (let i = 0; i < goombas.length; i++) {
        if (goombas[i].body.velocity.x == 0 || (goombas[i].body.velocity.x > 0 && goombas[i].body.velocity.x != goombasVelocityX) || (goombas[i].body.velocity.x < 0 && goombas[i].body.velocity.x != -goombasVelocityX)) {
            this.goombasGroup.remove(goombas[i]);
            goombas[i].destroy();
        }
    }
}
