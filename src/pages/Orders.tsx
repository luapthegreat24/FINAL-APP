import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonIcon } from "@ionic/react";
import {
  receiptOutline,
  arrowForwardOutline,
  printOutline,
  eyeOutline,
} from "ionicons/icons";
import Navbar from "../components/Navbar";
import { getProductImage } from "../data/products";
import { useAuth } from "../context/AuthContext";
import "./Orders.css";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  boxSize?: string;
}

interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus?: string;
  shippingInfo: any;
  paymentMethod: string;
  discountAmount?: number;
  cancellationReason?: string;
}

const Orders: React.FC = () => {
  const history = useHistory();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      try {
        const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");

        if (user) {
          // Filter orders for the current user
          const userOrders = allOrders.filter(
            (order: Order) => order.userId === user.id
          );
          setOrders(userOrders);
          setFilteredOrders(userOrders);
        } else {
          // For guest users, show all orders (or you can show only guest orders)
          const guestOrders = allOrders.filter(
            (order: Order) => order.userId === "guest"
          );
          setOrders(guestOrders);
          setFilteredOrders(guestOrders);
        }
      } catch (error) {
        console.error("Error loading orders:", error);
        setOrders([]);
        setFilteredOrders([]);
      }
    };

    loadOrders();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const viewOrderDetails = (order: Order) => {
    // Save order to localStorage and navigate
    localStorage.setItem("lastOrder", JSON.stringify(order));
    history.push("/order-confirmation");
  };

  const viewInvoice = (order: Order) => {
    // Save order and navigate to order confirmation, then trigger print
    localStorage.setItem("lastOrder", JSON.stringify(order));
    history.push("/order-confirmation");
    // Trigger print after a short delay to ensure page loads
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const goToShop = () => {
    history.push("/products");
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelReason("");
    setSelectedReasons([]);
  };

  const confirmCancel = () => {
    if (!selectedOrderId) return;

    try {
      // Combine selected reasons and custom reason
      const allReasons = [...selectedReasons];
      if (cancelReason.trim()) {
        allReasons.push(cancelReason.trim());
      }
      const finalReason = allReasons.join(", ");

      const allOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      const updatedAll = allOrders.map((o: Order) => {
        if (o.id === selectedOrderId) {
          return {
            ...o,
            status: "cancelled",
            cancellationReason: finalReason || "",
          };
        }
        return o;
      });
      // Save back to localStorage
      localStorage.setItem("orders", JSON.stringify(updatedAll));

      // Update component state for current user view
      const updatedOrders = orders.map((o) =>
        o.id === selectedOrderId
          ? {
              ...o,
              status: "cancelled",
              cancellationReason: finalReason || "",
            }
          : o
      );
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);

      closeCancelModal();
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const handleReasonCheckbox = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const cancellationOptions = [
    "Changed my mind",
    "Found a better price",
    "Ordered by mistake",
    "Delivery takes too long",
    "Want to modify order",
  ];

  return (
    <IonPage>
      <IonHeader>
        <Navbar />
      </IonHeader>

      <IonContent fullscreen>
        {/* Orders Title Section */}
        <section className="orders-title-section">
          <div className="orders-container">
            <div className="orders-header">
              <div className="header-left">
                <IonIcon icon={receiptOutline} className="orders-icon" />
                <div>
                  <h1 className="orders-title-sketch">
                    <span className="underline-sketch">My Orders</span>
                  </h1>
                  <p className="orders-subtitle">
                    {orders.length} {orders.length === 1 ? "order" : "orders"}{" "}
                    total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Orders Content */}
        <section className="orders-content-section">
          <div className="orders-container">
            {filteredOrders.length === 0 ? (
              <div className="empty-orders-card">
                <div className="empty-orders-icon">📦</div>
                <h2>No Orders Yet</h2>
                <p>
                  Start shopping for delicious cookies and your orders will
                  appear here!
                </p>
                <button onClick={goToShop} className="shop-now-btn-sketch">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-header-left">
                        <h3 className="order-id">Order #{order.id}</h3>
                        <p className="order-date">{formatDate(order.date)}</p>
                      </div>
                      <div className="order-header-right">
                        <span
                          className={`status-badge ${
                            order.status === "delivered"
                              ? "status-delivered"
                              : order.status === "pending"
                              ? "status-pending"
                              : "status-processing"
                          }`}
                        >
                          {order.status}
                        </span>
                        {order.paymentStatus && (
                          <span className="payment-badge status-paid">
                            {order.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-items-preview">
                        {order.items.slice(0, 3).map((item, index) => (
                          <div key={index} className="order-preview-item">
                            <div className="preview-item-image">
                              <img
                                src={`/images/cookies/${getProductImage(
                                  item.productId
                                )}`}
                                alt={item.name}
                              />
                            </div>
                            <div className="preview-item-info">
                              <h4>{item.name}</h4>
                              <p>Qty: {item.quantity}</p>
                              {item.boxSize && (
                                <p className="item-box-size">
                                  {item.boxSize.charAt(0).toUpperCase() +
                                    item.boxSize.slice(1)}{" "}
                                  Box
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="more-items">
                            +{order.items.length - 3} more{" "}
                            {order.items.length - 3 === 1 ? "item" : "items"}
                          </div>
                        )}
                      </div>

                      <div className="order-summary-info">
                        <div className="summary-row">
                          <span>Payment:</span>
                          <span className="payment-method">
                            {order.paymentMethod}
                          </span>
                        </div>
                        <div className="summary-row">
                          <span>Items:</span>
                          <span>
                            {order.items.reduce(
                              (sum, item) => sum + item.quantity,
                              0
                            )}{" "}
                            items
                          </span>
                        </div>
                        {order.discountAmount && order.discountAmount > 0 && (
                          <div className="summary-row discount-row">
                            <span>Discount:</span>
                            <span className="discount-text">
                              -₱{order.discountAmount.toFixed(2)}
                            </span>
                          </div>
                        )}
                        <div className="summary-row total-row">
                          <span>Total:</span>
                          <span className="order-total">
                            ₱{order.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <button
                        className="view-invoice-btn"
                        onClick={() => viewInvoice(order)}
                        title="Print Invoice"
                      >
                        <IonIcon icon={printOutline} />
                        Invoice
                      </button>
                      <button
                        className="view-details-btn"
                        onClick={() => viewOrderDetails(order)}
                      >
                        <IonIcon icon={eyeOutline} />
                        View Details
                      </button>
                      {/* Cancel Order Button - shown only if not already cancelled */}
                      {order.status !== "cancelled" && (
                        <button
                          className="cancel-order-btn"
                          onClick={() => {
                            setSelectedOrderId(order.id);
                            setCancelReason("");
                            setSelectedReasons([]);
                            setShowCancelModal(true);
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="cancel-modal-overlay">
            <div className="cancel-modal">
              <h3>Cancel Order</h3>
              <p>Please select reason(s) for cancelling this order:</p>

              <div className="cancellation-options">
                {cancellationOptions.map((option) => (
                  <label key={option} className="cancel-checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedReasons.includes(option)}
                      onChange={() => handleReasonCheckbox(option)}
                      className="cancel-checkbox"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>

              <p className="other-reason-label">Other reason (optional):</p>
              <textarea
                className="cancel-reason-input"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Type your reason here..."
                rows={3}
              />
              <div className="cancel-modal-actions">
                <button className="cancel-confirm-btn" onClick={confirmCancel}>
                  Confirm Cancel
                </button>
                <button className="cancel-close-btn" onClick={closeCancelModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Orders;
