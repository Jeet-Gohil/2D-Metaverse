import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal } from 'antd';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the signaling server

const WebRTC = ({ localStream, remoteStream, onCallStart, onCallEnd }) => {
  const [isCallModalVisible, setIsCallModalVisible] = useState(false);
  const [callType, setCallType] = useState(null); // 'audio' or 'video'
  const peerConnection = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Initialize WebRTC
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Create peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }], // Google's public STUN server
    });

    // Add local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Handle remote stream
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('signal', { target: remoteUserId, signal: { candidate: event.candidate } });
      }
    };

    return pc;
  };

  // Start a call
  const startCall = async (type) => {
    setCallType(type);
    setIsCallModalVisible(true);

    peerConnection.current = createPeerConnection();

    // Create an offer
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    // Send the offer to the remote user
    socket.emit('signal', { target: remoteUserId, signal: { offer } });
  };

  // Handle incoming signals
  useEffect(() => {
    socket.on('signal', async (data) => {
      const { sender, signal } = data;

      if (signal.offer) {
        // Handle incoming offer
        peerConnection.current = createPeerConnection();
        await peerConnection.current.setRemoteDescription(signal.offer);

        // Create an answer
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);

        // Send the answer to the remote user
        socket.emit('signal', { target: sender, signal: { answer } });
      } else if (signal.answer) {
        // Handle incoming answer
        await peerConnection.current.setRemoteDescription(signal.answer);
      } else if (signal.candidate) {
        // Handle incoming ICE candidate
        await peerConnection.current.addIceCandidate(signal.candidate);
      }
    });
  }, []);

  // End the call
  const endCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsCallModalVisible(false);
    onCallEnd();
  };

  return (
    <>
      {/* Call options modal */}
      <Modal
        title="Start a Call"
        visible={isCallModalVisible}
        onCancel={endCall}
        footer={[
          <Button key="audio" onClick={() => startCall('audio')}>
            Audio Call
          </Button>,
          <Button key="video" onClick={() => startCall('video')}>
            Video Call
          </Button>,
        ]}
      >
        <div>
          <video ref={localVideoRef} autoPlay muted />
          <video ref={remoteVideoRef} autoPlay />
        </div>
      </Modal>

      {/* Button to show call options */}
      <Button type="primary" onClick={() => setIsCallModalVisible(true)}>
        Start Call
      </Button>
    </>
  );
};

export default WebRTC;