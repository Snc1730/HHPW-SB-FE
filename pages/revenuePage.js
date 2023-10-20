import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../api/OrderEndpoints';

const RevenuePage = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const ordersData = await getAllOrders();

        // Calculate total revenue by summing up totalOrderAmount of all orders
        const revenue = ordersData.reduce((acc, order) => acc + order.totalOrderAmount, 0);

        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <div>
      <h2>Revenue</h2>
      <p>Total Revenue: ${totalRevenue.toFixed(2)}</p>
    </div>
  );
};

export default RevenuePage;
