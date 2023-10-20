import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getOrderById } from '../../api/OrderEndpoints';
import CloseOrderForm from '../../components/CloseOrderForm';

const CloseOrderPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const order = await getOrderById(id);
        setOrderData(order);
      } catch (error) {
        // Handle errors
        console.error(error.message);
      }
    };

    fetchOrderData();
  }, [id]);

  return (
    <div>
      <h2>Close Order</h2>
      {orderData && (
        <div>
          <h3>Order Name: {orderData.orderName}</h3>
          <p>Order Price: {orderData.orderPrice}</p>
          <CloseOrderForm order={orderData} />
        </div>
      )}
    </div>
  );
};

export default CloseOrderPage;
