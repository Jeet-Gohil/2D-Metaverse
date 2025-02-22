import { DefaultOfficeConfig } from "./defualtOfficeConfig";

export class OfficeScene extends Phaser.Scene {
  constructor(config = {}) {
    super({ key: 'OfficeScene' });
    this.config = { ...DefaultOfficeConfig, ...config };
    this.deskPositions = [];
    this.characters = [];
    this.nextCharacterId = 0;
    this.nextDeskId = 0;
    this.isPlacingDesk = false;
    this.selectedDesk = null;
    this.isDraggingDesk = false;
  }

  preload() {
    const { character, desk } = this.config;
    
    this.load.spritesheet('character', 
      character.spritesheet,
      { frameWidth: character.frameWidth, frameHeight: character.frameHeight }
    );
    this.load.image('desk', desk.image);
  }

  createBackground() {
    const { background } = this.config;
    const bg = this.add.graphics();
    
    if (background.type === 'gradient') {
      bg.fillGradientStyle(
        background.colors.top,
        background.colors.top,
        background.colors.bottom,
        background.colors.bottom,
        1
      );
      bg.fillRect(0, 0, this.config.width, this.config.height);
    }
    
    if (background.grid.show) {
      const grid = this.add.graphics();
      grid.lineStyle(1, background.grid.color, background.grid.alpha);
      
      for (let x = 0; x <= this.config.width; x += background.grid.spacing) {
        grid.moveTo(x, 0);
        grid.lineTo(x, this.config.height);
      }
      for (let y = 0; y <= this.config.height; y += background.grid.spacing) {
        grid.moveTo(0, y);
        grid.lineTo(this.config.width, y);
      }
      grid.strokePath();
    }
  }

  createUIButtons() {
    const { ui } = this.config;
    const { character: charBtn, desk: deskBtn } = ui.buttons;
    
    // Add Character Button
    const addCharBtn = this.add.rectangle(
      charBtn.position.x,
      charBtn.position.y,
      charBtn.size.width,
      charBtn.size.height,
      charBtn.color
    )
      .setInteractive()
      .setDepth(4);
      
    this.add.text(
      charBtn.position.x - 45,
      charBtn.position.y - 8,
      charBtn.text,
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }
    ).setDepth(4);
    
    // Add Desk Button
    const addDeskBtn = this.add.rectangle(
      deskBtn.position.x,
      deskBtn.position.y,
      deskBtn.size.width,
      deskBtn.size.height,
      deskBtn.color
    )
      .setInteractive()
      .setDepth(4);
      
    this.add.text(
      deskBtn.position.x - 30,
      deskBtn.position.y - 8,
      deskBtn.text,
      {
        fontSize: '14px',
        fontFamily: 'Arial',
        fill: '#ffffff'
      }
    ).setDepth(4);

    addCharBtn.on('pointerdown', () => this.promptNewCharacter());
    addDeskBtn.on('pointerdown', () => {
      this.isPlacingDesk = true;
      if (this.deskPreview) {
        this.deskPreview.setVisible(true);
      }
    });
  }

  createInstructions() {
    const { instructions } = this.config.ui;
    
    const instructionsBg = this.add.rectangle(
      instructions.position.x,
      instructions.position.y,
      instructions.size.width,
      instructions.size.height,
      instructions.backgroundColor,
      instructions.alpha
    ).setDepth(4);
    
    this.add.text(16, 30, instructions.title.text, {
      fontSize: instructions.title.fontSize,
      fontFamily: 'Arial',
      fill: instructions.title.color,
      padding: { x: 10, y: 5 }
    }).setDepth(4);
    
    this.add.text(16, 60, 
      '• Click character number to select\n' +
      '• Click to move character\n' +
      '• Use arrow keys for movement\n' +
      '• Add Character button to add new\n' +
      '• Add Desk button to place desk\n' +
      '• Click & drag desks to move them\n' +
      '• Press R to rotate selected desk\n' +
      '• Names shown above characters', {
      fontSize: '13px',
      fontFamily: 'Arial',
      fill: '#f8fafc',
      padding: { x: 10, y: 5 }
    }).setDepth(4);
  }

  create() {
    this.createBackground();
    this.desks = this.physics.add.staticGroup();
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add R key for rotation
    this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.rKey.on('down', () => {
      if (this.selectedDesk) {
        const currentRotation = this.selectedDesk.rotation;
        this.selectedDesk.setRotation(currentRotation + Math.PI / 4);
        this.selectedDesk.shadow.setRotation(currentRotation + Math.PI / 4);
        this.selectedDesk.label.setRotation(0);
        this.selectedDesk.labelBg.setRotation(0);
        
        // Update collision box rotation
        this.selectedDesk.refreshBody();
      }
    });

    // Create animations
    this.createAnimations();
    
    // Create UI elements
    this.createUIButtons();
    this.createInstructions();
    
    // Setup input handlers
    this.setupInputHandlers();
  }

  createAnimations() {
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'character', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('character', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });
  }

  setupInputHandlers() {
    this.input.on('pointerdown', (pointer) => this.handlePointerDown(pointer));
    this.input.on('pointermove', (pointer) => this.handlePointerMove(pointer));
    this.input.on('pointerup', () => this.handlePointerUp());
  }

  handlePointerDown(pointer) {
    if (this.isPlacingDesk) {
      this.addNewDesk(pointer.x, pointer.y);
      this.isPlacingDesk = false;
      return;
    }

    const clickedDesk = this.findClickedDesk(pointer);
    if (clickedDesk) {
      this.selectDesk(clickedDesk);
      this.isDraggingDesk = true;
      return;
    }

    const clickedCharacter = this.characters.find(char => {
      const bounds = char.getBounds();
      return Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y);
    });

    if (clickedCharacter) {
      this.selectCharacter(clickedCharacter.id);
      this.deselectDesk();
    } else {
      const selectedCharacter = this.characters.find(char => char.isSelected);
      if (selectedCharacter) {
        this.moveCharacterToPosition(selectedCharacter, pointer.x, pointer.y);
      }
    }
  }

  handlePointerMove(pointer) {
    if (this.isPlacingDesk) {
      if (!this.deskPreview) {
        this.deskPreview = this.add.image(pointer.x, pointer.y, 'desk')
          .setScale(this.config.desk.scale)
          .setAlpha(0.5)
          .setDepth(5);
      } else {
        this.deskPreview.setPosition(pointer.x, pointer.y);
      }
    } else if (this.isDraggingDesk && this.selectedDesk) {
      this.moveDesk(this.selectedDesk, pointer.x, pointer.y);
    }
  }

  handlePointerUp() {
    if (this.isDraggingDesk && this.selectedDesk) {
      // Refresh the physics body after dragging
      this.selectedDesk.refreshBody();
    }
    this.isDraggingDesk = false;
  }

  findClickedDesk(pointer) {
    for (const desk of this.desks.getChildren()) {
      const bounds = desk.getBounds();
      if (Phaser.Geom.Rectangle.Contains(bounds, pointer.x, pointer.y)) {
        return desk;
      }
    }
    return null;
  }

  selectDesk(desk) {
    this.deselectDesk();
    this.selectedDesk = desk;
    desk.setTint(0x3b82f6);
    desk.shadow.setAlpha(0.3);
  }

  deselectDesk() {
    if (this.selectedDesk) {
      this.selectedDesk.clearTint();
      this.selectedDesk.shadow.setAlpha(this.config.desk.shadow.alpha);
      this.selectedDesk = null;
    }
  }

  moveDesk(desk, x, y) {
    const { shadow } = this.config.desk;
    desk.setPosition(x, y);
    desk.shadow.setPosition(x + shadow.offset.x, y + shadow.offset.y);
    desk.label.setPosition(x - 30, y - 48);
    desk.labelBg.setPosition(x, y - 40);
    
    // Update collision box position
    desk.refreshBody();
  }

  promptNewCharacter() {
    const name = prompt('Enter character name:');
    if (name) {
      this.addNewCharacter(name);
    }
  }

  addNewCharacter(name) {
    const { character: charConfig } = this.config;
    const color = charConfig.colors[this.nextCharacterId % charConfig.colors.length];
    
    const x = Math.random() * (this.config.width - 200) + 100;
    const y = Math.random() * (this.config.height - 200) + 100;
    
    const character = this.physics.add.sprite(x, y, 'character');
    character.setBounce(charConfig.bounce);
    character.setCollideWorldBounds(true);
    character.setScale(charConfig.scale);
    character.setTint(color);
    character.id = this.nextCharacterId++;
    character.name = name;
    character.isSelected = false;
    character.setDepth(3);
    
    // Set up character physics body
    character.body.setSize(20, 32); // Adjust collision box size
    character.body.setOffset(6, 16); // Fine-tune collision box position
    
    // Add name label
    const nameText = this.add.text(x, y + charConfig.nameTag.yOffset, name, {
      fontSize: charConfig.nameTag.fontSize,
      fontFamily: charConfig.nameTag.fontFamily,
      fill: charConfig.nameTag.color,
      backgroundColor: charConfig.nameTag.backgroundColor,
      padding: { x: 4, y: 2 }
    }).setDepth(4);
    character.nameText = nameText;
    
    // Add selection indicator
    const indicator = this.add.circle(x, y - 30, 6, 0x1e293b);
    const innerIndicator = this.add.circle(x, y - 30, 4, 0xf8fafc);
    indicator.setVisible(false);
    innerIndicator.setVisible(false);
    indicator.setDepth(4);
    innerIndicator.setDepth(4);
    character.indicator = indicator;
    character.innerIndicator = innerIndicator;
    
    // Add collision with desks
    this.physics.add.collider(character, this.desks, null, null, this);
    this.characters.push(character);
    
    const keyNum = this.nextCharacterId.toString();
    this.input.keyboard.on(`keydown-${keyNum}`, () => this.selectCharacter(character.id));
  }

  addNewDesk(x, y) {
    const { desk: deskConfig } = this.config;
    
    const desk = this.desks.create(x, y, 'desk')
      .setScale(deskConfig.scale)
      .setInteractive()
      .refreshBody();
    
    // Set up desk physics body
    const deskWidth = 120; // Approximate width of the desk image
    const deskHeight = 60; // Approximate height of the desk image
    desk.body.setSize(deskWidth, deskHeight);
    desk.body.setOffset(-deskWidth/2, -deskHeight/2);
    
    const shadow = this.add.image(
      x + deskConfig.shadow.offset.x,
      y + deskConfig.shadow.offset.y,
      'desk'
    )
      .setScale(deskConfig.scale)
      .setTint(0x000000)
      .setAlpha(deskConfig.shadow.alpha)
      .setDepth(0);
    
    desk.setDepth(1);
    desk.shadow = shadow;
    
    this.deskPositions.push({ x, y });
    
    const deskNum = ++this.nextDeskId;
    const labelBg = this.add.rectangle(
      x,
      y + deskConfig.label.yOffset,
      80,
      26,
      deskConfig.label.backgroundColor,
      0.9
    ).setDepth(2);
    
    const label = this.add.text(
      x - 30,
      y + deskConfig.label.yOffset - 8,
      `Desk ${deskNum}`,
      {
        fontSize: deskConfig.label.fontSize,
        fontFamily: deskConfig.label.fontFamily,
        fill: deskConfig.label.color,
        padding: { x: 4, y: 2 }
      }
    ).setDepth(2);

    desk.label = label;
    desk.labelBg = labelBg;

    if (this.deskPreview) {
      this.deskPreview.setVisible(false);
    }
  }

  selectCharacter(id) {
    this.characters.forEach(char => {
      char.isSelected = char.id === id;
      char.indicator.setVisible(char.isSelected);
      char.innerIndicator.setVisible(char.isSelected);
    });
  }

  moveCharacterToPosition(character, x, y) {
    const angle = Phaser.Math.Angle.Between(character.x, character.y, x, y);
    const speed = this.config.character.speed;
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    
    character.setVelocity(velocityX, velocityY);
    
    if (velocityX < 0) {
      character.anims.play('left', true);
    } else if (velocityX > 0) {
      character.anims.play('right', true);
    }
  }

  update() {
    const { speed } = this.config.character;

    this.characters.forEach(character => {
      character.nameText.setPosition(
        character.x - character.nameText.width / 2,
        character.y + this.config.character.nameTag.yOffset
      );

      if (character.isSelected) {
        character.indicator.setPosition(character.x, character.y - 30);
        character.innerIndicator.setPosition(character.x, character.y - 30);

        if (this.cursors.left.isDown) {
          character.setVelocityX(-speed);
          character.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
          character.setVelocityX(speed);
          character.anims.play('right', true);
        } else {
          character.setVelocityX(0);
        }

        if (this.cursors.up.isDown) {
          character.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
          character.setVelocityY(speed);
        } else {
          character.setVelocityY(0);
        }

        if (character.body.velocity.x === 0 && character.body.velocity.y === 0) {
          character.anims.play('turn');
        }

        if (character.body.velocity.x !== 0 && character.body.velocity.y !== 0) {
          character.body.velocity.normalize().scale(speed);
        }
      } else {
        if (character.body.velocity.x === 0 && character.body.velocity.y === 0) {
          character.anims.play('turn');
        }
      }
    });
  }
}