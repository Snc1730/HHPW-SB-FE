import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

const ClosedOrderCard = ({ order, onDelete }) => {
  const handleDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete the order: ${order.orderName}?`);

    if (confirmed) {
      onDelete(order.id)
        .then(() => {
          window.location.reload();
        })
        .catch((error) => {
          console.error('Error deleting order:', error);
        });
    }
  };

  return (
    <div className="order-card">
      <h3>Order Name: {order.orderName}</h3>
      <p>Customer Name: {order.customerName}</p>
      <p>Date Closed: {order.dateClosed}</p>
      <Link href={`/order-details/${order.id}`} passHref>
        <button type="button">View Details</button>
      </Link>
      <button type="button" onClick={handleDelete}>
        Delete Order
      </button>
    </div>
  );
};

ClosedOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    dateClosed: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ClosedOrderCard;
