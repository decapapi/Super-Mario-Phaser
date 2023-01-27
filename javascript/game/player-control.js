
function createPlayer() {
    // Draw player
    player = this.physics.add.sprite( /*screenWidth * 1.5*/ startOffset, screenHeight - platformHeight, 'mario').setOrigin(1).setBounce(0).setCollideWorldBounds(true);
    player.scale = screenHeight / 376;
    player.depth = 3;
    /*this.cameras.main.startFollow(player);
    playerState = 2;*/
}

function decreasePlayerState() {

    if (playerState <= 0) {
        gameOver = true;
        gameOverFunc.call(this);
        return;
    }
    
    playerBlocked = true;
    this.physics.pause();
    this.anims.pauseAll();
    this.powerDownSound.play();

    let anim1 = playerState == 2 ? 'fire-mario-idle' : 'grown-mario-idle';
    let anim2 = playerState == 2 ? 'grown-mario-idle' : 'idle';

    applyPlayerInvulnerability.call(this, 3000);
    player.anims.play(anim1);
    setTimeout(()=> {
        player.anims.play(anim2);
        setTimeout(()=> {
            player.anims.play(anim1);
            setTimeout(()=> {
                player.anims.play(anim2);
                setTimeout(()=> {
                    player.anims.play(anim1);
                    setTimeout(()=> {
                        player.anims.play(anim2);
                        setTimeout(()=> {
                            player.clearTint();
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);

    playerState--;

    setTimeout(() => { 
        this.physics.resume();
        this.anims.resumeAll();
        playerBlocked = false;
        updateTimer.call(this);
    }, 1000);
}

function applyPlayerInvulnerability(time) {
    let blinkAnim = this.tweens.add({
        targets: player,
        duration: 100,
        alpha: { from: 1, to: 0.2 },
        ease: 'Linear',
        repeat: -1,
        yoyo: true
    });

    playerInvulnerable = true;
    setTimeout(() => {
        playerInvulnerable = false;
        blinkAnim.stop();
        player.alpha = 1;
    }, time);
}
