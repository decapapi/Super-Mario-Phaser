
function generateStructure(pieceStart) {
    let random = Phaser.Math.Between(0, 5);
    //> Generate random structure an add it to their blocksGroup

    if (isLevelOverworld) {
        switch (random) {
            case 0:
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9),'mistery-block').setScale(screenHeight / 345));

                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(3.6, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(5.6, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(4.6, 0.5));

                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-2.6, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-4.6, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-3.6, 0.5));
                return Phaser.Math.Between(1, 3);
            case 1:
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2.8, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(4.8, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(3.8, 0.5));
                
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.9, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-3.9, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-2.9, 0.5));

                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345));
                return Phaser.Math.Between(1, 3);
            case 2:
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                return Phaser.Math.Between(1, 3);
            case 3:
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(0, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(0, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(1, 0.5));
                return Phaser.Math.Between(1, 3);
            case 4:
                let random = Phaser.Math.Between(0, 4)
                switch (random) {
                    case 0:
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(4, 0.5));
                        break;
                    case 1:
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                        break;
                    case 2:
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345));
                        break;
                    case 3:
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(1.5 , 0.5));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-0.5 , 0.5));
                        break;
                    case 4:
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(1.75, 0.5));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(0.75, 0.5));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-0.25, 0.5));
                        this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-1.25, 0.5));
                        break;
                }
                return Phaser.Math.Between(1, 2);
            case 5:
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(0.5, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                return Phaser.Math.Between(1, 2);
        }
    } else {
        //> Generate random structure an add it to their blocksGroup
        let random = Phaser.Math.Between(0, 5);

        switch (random) {
            case 0:
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                break;
            case 1:
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, 16, 16, 'immovableBlock').setScale(screenHeight / 345).setOrigin(6.5, 1));
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, 16, 32, 'immovableBlock').setScale(screenHeight / 345).setOrigin(4.5, 1));
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, 16, 46, 'immovableBlock').setScale(screenHeight / 345).setOrigin(2.5, 1));
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, 16, 64, 'immovableBlock').setScale(screenHeight / 345).setOrigin(0.5, 1));
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, 16, 46, 'immovableBlock').setScale(screenHeight / 345).setOrigin(-1.5, 1));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-3.5, 0.5));
                this.immovableBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - platformHeight, '16', '32', 'immovableBlock').setScale(screenHeight / 345).setOrigin(-5.5, 1));
                break;
            case 2:
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(4.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(3.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.135), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.37), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(2.5, 0.5));
                
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.37), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(1.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.37), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(0.5, 0.5));

                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-2.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.135), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-2.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.37), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-2.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-1.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 1.9), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.135), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));
                this.constructionBlocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight * 2.37), 16, 16, 'block2').setScale(screenHeight / 345).setOrigin(-0.5, 0.5));

                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(5.25, 1.7));
                
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 2.4), 'ground-coin').setScale(screenHeight / 345).setOrigin(3.75, 1.65));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 2.4), 'ground-coin').setScale(screenHeight / 345).setOrigin(2.2, 1.65));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 2.4), 'ground-coin').setScale(screenHeight / 345).setOrigin(0.5, 1.65));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 2.4), 'ground-coin').setScale(screenHeight / 345).setOrigin(-1.15, 1.65));

                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-2.7, 1.7));
                break;
            case 3:
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(3, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 2.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(2, 0.5));

                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(3, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(2, 0.5));

                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-1, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-2, 0.5));
                this.misteryBlocksGroup.add(this.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'mistery-block').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                break
            case 4:
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(2.9, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(1.3, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-0.3, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-1.9, 1.7));

                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(0, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1, 0.5));
                break;
            case 5:
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(6.1, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(4.5, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(2.9, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(1.3, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-0.3, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-1.9, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-3.5, 1.7));
                this.groundCoinsGroup.add(this.physics.add.sprite(pieceStart, screenHeight - (platformHeight * 1.9), 'ground-coin').setScale(screenHeight / 345).setOrigin(-5, 1.7));

                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(4, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(3, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(2, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(1, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(0, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-1, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-2, 0.5));
                this.blocksGroup.add(this.add.tileSprite(pieceStart, screenHeight - (platformHeight* 1.9), 16, 16, 'block').setScale(screenHeight / 345).setOrigin(-3, 0.5));
                break;
        }

        return 1;
    }
}