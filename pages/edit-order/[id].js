import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOrderById } from '../../api/OrderEndpoints';
import CreateOrderForm from '../../components/CreateOrderForm';

const EditOrderPage = () => {
  const [orderData, setOrderData] = useState(null); // Set to null initially
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchOrderData = async () => {
      if (id) {
        try {
          // Fetch order data by ID using your API endpoint
          const order = await getOrderById(id); // Implement this API call
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
