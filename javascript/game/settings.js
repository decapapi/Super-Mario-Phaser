
function showSettings() {
    if(player.body.blocked.up) {
        player.anims.play('idle', true);
        playerBlocked = true;
        player.setVelocityX(0);
        this.musicTheme.pause();
        this.pauseSound.play();
        drawSettingsMenu.call(this);
    }
}

function hideSettings() {
    let settingsObjects = this.settingsMenuObjects.getChildren();

    for (let i = 0; i < settingsObjects.length; i++) {
        settingsObjects[i].visible = false;
    }
    this.musicTheme.resume();
    playerBlocked = false;
    applySettings.call(this);
}

//https://codepen.io/rexrainbow/pen/YMyBom

function drawSettingsMenu() {

    if (this.settingsMenuCreated) {
        let settingsObjects = this.settingsMenuObjects.getChildren();
        for (let i = 0; i < settingsObjects.length; i++) {
            settingsObjects[i].visible = true;
        }
        return;
    }

    this.settingsMenuCreated = true;

    this.settingsMenuObjects = this.add.group();
    
    //> Settings

    let settingsBackground = this.add.rectangle(0, screenHeight / 2, worldWidth, screenHeight, 0x171717, 0.95).setScrollFactor(0);
    settingsBackground.depth = 4
    this.settingsMenuObjects.add(settingsBackground);

    let settingsXbutton = this.add.text(screenWidth * 0.94, screenHeight - (screenHeight* 0.9), 'x', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 50), align: 'center'}).setInteractive().on('pointerdown', () => hideSettings.call(this));
    settingsXbutton.depth = 5;
    this.settingsMenuObjects.add(settingsXbutton);

    let settingsText = this.add.text(screenWidth / 6, screenHeight - (screenHeight* 0.85), 'Settings', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 45), align: 'center'});
    settingsText.depth = 5;
    this.settingsMenuObjects.add(settingsText);

    let musicCheckbox = this.add.rexCheckbox(screenWidth / 10, screenHeight / 2.9, screenWidth / 40, screenWidth / 40, {
        color: 0x323232,
        checked: localStorage.getItem('music-enabled') == 'true' || localStorage.getItem('music-enabled') == 'false' ? localStorage.getItem('music-enabled') == 'true' : true,
        animationDuration: 150
    });
    musicCheckbox.depth = 5;
    this.settingsMenuObjects.add(musicCheckbox);

    musicCheckbox.on('valuechange', function() {
        localStorage.setItem('music-enabled', musicCheckbox.checked)
    });

    let musicCheckboxText = this.add.text(screenWidth / 8, screenHeight / 2.9, 'Music', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}).setOrigin(0.5, 0).setInteractive().on('pointerdown', () => musicCheckbox.toggleChecked());;
    musicCheckboxText.setOrigin(0, 0.4).depth = 5;
    this.settingsMenuObjects.add(musicCheckboxText);

    let effectsCheckbox = this.add.rexCheckbox(screenWidth / 10, screenHeight / 2.3, screenWidth / 40, screenWidth / 40, {
        color: 0x323232,
        checked: localStorage.getItem('effects-enabled') == 'true' || localStorage.getItem('effects-enabled') == 'false' ? localStorage.getItem('effects-enabled') == 'true' : true,
        animationDuration: 150
    });
    effectsCheckbox.depth = 5;
    this.settingsMenuObjects.add(effectsCheckbox);

    effectsCheckbox.on('valuechange', function() {
        localStorage.setItem('effects-enabled', effectsCheckbox.checked)
    });

    let effectsCheckboxText = this.add.text(screenWidth / 8, screenHeight / 2.3, 'Effects', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}).setOrigin(0.5, 0).setInteractive().on('pointerdown', () => effectsCheckbox.toggleChecked());
    effectsCheckboxText.setOrigin(0, 0.4).depth = 5;
    this.settingsMenuObjects.add(effectsCheckboxText);

    let sliderDot = this.add.circle(screenWidth / 5.15, screenHeight / 1.6, screenWidth / 115, 0xffffff, 0.75)
    sliderDot.slider = this.plugins.get('rexsliderplugin').add(sliderDot, {
        endPoints: [{
                x: sliderDot.x - screenWidth / 9.5,
                y: sliderDot.y
            },
            {
                x: sliderDot.x + screenWidth / 9.5,
                y: sliderDot.y
            }
        ],
        value: 0.69
    });
    sliderDot.depth = 5;
    this.settingsMenuObjects.add(sliderDot);

    let sliderBar = this.add.graphics();
    sliderBar.lineStyle(5, 0x373737, 1).strokePoints(sliderDot.slider.endPoints).depth = 4;
    this.settingsMenuObjects.add(sliderBar);

    let sliderDotText = this.add.text(screenWidth / 5.15, screenHeight / 1.85, 'General volume', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 60), align: 'center'}).setOrigin(0.5, 0);
    sliderDotText.depth = 5;
    this.settingsMenuObjects.add(sliderDotText);

    let sliderPercentageText = this.add.text(screenWidth / 5.15, screenHeight / 1.5, Math.trunc(sliderDot.slider.value * 100), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 80), align: 'center'}).setOrigin(0.5, 0);
    sliderPercentageText.depth = 5;
    this.settingsMenuObjects.add(sliderPercentageText);

    sliderDot.slider.on('valuechange', function() {
        sliderPercentageText.setText(Math.trunc(sliderDot.slider.value * 100));
        localStorage.setItem('volume', Math.trunc(sliderDot.slider.value * 100))
    });

    if (localStorage.getItem('volume')) {
        sliderDot.slider.value = localStorage.getItem('volume') / 100;
    }

    let separationLine = this.add.graphics();
    separationLine.lineStyle(0.5, 0xffffff, 0.1).strokePoints([{
        x: screenWidth / 2,
        y: screenHeight * 0.85
    },
    {
        x: screenWidth / 2,
        y: screenHeight * 0.15
    }]).depth = 4;
    this.settingsMenuObjects.add(separationLine);

    //> Controls

    let controlsText = this.add.text(screenWidth / 1.5, screenHeight - (screenHeight* 0.85), 'Controls', { fontFamily: 'pixel_nums', fontSize: (screenWidth / 45), align: 'center'});
    controlsText.depth = 5;
    this.settingsMenuObjects.add(controlsText);

}

function applySettings() {

    if (localStorage.getItem('volume')) {
        this.sound.volume = localStorage.getItem('volume') / 100;
    } else {
        this.sound.volume = 0.69;
    }

    if (localStorage.getItem('music-enabled')) {
        let isMuted = localStorage.getItem('music-enabled') == 'false';

        let musicElems = this.musicGroup.getChildren();
        for (let i = 0; i < musicElems.length; i++) {
            musicElems[i].setMute(isMuted);
        }
    }

    if (localStorage.getItem('effects-enabled')) {
        let isMuted = localStorage.getItem('effects-enabled') == 'false';

        let effectsElems = this.effectsGroup.getChildren();
        for (let i = 0; i < effectsElems.length; i++) {
            effectsElems[i].setMute(isMuted);
        }
    }
}
