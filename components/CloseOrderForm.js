import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { updateOrder } from '../api/OrderEndpoints';

const CloseOrderForm = ({ order }) => {
  const [tip, setTip] = useState(0);
  const [review, setReview] = useState(1);
  const totalOrderAmount = (tip + order.orderPrice).toFixed(2);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = window.confirm(`Are you sure you want to close this order? (${order.orderName})`);

    if (!confirmed) {
      return;
    }

    const formData = {
      id: order.id,
      employeeId: order.employeeId,
      orderName: order.orderName,
      datePlaced: order.datePlaced,
      orderPrice: order.orderPrice,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      orderType: order.orderType,
      paymentType: order.paymentType,
      tip,
      totalOrderAmount,
      review,
      orderStatus: 'Closed',
      dateClosed: new Date().toISOString(),
    };

    try {
      const response = await updateOrder(order.id, formData);

      if (response === 'Order updated successfully') {
        router.push('/ViewOrdersPage');
      } else {
        // Handle errors
      }
    } catch (error) {
      // Handle errors
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="tip">Tip:</label>
        <input
          type="number"
          id="tip"
          value={tip}
          onChange={(e) => setTip(parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="review">Review (1-5 stars):</label>
        <select id="review" value={review} onChange={(e) => setReview(parseInt(e.target.value, 10))}>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

CloseOrderForm.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.number.isRequired,
    employeeId: PropTypes.number.isRequired,
    orderName: PropTypes.string.isRequired,
    datePlaced: PropTypes.string.isRequired,
    orderPrice: PropTypes.number.isRequired,
    customerName: PropTypes.string.isRequired,
    customerEmail: PropTypes.string.isRequired,
    customerPhone: PropTypes.string.isRequired,
    orderType: PropTypes.string.isRequired,
    paymentType: PropTypes.string.isRequired,
  }).isRequired,
};

export default CloseOrderForm;
