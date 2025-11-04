import React, { useState } from "react";
import { IonContent, IonHeader, IonPage, IonIcon } from "@ionic/react";
import {
  heartOutline,
  heart,
  filterOutline,
  gridOutline,
  reorderTwoOutline,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  categories,
  getProductsByCategory,
  getProductImage,
} from "../data/products";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Products.css";

const Products: React.FC = () => {
  const history = useHistory();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"one-column" | "two-column">(
    "two-column"
  );
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [boxSize, setBoxSize] = useState<6 | 12 | 24>(6);
  const [selectedCookies, setSelectedCookies] = useState<
    { productId: string; name: string; quantity: number }[]
  >([]);
  const [boxes, setBoxes] = useState<
    Array<Array<{ productId: string; name: string; image: string }>>
  >([]);
  const [draggedCookie, setDraggedCookie] = useState<{
    productId: string;
    name: string;
    image: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [lastAddedCookie, setLastAddedCookie] = useState<string | null>(null);

  const navigateToProduct = (productId: string) => {
    history.push(`/product/${productId}`);
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    const product = filteredProducts.find((p) => p.id === productId);
    if (product) {
      // Use regular box price and size by default
      const regularPrice = product.boxPrices?.regular || product.price;
      addToCart(product, 1, "regular", regularPrice);
    }
  };

  // Filter products by category
  const filteredProducts = getProductsByCategory(selectedCategory);

  // Customize box functions
  const openCustomizeModal = () => {
    setShowCustomizeModal(true);
    setSelectedCookies([]);
    setBoxSize(6);
    setBoxes([[]]);
    setCurrentBoxIndex(0);
  };

  const closeCustomizeModal = () => {
    setShowCustomizeModal(false);
    setSelectedCookies([]);
    setBoxes([]);
    setDraggedCookie(null);
    setIsDragging(false);
    setCurrentBoxIndex(0);
    setLastAddedCookie(null);
  };

  const getTotalSelected = () => {
    return boxes.reduce((sum, box) => sum + box.length, 0);
  };

  const getNumBoxes = () => {
    return Math.ceil(boxSize / 6);
  };

  // Drag and Drop handlers
  const handleDragStart = (product: any) => {
    setDraggedCookie({
      productId: product.id,
      name: product.name,
      image: getProductImage(product.id),
    });
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setDraggedCookie(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, boxIndex: number) => {
    e.preventDefault();
    if (!draggedCookie || boxIndex !== currentBoxIndex) return;

    const currentBox = boxes[boxIndex];
    if (currentBox.length < 6) {
      const newBoxes = [...boxes];
      newBoxes[boxIndex] = [...currentBox, draggedCookie];
      setBoxes(newBoxes);

      // If current box is full, move to next box
      if (newBoxes[boxIndex].length === 6) {
        if (currentBoxIndex < getNumBoxes() - 1) {
          setCurrentBoxIndex(currentBoxIndex + 1);
          // Add next box if it doesn't exist
          if (!newBoxes[currentBoxIndex + 1]) {
            newBoxes.push([]);
            setBoxes(newBoxes);
          }
        }
      }
    }
    setDraggedCookie(null);
    setIsDragging(false);
  };

  // One-click add cookie to current box
  const handleCookieClick = (product: any) => {
    const currentBox = boxes[currentBoxIndex];

    // Check if current box is full
    if (currentBox.length >= 6) {
      // Try to move to next box if available
      if (currentBoxIndex < getNumBoxes() - 1) {
        setCurrentBoxIndex(currentBoxIndex + 1);
        // Add the cookie to the next box
        const cookie = {
          productId: product.id,
          name: product.name,
          image: getProductImage(product.id),
        };
        const newBoxes = [...boxes];
        if (!newBoxes[currentBoxIndex + 1]) {
          newBoxes.push([cookie]);
        } else {
          newBoxes[currentBoxIndex + 1] = [
            ...newBoxes[currentBoxIndex + 1],
            cookie,
          ];
        }
        setBoxes(newBoxes);

        // Visual feedback
        setLastAddedCookie(product.id);
        setTimeout(() => setLastAddedCookie(null), 500);

        // Haptic feedback
        if ("vibrate" in navigator) {
          navigator.vibrate(50);
        }
      }
      return;
    }

    // Add cookie to current box
    const cookie = {
      productId: product.id,
      name: product.name,
      image: getProductImage(product.id),
    };

    const newBoxes = [...boxes];
    newBoxes[currentBoxIndex] = [...currentBox, cookie];
    setBoxes(newBoxes);

    // Visual feedback
    setLastAddedCookie(product.id);
    setTimeout(() => setLastAddedCookie(null), 500);

    // Haptic feedback for mobile devices
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }

    // If current box is now full, automatically move to next box
    if (newBoxes[currentBoxIndex].length === 6) {
      if (currentBoxIndex < getNumBoxes() - 1) {
        setTimeout(() => {
          setCurrentBoxIndex(currentBoxIndex + 1);
          // Add next box if it doesn't exist
          if (!newBoxes[currentBoxIndex + 1]) {
            newBoxes.push([]);
            setBoxes(newBoxes);
          }
        }, 400); // Small delay for visual feedback
      }
    }
  };
  const removeCookieFromBox = (boxIndex: number, cookieIndex: number) => {
    const newBoxes = [...boxes];
    newBoxes[boxIndex].splice(cookieIndex, 1);
    setBoxes(newBoxes);

    // If we removed from a full box that wasn't the current one, potentially adjust current index
    if (boxIndex < currentBoxIndex && newBoxes[boxIndex].length < 6) {
      // Stay on current box
    }
  };

  const addCustomBoxToCart = () => {
    const totalCookies = getTotalSelected();
    if (totalCookies !== boxSize) {
      alert(
        `Please add exactly ${boxSize} cookies to your custom box. Currently: ${totalCookies}`
      );
      return;
    }

    // Count cookies by type
    const cookieCounts: { [key: string]: { name: string; count: number } } = {};
    boxes.forEach((box) => {
      box.forEach((cookie) => {
        if (cookieCounts[cookie.productId]) {
          cookieCounts[cookie.productId].count++;
        } else {
          cookieCounts[cookie.productId] = { name: cookie.name, count: 1 };
        }
      });
    });

    // Determine price and box size type based on selected box size
    let boxPrice = 0;
    let boxSizeType: "small" | "regular" | "large" = "regular";

    if (boxSize === 6) {
      boxPrice = 225; // Small box price
      boxSizeType = "small";
    } else if (boxSize === 12) {
      boxPrice = 420; // Regular box price
      boxSizeType = "regular";
    } else if (boxSize === 24) {
      boxPrice = 800; // Large box price
      boxSizeType = "large";
    }

    // Create a custom box product
    const customBox = {
      id: `custom-box-${Date.now()}`,
      name: `Custom Cookie Box (${boxSize} cookies)`,
      price: boxPrice,
      category: "custom",
      image: "custom-box",
      description: Object.values(cookieCounts)
        .map((c) => `${c.count}x ${c.name}`)
        .join(", "),
    };

    addToCart(customBox, 1, boxSizeType, boxPrice);
    closeCustomizeModal();
  };

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>
      <IonContent fullscreen>
        {/* Main Content */}
        <div className="products-main-content">
          {/* Page Header */}
          <div className="products-page-header">
            <h1 className="products-page-title">Our Cookie Collection</h1>
            <p className="products-page-subtitle">
              Handcrafted with love, baked fresh daily!
            </p>
            <button className="customize-box-btn" onClick={openCustomizeModal}>
              🍪 Customize Your Cookie Box
            </button>
          </div>

          {/* Filter and View Controls */}
          <div className="products-controls">
            <div className="filter-dropdown-container">
              <IonIcon icon={filterOutline} className="filter-icon" />
              <select
                className="category-dropdown"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="view-toggle-container">
              <span className="view-label">View:</span>
              <button
                className={`view-btn ${
                  viewMode === "one-column" ? "active" : ""
                }`}
                onClick={() => setViewMode("one-column")}
                title="One Column"
              >
                <IonIcon icon={reorderTwoOutline} />
              </button>
              <button
                className={`view-btn ${
                  viewMode === "two-column" ? "active" : ""
                }`}
                onClick={() => setViewMode("two-column")}
                title="Two Columns"
              >
                <IonIcon icon={gridOutline} />
              </button>
            </div>
          </div>

          {/* Products Count */}
          <div className="products-count">
            Showing {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "cookie" : "cookies"}
          </div>

          {/* Products Grid */}
          <div className={`cookie-cards-grid ${viewMode}`}>
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="cookie-card"
                onClick={() => navigateToProduct(product.id)}
              >
                <button
                  className="wishlist-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                >
                  <IonIcon
                    icon={isInWishlist(product.id) ? heart : heartOutline}
                  />
                </button>
                <div className="card-corner tl"></div>
                <div className="card-corner tr"></div>
                <div className="card-corner bl"></div>
                <div className="card-corner br"></div>
                <div className="card-sketch-border"></div>
                {[
                  "chocolate-chip",
                  "butter-cookie",
                  "double-chocolate",
                  "peanut-butter",
                  "red-velvet",
                ].includes(product.id) && (
                  <div className="product-badge-sketch">
                    <span>Best Seller</span>
                  </div>
                )}
                <div className="cookie-illustration">
                  <img
                    src={`/images/cookies/${getProductImage(product.id)}`}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="card-content">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="card-footer">
                    <span className="price">
                      ₱
                      {(product.boxPrices?.regular || product.price).toFixed(2)}
                    </span>
                    <button
                      className="add-btn"
                      onClick={(e) => handleAddToCart(e, product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="card-doodles">
                  <span className="doodle d1"></span>
                  <span className="doodle d2"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customize Box Modal */}
        {showCustomizeModal && (
          <div className="customize-modal-overlay">
            <div className="customize-modal">
              <h2>Customize Your Cookie Box</h2>
              <p className="customize-subtitle">
                Build your perfect cookie box!
              </p>

              {/* Box Size Selection */}
              <div className="box-size-selector">
                <label>Choose Box Size:</label>
                <div className="size-options">
                  <button
                    className={`size-btn ${boxSize === 6 ? "active" : ""}`}
                    onClick={() => {
                      setBoxSize(6);
                      setBoxes([[]]);
                      setCurrentBoxIndex(0);
                    }}
                  >
                    6 Cookies (1 Box)
                    <span className="size-price">₱210</span>
                  </button>
                  <button
                    className={`size-btn ${boxSize === 12 ? "active" : ""}`}
                    onClick={() => {
                      setBoxSize(12);
                      setBoxes([[]]);
                      setCurrentBoxIndex(0);
                    }}
                  >
                    12 Cookies (2 Boxes)
                    <span className="size-price">₱420</span>
                  </button>
                  <button
                    className={`size-btn ${boxSize === 24 ? "active" : ""}`}
                    onClick={() => {
                      setBoxSize(24);
                      setBoxes([[]]);
                      setCurrentBoxIndex(0);
                    }}
                  >
                    24 Cookies (4 Boxes)
                    <span className="size-price">₱840</span>
                  </button>
                </div>
              </div>

              {/* Cookie Selection Progress */}
              <div className="selection-progress">
                <span className="progress-text">
                  Selected: {getTotalSelected()} / {boxSize}
                </span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${(getTotalSelected() / boxSize) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="drag-instructions">
                <p className="desktop-instruction">
                  🍪 Click any cookie to instantly add it to your box! Drag &
                  drop also works.
                </p>
                <p className="mobile-instruction">
                  🍪 Tap any cookie to instantly add it to your box!
                </p>
              </div>

              {/* Pagination Controls */}
              {getNumBoxes() > 1 && (
                <div className="box-pagination">
                  <button
                    className="pagination-btn prev"
                    onClick={() =>
                      setCurrentBoxIndex(Math.max(0, currentBoxIndex - 1))
                    }
                    disabled={currentBoxIndex === 0}
                  >
                    ← Previous
                  </button>
                  <div className="pagination-dots">
                    {Array.from({ length: getNumBoxes() }).map((_, idx) => (
                      <button
                        key={idx}
                        className={`pagination-dot ${
                          idx === currentBoxIndex ? "active" : ""
                        } ${boxes[idx]?.length === 6 ? "completed" : ""}`}
                        onClick={() => setCurrentBoxIndex(idx)}
                        title={`Box ${idx + 1}`}
                      >
                        {boxes[idx]?.length === 6 ? "✓" : idx + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    className="pagination-btn next"
                    onClick={() =>
                      setCurrentBoxIndex(
                        Math.min(getNumBoxes() - 1, currentBoxIndex + 1)
                      )
                    }
                    disabled={currentBoxIndex === getNumBoxes() - 1}
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Drop Boxes - Show only current box */}
              <div className="drop-boxes-container">
                {boxes[currentBoxIndex] !== undefined && (
                  <div
                    key={currentBoxIndex}
                    className={`drop-box ${
                      boxes[currentBoxIndex].length === 6 ? "full" : ""
                    } ${isDragging ? "drag-target" : ""} single-box`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, currentBoxIndex)}
                  >
                    <div className="box-header">
                      Box {currentBoxIndex + 1} of {getNumBoxes()} (
                      {boxes[currentBoxIndex].length}/6)
                      {boxes[currentBoxIndex].length === 6 && (
                        <span className="check-icon"> ✓</span>
                      )}
                    </div>
                    <div className="box-slots">
                      {Array.from({ length: 6 }).map((_, slotIndex) => (
                        <div key={slotIndex} className="cookie-slot">
                          {boxes[currentBoxIndex][slotIndex] ? (
                            <div className="dropped-cookie animate-in">
                              <img
                                src={`/images/cookies/${boxes[currentBoxIndex][slotIndex].image}`}
                                alt={boxes[currentBoxIndex][slotIndex].name}
                              />
                              <button
                                className="remove-cookie-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCookieFromBox(
                                    currentBoxIndex,
                                    slotIndex
                                  );
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <div className="empty-slot">+</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cookie Selection Grid */}
              <div className="cookie-selection-label">
                <p>Select cookies to add to your boxes:</p>
              </div>
              <div className="customize-cookie-grid">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`customize-cookie-item clickable ${
                      lastAddedCookie === product.id ? "just-added" : ""
                    }`}
                    draggable
                    onDragStart={() => handleDragStart(product)}
                    onDragEnd={handleDragEnd}
                    onClick={() => handleCookieClick(product)}
                  >
                    <img
                      src={`/images/cookies/${getProductImage(product.id)}`}
                      alt={product.name}
                    />
                    <span className="cookie-name">{product.name}</span>
                    {lastAddedCookie === product.id && (
                      <div className="added-indicator">+1</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Modal Actions */}
              <div className="customize-modal-actions">
                <button
                  className="customize-add-btn"
                  onClick={addCustomBoxToCart}
                  disabled={getTotalSelected() !== boxSize}
                >
                  Add to Cart (₱
                  {boxSize === 6 ? 225 : boxSize === 12 ? 420 : 800})
                </button>
                <button
                  className="customize-cancel-btn"
                  onClick={closeCustomizeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Products;
