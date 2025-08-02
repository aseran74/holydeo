import React from 'react';
import Lottie from 'lottie-react';

interface LottieIconProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
  size?: number;
}

const LottieIcon: React.FC<LottieIconProps> = ({ 
  animationData, 
  className = "", 
  loop = true, 
  autoplay = true,
  size = 60
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
        style={{ width: size, height: size }}
        className="hover:scale-110 transition-transform duration-300"
      />
    </div>
  );
};

export default LottieIcon; 