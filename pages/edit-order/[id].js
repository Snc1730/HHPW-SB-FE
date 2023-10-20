import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOrderById } from '../../api/OrderEndpoints';
import CreateOrderForm from '../../components/CreateOrderForm';

const EditOrderPage = () => {
  const [orderData, setOrderData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchOrderData = async () => {
      if (id) {
        try {
          const order = await getOrderById(id);
          console.log('Fetched order data:', order);
          setOrderData(order);
        } catch (error) {
          console.error('Error fetching order data:', error);
        }
      }
    };

    fetchOrderData();
  }, [id]);

  return (
    <div>
      <h2>Edit Order</h2>
      <CreateOrderForm obj={orderData} />
    </div>
  );
};
export default EditOrderPage;
