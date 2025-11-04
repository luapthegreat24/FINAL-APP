import React from "react";
import "./SplashScreen.css";

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <span className="splash-brand">CHIP</span>
          <span className="splash-brand-accent">HAPPENS</span>
        </div>
        <div className="splash-tagline">Handcrafted Cookie Perfection</div>
        <div className="splash-loader">
          <div className="cookie-loader">
            <span className="cookie-crumb">🍪</span>
            <span className="cookie-crumb">🍪</span>
            <span className="cookie-crumb">🍪</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
