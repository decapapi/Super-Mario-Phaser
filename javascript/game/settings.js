
var keydownHandler;

function showSettings() {
    if (!this.settingsMenuOpen) {
        this.settingsMenuOpen = true;
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
    this.settingsMenuOpen = false;
}

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

    // Special thanks to chatGPT for making this list for me
    const specialCharMap = {
        8: 'BACKSPACE',
        9: 'TAB',
        13: 'ENTER',
        16: 'SHIFT',
        17: 'CTRL',
        18: 'ALT',
        20: 'CAPS',
        27: 'ESCAPE',
        32: 'SPACE',
        33: 'PAGE UP',
        34: 'PAGE DOWN',
        35: 'END',
        36: 'HOME',
        37: '←',
        38: '↑',
        39: '→',
        40: '↓',
        45: 'INSERT',
        46: 'DELETE',
        112: 'F1',
        113: 'F2',
        114: 'F3',
        115: 'F4',
        116: 'F5',
        117: 'F6',
        118: 'F7',
        119: 'F8',
        120: 'F9',
        121: 'F10',
        122: 'F11',
        123: 'F12',
        192: 'Ñ',
        219: '?',
        220: '¿'
    };

    const displayChar = charCode => specialCharMap[charCode] || String.fromCharCode(charCode);

    const directionTexts = [
        {
            control: 'JUMP',
            text: this.add.text(screenWidth / 1.37, screenHeight / 2.25, displayChar(controlKeys.JUMP.keyCode), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}),
            icon: this.add.sprite(screenWidth / 1.37, screenHeight / 2, 'mario').setScale(screenHeight / 500).setOrigin(0.5).anims.play('jump')
        },
        {
            control: 'DOWN',
            text: this.add.text(screenWidth / 1.37, screenHeight / 1.75, displayChar(controlKeys.DOWN.keyCode), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}),
            icon: this.add.sprite(screenWidth / 1.37, screenHeight / 1.68, 'mario-grown').setScale(screenHeight / 550).setOrigin(0.6, 0).anims.play('grown-mario-crouch')
        },
        {
            control: 'LEFT',
            text: this.add.text(screenWidth / 1.5, screenHeight / 1.75, displayChar(controlKeys.LEFT.keyCode), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}),
            icon: this.add.sprite(screenWidth / 1.56, screenHeight / 1.75, 'mario').setScale(screenHeight / 500).setFlipX(true).setOrigin(0.6, 0.5)
        },
        {
            control: 'RIGHT',
            text: this.add.text(screenWidth / 1.26, screenHeight / 1.75, displayChar(controlKeys.RIGHT.keyCode), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}),
            icon: this.add.sprite(screenWidth / 1.22, screenHeight / 1.75, 'mario').setScale(screenHeight / 500).setOrigin(0.6, 0.5)
        },
        {
            control: 'FIRE',
            text: this.add.text(screenWidth / 1.65, screenHeight / 2.5, displayChar(controlKeys.FIRE.keyCode), { fontFamily: 'pixel_nums', fontSize: (screenWidth / 55), align: 'center'}),
            icon: this.add.sprite(screenWidth / 1.65, screenHeight / 2.25, 'fireball').setScale(screenHeight / 300).setOrigin(0.5).anims.play('fireball-right-down', true)
        },
    ];

    directionTexts.forEach(({control, text, icon}) => {
        text.setInteractive().setOrigin(0.5, 0.4).depth = 5;
        icon.depth = 5;
        this.settingsMenuObjects.add(text);
        this.settingsMenuObjects.add(icon);

        text.on('pointerdown', function () {
            text.setText('...');
    
            keydownHandler = function (event) {
                document.removeEventListener('keydown', keydownHandler);
    
                let key = event.keyCode;
    
                if (Object.values(controlKeys).some(({ keyCode }) => keyCode === key)) {
                    alert('Key is already in use!');
                    text.setText(displayChar(controlKeys[control].keyCode));
                    return;
                }
    
                controlKeys[control] = this.input.keyboard.addKey(key);
                text.setText(displayChar(controlKeys[control].keyCode));
                localStorage.setItem(control, controlKeys[control].keyCode);
            }.bind(this);
            document.addEventListener('keydown', keydownHandler);
        }.bind(this));
    });
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
