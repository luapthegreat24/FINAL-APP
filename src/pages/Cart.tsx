import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonIcon } from "@ionic/react";
import {
  addOutline,
  removeOutline,
  trashOutline,
  arrowBackOutline,
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../data/products";
import "./Cart.css";

const Cart: React.FC = () => {
  const history = useHistory();
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);

  const goBack = () => {
    history.push("/");
  };

  const increaseQuantity = (
    productId: string,
    boxSize?: "small" | "regular" | "large"
  ) => {
    const item = cart.find(
      (item) => item.product.id === productId && item.boxSize === boxSize
    );
    if (item) {
      updateQuantity(productId, item.quantity + 1, boxSize);
    }
  };

  const decreaseQuantity = (
    productId: string,
    boxSize?: "small" | "regular" | "large"
  ) => {
    const item = cart.find(
      (item) => item.product.id === productId && item.boxSize === boxSize
    );
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1, boxSize);
    }
  };

  const removeItem = (
    productId: string,
    boxSize?: "small" | "regular" | "large"
  ) => {
    removeFromCart(productId, boxSize);
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "COOKIE20") {
      setDiscount(0.2);
      setPromoApplied(true);
      // Save discount info to localStorage for checkout
      localStorage.setItem(
        "appliedDiscount",
        JSON.stringify({
          code: promoCode.toUpperCase(),
          amount: 0.2,
        })
      );
    } else {
      alert("Invalid promo code!");
    }
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      history.push("/checkout");
    }
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setShowDetailsModal(true);
    setCurrentBoxIndex(0);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setCurrentBoxIndex(0);
    setTimeout(() => setSelectedItem(null), 300);
  };

  // Parse custom box cookies from description
  const parseCustomBoxCookies = (description: string) => {
    if (!description) return [];
    // Parse "2x Cookie Name, 3x Another Cookie" format
    const items = description.split(", ");
    const cookies: any[] = [];
    items.forEach((item) => {
      const match = item.match(/(\d+)x\s+(.+)/);
      if (match) {
        const count = parseInt(match[1]);
        const name = match[2];
        for (let i = 0; i < count; i++) {
          cookies.push({ name, id: name.toLowerCase().replace(/\s+/g, "-") });
        }
      }
    });
    return cookies;
  };

  // Split cookies into boxes of 6
  const getCustomBoxes = (cookies: any[]) => {
    const boxes = [];
    for (let i = 0; i < cookies.length; i += 6) {
      boxes.push(cookies.slice(i, i + 6));
    }
    return boxes;
  };

  const subtotal = getCartTotal();
  const discountAmount = subtotal * discount;
  const shipping = subtotal >= 500 ? 0 : 50; // Free shipping for orders ₱500+
  const tax = (subtotal - discountAmount) * 0.12; // 12% VAT
  const total = subtotal - discountAmount + shipping + tax;

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>

      <IonContent fullscreen>
        {/* Back Button Section */}
        <section className="back-nav-section">
          <div className="back-nav-wrap">
            <button onClick={goBack} className="back-btn-sketch">
              <IonIcon icon={arrowBackOutline} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </section>

        {/* Cart Title Section */}
        <section className="cart-title-section">
          <div className="cart-container">
            <div className="cart-page-header">
              <h1 className="cart-page-title">Your Cart</h1>
              <p className="cart-page-subtitle">
                {cart.length} {cart.length === 1 ? "item" : "items"} in your
                basket
              </p>
            </div>
          </div>
        </section>

        {/* Cart Content */}
        <section className="cart-content-section">
          <div className="cart-container">
            <div className="cart-layout">
              {/* Cart Items */}
              <div className="cart-items-area">
                {cart.length === 0 ? (
                  <div className="empty-cart">
                    <div className="empty-cart-icon-sketch">
                      <span>🛒</span>
                    </div>
                    <h2 className="empty-cart-title-sketch">
                      Your cart is empty
                    </h2>
                    <p className="empty-cart-text-sketch">
                      Add some delicious cookies to get started!
                    </p>
                    <button onClick={goBack} className="primary-sketch-btn">
                      Browse Cookies
                    </button>
                  </div>
                ) : (
                  cart.map((item, index) => (
                    <div
                      key={`${item.product.id}-${
                        item.boxSize || "regular"
                      }-${index}`}
                      className="cart-item-card"
                    >
                      <div
                        className="cart-item-image clickable-item"
                        onClick={() => handleItemClick(item)}
                        title="Click to view details"
                      >
                        <img
                          src={`/images/cookies/${getProductImage(
                            item.product.id
                          )}`}
                          alt={item.product.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                        <div className="view-details-overlay">
                          <span>View Details</span>
                        </div>
                      </div>
                      <div className="cart-item-right">
                        <div className="cart-item-top">
                          <div
                            className="cart-item-details clickable-details"
                            onClick={() => handleItemClick(item)}
                          >
                            <h3 className="cart-item-name">
                              {item.product.name}
                            </h3>
                            <p className="cart-item-size">
                              {item.boxSize
                                ? `Box Size: ${
                                    item.boxSize.charAt(0).toUpperCase() +
                                    item.boxSize.slice(1)
                                  } (${
                                    item.boxSize === "small"
                                      ? "6"
                                      : item.boxSize === "regular"
                                      ? "12"
                                      : "24"
                                  } cookies)`
                                : item.product.description}
                            </p>
                            <span className="cart-item-price">
                              ₱{(item.price || item.product.price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <div className="cart-item-bottom">
                          <div className="cart-quantity-controls">
                            <button
                              className="cart-qty-btn"
                              onClick={() =>
                                decreaseQuantity(item.product.id, item.boxSize)
                              }
                            >
                              <IonIcon icon={removeOutline} />
                            </button>
                            <span className="cart-qty-display">
                              {item.quantity}
                            </span>
                            <button
                              className="cart-qty-btn"
                              onClick={() =>
                                increaseQuantity(item.product.id, item.boxSize)
                              }
                            >
                              <IonIcon icon={addOutline} />
                            </button>
                          </div>
                          <div className="cart-item-total">
                            ₱
                            {(
                              (item.price || item.product.price) * item.quantity
                            ).toFixed(2)}
                          </div>
                          <button
                            className="remove-item-btn"
                            onClick={() =>
                              removeItem(item.product.id, item.boxSize)
                            }
                          >
                            <IonIcon icon={trashOutline} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Summary */}
              {cart.length > 0 && (
                <div className="cart-summary-area">
                  <div className="cart-summary-card">
                    <h2 className="summary-title">Order Summary</h2>

                    {/* Promo Code */}
                    <div className="promo-section">
                      <h3 className="promo-label">Have a promo code?</h3>
                      <div className="promo-input-group">
                        <input
                          type="text"
                          className="promo-input"
                          placeholder="Enter code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          disabled={promoApplied}
                        />
                        <button
                          className="apply-promo-btn"
                          onClick={applyPromoCode}
                          disabled={promoApplied}
                        >
                          {promoApplied ? "Applied!" : "Apply"}
                        </button>
                      </div>
                      {promoApplied && (
                        <p className="promo-success">
                          🎉 COOKIE20 applied! 20% off
                        </p>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="price-breakdown">
                      <div className="price-row">
                        <span>Subtotal:</span>
                        <span>₱{subtotal.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="price-row discount-row">
                          <span>Discount (20%):</span>
                          <span>-₱{discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="price-row">
                        <span>Shipping:</span>
                        <span>
                          {shipping === 0 ? (
                            <span className="free-shipping">FREE</span>
                          ) : (
                            `₱${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      {subtotal < 25 && shipping > 0 && (
                        <p className="shipping-note">
                          Add ₱{(25 - subtotal).toFixed(2)} more for free
                          shipping!
                        </p>
                      )}
                      <div className="summary-row">
                        <span>Tax (12%):</span>
                        <span>₱{tax.toFixed(2)}</span>
                      </div>
                      <div className="price-row total-row">
                        <span>Total:</span>
                        <span>₱{total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      className="checkout-btn-sketch"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Product Details Modal */}
        {showDetailsModal && selectedItem && (
          <div
            className="cart-details-modal-overlay"
            onClick={closeDetailsModal}
          >
            <div
              className="cart-details-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close-btn" onClick={closeDetailsModal}>
                ✕
              </button>

              <div className="modal-product-image">
                <img
                  src={`/images/cookies/${getProductImage(
                    selectedItem.product.id
                  )}`}
                  alt={selectedItem.product.name}
                />
              </div>

              <div className="modal-product-info">
                <h2 className="modal-product-name">
                  {selectedItem.product.name}
                </h2>

                <div className="modal-box-size-badge">
                  {selectedItem.boxSize
                    ? `${
                        selectedItem.boxSize.charAt(0).toUpperCase() +
                        selectedItem.boxSize.slice(1)
                      } Box`
                    : "Regular Box"}
                  <span className="box-cookie-count">
                    (
                    {selectedItem.boxSize === "small"
                      ? "6"
                      : selectedItem.boxSize === "large"
                      ? "24"
                      : "12"}{" "}
                    cookies)
                  </span>
                </div>

                {/* Custom Box Contents */}
                {selectedItem.product.category === "custom" &&
                selectedItem.product.description ? (
                  <>
                    <div className="modal-custom-box-section">
                      <h3>Box Contents</h3>
                      {(() => {
                        const allCookies = parseCustomBoxCookies(
                          selectedItem.product.description
                        );
                        const boxes = getCustomBoxes(allCookies);
                        const currentBox = boxes[currentBoxIndex] || [];

                        return (
                          <>
                            {/* Pagination Controls */}
                            {boxes.length > 1 && (
                              <div className="modal-box-pagination">
                                <button
                                  className="modal-pagination-btn"
                                  onClick={() =>
                                    setCurrentBoxIndex(
                                      Math.max(0, currentBoxIndex - 1)
                                    )
                                  }
                                  disabled={currentBoxIndex === 0}
                                >
                                  ‹ Previous
                                </button>
                                <div className="modal-pagination-dots">
                                  {boxes.map((_, index) => (
                                    <button
                                      key={index}
                                      className={`modal-pagination-dot ${
                                        index === currentBoxIndex
                                          ? "active"
                                          : ""
                                      }`}
                                      onClick={() => setCurrentBoxIndex(index)}
                                    >
                                      {index + 1}
                                    </button>
                                  ))}
                                </div>
                                <button
                                  className="modal-pagination-btn"
                                  onClick={() =>
                                    setCurrentBoxIndex(
                                      Math.min(
                                        boxes.length - 1,
                                        currentBoxIndex + 1
                                      )
                                    )
                                  }
                                  disabled={
                                    currentBoxIndex === boxes.length - 1
                                  }
                                >
                                  Next ›
                                </button>
                              </div>
                            )}

                            {/* Current Box Display */}
                            <div className="modal-cookie-box">
                              <div className="modal-box-header">
                                Box {currentBoxIndex + 1} of {boxes.length}
                              </div>
                              <div className="modal-box-grid">
                                {currentBox.map((cookie, idx) => (
                                  <div
                                    key={idx}
                                    className="modal-cookie-slot filled"
                                  >
                                    <img
                                      src={`/images/cookies/${getProductImage(
                                        cookie.id
                                      )}`}
                                      alt={cookie.name}
                                    />
                                    <span className="modal-cookie-name">
                                      {cookie.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  <div className="modal-description">
                    <h3>Description</h3>
                    <p>{selectedItem.product.description}</p>

                    {selectedItem.product.category && (
                      <p className="modal-category">
                        <strong>Category:</strong>{" "}
                        {selectedItem.product.category}
                      </p>
                    )}
                  </div>
                )}

                <div className="modal-price-details">
                  <div className="modal-price-row">
                    <span>Unit Price:</span>
                    <span className="modal-price">
                      ₱
                      {(
                        selectedItem.price || selectedItem.product.price
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="modal-price-row">
                    <span>Quantity:</span>
                    <span className="modal-quantity">
                      ×{selectedItem.quantity}
                    </span>
                  </div>
                  <div className="modal-price-row modal-total">
                    <span>Total:</span>
                    <span className="modal-total-price">
                      ₱
                      {(
                        (selectedItem.price || selectedItem.product.price) *
                        selectedItem.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="modal-actions">
                  <div className="modal-quantity-controls">
                    <button
                      className="modal-qty-btn"
                      onClick={() =>
                        decreaseQuantity(
                          selectedItem.product.id,
                          selectedItem.boxSize
                        )
                      }
                    >
                      <IonIcon icon={removeOutline} />
                    </button>
                    <span className="modal-qty-display">
                      {selectedItem.quantity}
                    </span>
                    <button
                      className="modal-qty-btn"
                      onClick={() =>
                        increaseQuantity(
                          selectedItem.product.id,
                          selectedItem.boxSize
                        )
                      }
                    >
                      <IonIcon icon={addOutline} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cart;
