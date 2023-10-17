import React from 'react';
import PropTypes from 'prop-types';

const OpenOrderCard = ({ order }) => {
  const handleViewDetails = () => {
    // Handle the action when viewing order details
    // You can navigate to a new page to show the details
    console.log('View order details for order ID:', order.id);
  };

  return (
    <div className="order-card">
      <h3>Order Name: {order.orderName}</h3>
      <p>Customer Name: {order.customerName}</p>
      <p>Date Placed: {order.datePlaced}</p>
      <button type="button" onClick={handleViewDetails}>View Details</button>
    </div>
  );
};

OpenOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    datePlaced: PropTypes.instanceOf(Date).isRequired,
    // Add other properties from your Order model as needed
  }).isRequired,
};

export default OpenOrderCard;
