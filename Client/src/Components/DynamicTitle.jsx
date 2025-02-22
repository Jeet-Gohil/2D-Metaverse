import React, { useEffect, useRef } from 'react';
import { Typography, Button, Card, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { Title } = Typography;



const DynamicTitle = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const handleOnClick = (route)=> {
    navigate(route);
  }
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 0.5;

      const gap = 40; // Grid cell size
      for (let x = 0; x < canvas.width; x += gap) {
        for (let y = 0; y < canvas.height; y += gap) {
          ctx.beginPath();
          ctx.rect(x, y, gap, gap);
          ctx.stroke();
          ctx.closePath();
        }
      }
    };

    const animateGrid = () => {
      drawGrid();
      animationFrameId = requestAnimationFrame(animateGrid);
    };

    resizeCanvas();
    animateGrid();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="homepage">
      <canvas ref={canvasRef} className="grid-canvas"></canvas>
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to the <span className="highlight">2D Metaverse</span>
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Button  className="get-started-btn" onClick={()=>navigate('/VirtualOffice')}>
          <h5 className='btn-text'>
          Get Started
          </h5>
        </Button>
        <Button className='get-started-btn' onClick={()=>navigate('/Sign-in')}>
          <h5 className='btn-text'>
          Sign-in
          </h5>
        </Button>
      </motion.div>
    </div>
  );
};

export default DynamicTitle;