
const mushroomsVelocityX = screenWidth / 15;

function revealHiddenBlock(player, block) {
    if (player.body.blocked.up) {
        this.blockBumpSound.play();
        if (!emptyBlocksList.includes(block)) {
            emptyBlocksList.push(block);
            block.anims.stop();
            block.setTexture('emptyBlock');
            this.tweens.add({
                targets: block,
                duration: 75,
                y: block.y - screenHeight / 34.5
            });
            setTimeout(() => {
                this.tweens.add({
                    targets: block,
                    duration: 75,
                    y: block.y + screenHeight / 34.5
                });
            }, 100);
    
            let random = Phaser.Math.Between(0, 100);
            if (random < 90) {
                addToScore.call(this, 200, block);
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
                this.powerUpAppearsSound.play();
                let mushroom = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'super-mushroom').setScale(screenHeight / 345).setOrigin(0).setBounce(1, 0);
                this.tweens.add({
                    targets: mushroom,
                    duration: 300,
                    y: mushroom.y - (screenHeight / 20)
                });
                setTimeout(() => {
                    if (Phaser.Math.Between(0, 10) <= 4) {
                        mushroom.setVelocityX(mushroomsVelocityX)
                    } else {
                        mushroom.setVelocityX(-mushroomsVelocityX)
                    }
                }, 300);
                this.physics.add.overlap(player, mushroom, consumeMushroom, null, this);
                this.physics.add.collider(mushroom, this.blocksGroup.getChildren());
                this.physics.add.collider(mushroom, this.misteryBlocksGroup.getChildren());
                this.physics.add.collider(mushroom, this.platformGroup.getChildren());
                this.physics.add.collider(mushroom, this.immovableBlocksGroup.getChildren());
            } else {
                this.powerUpAppearsSound.play();
                let fireFlower = this.physics.add.sprite(block.getBounds().x, block.getBounds().y, 'fire-flower').setScale(screenHeight / 345).setOrigin(0);
                fireFlower.body.immovable = true;
                fireFlower.body.allowGravity = false;
                fireFlower.anims.play('fire-flower-default', true);
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
}

function destroyBlock(player, block) {
    if (player.body.blocked.up) { 
        this.blockBumpSound.play();
        if (playerState == 0 && !block.isImmovable) {
            this.tweens.add({
                targets: block,
                duration: 75,
                y: block.y - screenHeight / 69
            });
            setTimeout(() => {
                this.tweens.add({
                    targets: block,
                    duration: 75,
                    y: block.y + screenHeight / 69
                });
            }, 100);
        }
        
        if (playerState > 0 && !(cursors.down.isDown || controlKeys.S.isDown|| this.joyStick.down)) {
            this.breakBlockSound.play();
            addToScore.call(this, 50)
            drawDestroyedBlockParticles.call(this, block);
            block.destroy();
        }

    }
}

function drawDestroyedBlockParticles(block) {
    let playerBounds = player.getBounds();
    let blockBounds = block.getBounds();

    let particle1 = this.physics.add.sprite(playerBounds.left, blockBounds.y, 'brick-debris').anims.play('brick-debris-default', true);
    let particle2 = this.physics.add.sprite(playerBounds.right, blockBounds.y, 'brick-debris').anims.play('brick-debris-default', true);
    let particle3 = this.physics.add.sprite(playerBounds.left, blockBounds.y + block.height * 2.35, 'brick-debris').anims.play('brick-debris-default', true);
    let particle4 = this.physics.add.sprite(playerBounds.right, blockBounds.y + block.height * 2.35, 'brick-debris').anims.play('brick-debris-default', true);

    particle1.setVelocityY(-(screenHeight / 3.45)).scale = screenHeight / 517;
    particle2.setVelocityY(-(screenHeight / 3.45)).scale = screenHeight / 517;
    particle3.setVelocityY(-(screenHeight / 2.6)).scale = screenHeight / 517;
    particle4.setVelocityY(-(screenHeight / 2.6)).scale = screenHeight / 517;

    particle1.setVelocityX(-(screenWidth / 25.6)).depth = 4;
    particle2.setVelocityX(screenWidth / 25.6).depth = 4;
    particle3.setVelocityX(-(screenWidth / 25.6)).depth = 4;
    particle4.setVelocityX(screenWidth / 25.6).depth = 4;

    setTimeout(() => {
        particle1.destroy();
        particle2.destroy();
        particle3.destroy();
        particle4.destroy();
    }, 3000);
}
