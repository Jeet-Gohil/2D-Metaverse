export const DefaultOfficeConfig = {
    // Canvas size
    width: 800,
    height: 600,
    
    // Background
    background: {
      type: 'gradient',
      colors: {
        top: 0xf8f9fa,
        bottom: 0xe9ecef
      },
      grid: {
        show: true,
        color: 0xdee2e6,
        alpha: 0.2,
        spacing: 40
      }
    },
    
    // Character settings
    character: {
      spritesheet: 'https://labs.phaser.io/assets/sprites/dude.png',
      frameWidth: 32,
      frameHeight: 48,
      scale: 1.2,
      speed: 160,
      bounce: 0.1,
      colors: [0x3b82f6, 0x10b981, 0xef4444, 0xf59e0b, 0x8b5cf6],
      nameTag: {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#1e293b',
        backgroundColor: '#ffffff',
        yOffset: -40
      }
    },
    
    // Desk settings
    desk: {
      image: 'https://images.unsplash.com/photo-1535572290543-960a8046f5af?w=150&h=100&fit=crop',
      scale: 0.7,
      shadow: {
        alpha: 0.2,
        offset: { x: 5, y: 5 }
      },
      label: {
        fontSize: '14px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: 0x4a5568,
        yOffset: -40
      }
    },
    
    // UI settings
    ui: {
      buttons: {
        character: {
          position: { x: 700, y: 50 },
          size: { width: 120, height: 40 },
          color: 0x3b82f6,
          text: 'Add Character'
        },
        desk: {
          position: { x: 700, y: 100 },
          size: { width: 120, height: 40 },
          color: 0x10b981,
          text: 'Add Desk'
        }
      },
      instructions: {
        position: { x: 120, y: 130 },
        size: { width: 240, height: 220 },
        backgroundColor: 0x1e293b,
        alpha: 0.9,
        title: {
          text: 'Controls:',
          fontSize: '18px',
          color: '#f8fafc'
        }
      }
    }
  };