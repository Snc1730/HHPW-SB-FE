import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOrderById, getOrderMenuItems } from '../../api/OrderEndpoints';

const OrderDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [orderDetails, setOrderDetails] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!id) {
          console.error('Invalid order ID');
          return;
        }

        // Fetch order details
        const orderData = await getOrderById(id);
        console.log('Order Data:', orderData); // Log order data
        setOrderDetails(orderData);

        // Fetch associated menu items
        const menuItemsData = await getOrderMenuItems(id); // Implement this API call
        console.log('Menu Items Data:', menuItemsData); // Log menu items data
        setMenuItems(menuItemsData);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [id]);

  if (!orderDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order Name: {orderDetails.orderName}</p>
      <p>Customer Name: {orderDetails.customerName}</p>
      <p>Customer Phone: {orderDetails.customerPhone}</p>
      <p>Customer Email: {orderDetails.customerEmail}</p>
      <p>Order Type: {orderDetails.orderType}</p>
      <p>Order Status: {orderDetails.orderStatus}</p>

      <h3>Order Items:</h3>
      <ul>
        {menuItems && menuItems.map((menuItem) => (
          <li key={menuItem.id}>
            <strong>{menuItem.name}</strong> - Price: {menuItem.price} - Quantity: {orderDetails.menuItemQuantities[menuItem.id]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailsPage;
