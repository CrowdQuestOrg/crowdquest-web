// src/shared/components/Layout/Footer.tsx
import React from 'react';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-card/50 backdrop-blur-md border-t border-primary mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-text-secondary text-sm">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent" /> for decentralized treasure hunting
          </p>
          <p className="mt-1">© 2024 CrowdQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;