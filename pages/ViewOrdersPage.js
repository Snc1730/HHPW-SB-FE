import React, { useState, useEffect } from 'react';
import OpenOrderCard from '../components/OpenOrderCard';
import { deleteOrder, getAllOrders } from '../api/OrderEndpoints';

const ViewOrdersPage = () => {
  const [openOrders, setOpenOrders] = useState([]);

  useEffect(() => {
    // Fetch open orders from your API
    const fetchOpenOrders = async () => {
      try {
        const ordersData = await getAllOrders(); // Update with your API call
        const openOrdersData = ordersData.filter((order) => order.orderStatus === 'Open');
        console.log('Open Orders Data:', openOrdersData);

        setOpenOrders(openOrdersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOpenOrders();
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      <h2>Open Orders</h2>
      {openOrders.map((order) => (
        <OpenOrderCard key={order.id} order={order} onDelete={deleteOrder} />
      ))}
    </div>
  );
};

export default ViewOrdersPage;
