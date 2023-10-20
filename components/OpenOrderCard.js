import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';

const OpenOrderCard = ({ order, onDelete }) => {
  const router = useRouter();

  const handleClose = () => {
    router.push(`/close-order/${order.id}`);
  };

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
      <p>Date Placed: {order.datePlaced}</p>
      <Link href={`/order-details/${order.id}`} passHref>
        <button type="button">View Details</button>
      </Link>
      <Link href={`/edit-order/${order.id}`} passHref>
        <button type="button">Edit Order</button>
      </Link>
      <button type="button" onClick={handleClose}>
        Close Order
      </button>
      <button type="button" onClick={handleDelete}>
        Delete Order
      </button>
    </div>
  );
};

OpenOrderCard.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    orderName: PropTypes.string.isRequired,
    customerName: PropTypes.string.isRequired,
    datePlaced: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OpenOrderCard;
