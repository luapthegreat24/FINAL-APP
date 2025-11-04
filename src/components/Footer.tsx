import React, { useState } from "react";
import {
  IonIcon,
  IonModal,
  IonButton,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import {
  logoFacebook,
  logoInstagram,
  logoTwitter,
  callOutline,
  mailOutline,
  locationOutline,
  timeOutline,
  closeOutline,
} from "ionicons/icons";
import "./Footer.css";

const Footer: React.FC = () => {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <footer className="main-footer">
      <div className="footer-decorations">
        <span className="deco-circle c1"></span>
        <span className="deco-circle c2"></span>
        <span className="deco-circle c3"></span>
        <span className="deco-star s1">✦</span>
        <span className="deco-star s2">✦</span>
        <span className="deco-star s3">✦</span>
      </div>

      <div className="footer-content">
        <div className="footer-section about-section">
          <div className="section-header">
            <h3>About Chip Happens</h3>
            <div className="header-underline"></div>
          </div>
          <p>
            Baking happiness since 2024! Fresh, delicious cookies made with
            love.
          </p>
        </div>

        <div className="footer-section links-section">
          <div className="section-header">
            <h3>Quick Links</h3>
            <div className="header-underline"></div>
          </div>
          <a href="/products">
            <span className="link-arrow">→</span> Menu
          </a>
          <a href="/our-story">
            <span className="link-arrow">→</span> About
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              setShowContactModal(true);
            }}
          >
            <span className="link-arrow">→</span> Contact
          </a>
        </div>

        <div className="footer-section follow-us-section">
          <div className="section-header">
            <h3 className="follow-title">Follow Us</h3>
            <div className="header-underline"></div>
          </div>
          <p className="follow-subtitle">
            Stay connected for the latest treats!
          </p>
          <div className="social-links">
            <a href="#facebook" className="social-icon" aria-label="Facebook">
              <IonIcon icon={logoFacebook} />
            </a>
            <a href="#instagram" className="social-icon" aria-label="Instagram">
              <IonIcon icon={logoInstagram} />
            </a>
            <a href="#twitter" className="social-icon" aria-label="Twitter">
              <IonIcon icon={logoTwitter} />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-divider"></div>
        <p>&copy; 2024 Cookie Haven. All rights reserved.</p>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div
          className="contact-modal-overlay"
          onClick={() => setShowContactModal(false)}
        >
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setShowContactModal(false)}
            >
              ×
            </button>

            <div className="contact-info-container">
              <h2>Get in Touch</h2>
              <p className="contact-subtitle">We'd love to hear from you!</p>

              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon">
                    <IonIcon icon={callOutline} />
                  </div>
                  <div className="contact-text">
                    <h3>Phone</h3>
                    <p>+63 123 456 7890</p>
                    <p>+63 987 654 3210</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <IonIcon icon={mailOutline} />
                  </div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>hello@chiphappens.com</p>
                    <p>support@chiphappens.com</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <IonIcon icon={locationOutline} />
                  </div>
                  <div className="contact-text">
                    <h3>Address</h3>
                    <p>123 Cookie Street</p>
                    <p>Bakery District, Manila, Philippines</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <IonIcon icon={timeOutline} />
                  </div>
                  <div className="contact-text">
                    <h3>Business Hours</h3>
                    <p>Monday - Saturday: 8:00 AM - 8:00 PM</p>
                    <p>Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="contact-modal-social">
                <h3>Follow Us</h3>
                <div className="social-links">
                  <a
                    href="#facebook"
                    className="social-icon"
                    aria-label="Facebook"
                  >
                    <IonIcon icon={logoFacebook} />
                  </a>
                  <a
                    href="#instagram"
                    className="social-icon"
                    aria-label="Instagram"
                  >
                    <IonIcon icon={logoInstagram} />
                  </a>
                  <a
                    href="#twitter"
                    className="social-icon"
                    aria-label="Twitter"
                  >
                    <IonIcon icon={logoTwitter} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
