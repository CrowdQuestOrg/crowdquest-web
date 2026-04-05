// src/shared/components/Common/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
      className={`game-card ${hover ? 'game-card-hover' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;