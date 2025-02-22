import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { gameConfig } from './GameConfig';
import WebRTC from './WebRTC';

export const GameComponent = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isNearby, setIsNearby] = useState(false);

  // Capture local media stream
  useEffect(() => {
    const getMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };
    getMedia();
  }, []);

  // Check if characters are nearby (dummy logic)
  useEffect(() => {
    const checkDistance = () => {
      // Replace with your logic to check if characters are near each other
      setIsNearby(true); // For demonstration, always show call options
    };
    checkDistance();
  }, []);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = new Phaser.Game(gameConfig);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return ( 
    <div>
      <div id="game-container" className="w-full h-full rounded-lg overflow-hidden" />
      <h1>2D Metaverse</h1>
      {isNearby && (
        <WebRTC
          localStream={localStream}
          remoteStream={remoteStream}
          onCallStart={() => console.log('Call started')}
          onCallEnd={() => console.log('Call ended')}
        />
      )}
      </div>      
      );
};