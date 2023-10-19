import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const OpenOrderCard = ({ order }) => (
  <div className="order-card">
    <h3>Order Name: {order.orderName}</h3>
    <p>Customer Name: {order.customerName}</p>
    <p>Date Placed: {order.datePlaced}</p>
    <Link href={`/order-details/${order.id}`} passHref>
      <button type="button">View Details</button>
    </Link>
    <Link href={`/edit-order/${order.id}`} passHref>
      <button type="button">Edit Order</button>
    </Link>
  </div>
);

OpenOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    datePlaced: PropTypes.string.isRequired,
    // Add other properties from your Order model as needed
  }).isRequired,
};

export default OpenOrderCard;
