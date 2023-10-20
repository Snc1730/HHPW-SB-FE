import React, { useState, useEffect } from 'react';
import OpenOrderCard from '../components/OpenOrderCard';
import { deleteOrder, getAllOrders } from '../api/OrderEndpoints';
import ClosedOrderCard from '../components/ClosedOrderCard';

const ViewOrdersPage = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [closedOrders, setClosedOrders] = useState([]);

  useEffect(() => {
    const fetchOpenOrders = async () => {
      try {
        const ordersData = await getAllOrders();
        const openOrdersData = ordersData.filter((order) => order.orderStatus === 'Open');
        const closedOrdersData = ordersData.filter((order) => order.orderStatus === 'Closed');
        console.log('Open Orders Data:', openOrdersData);

        setOpenOrders(openOrdersData);
        setClosedOrders(closedOrdersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOpenOrders();
  }, []);

  return (
    <div>
      <h2>Open Orders</h2>
      {openOrders.map((order) => (
        <OpenOrderCard key={order.id} order={order} onDelete={deleteOrder} />
      ))}

      <h2>Closed Orders</h2>
      {closedOrders.map((order) => (
        <ClosedOrderCard key={order.id} order={order} onDelete={deleteOrder} />
      ))}
    </div>
  );
};

export default ViewOrdersPage;
