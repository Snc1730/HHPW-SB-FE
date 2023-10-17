import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';
import { associateMenuItemWithOrder, createOrder } from '../api/OrderEndpoints';
import { getAllMenuItems, getMenuItemById } from '../api/MenuItemEndpoints';
import { useAuth } from '../utils/context/authContext';
import { checkEmployee } from '../utils/auth';

const CreateOrderForm = () => {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [orderName, setOrderName] = useState('');
  const [tip, setTip] = useState('');
  const [orderType, setOrderType] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemQuantities, setMenuItemQuantities] = useState({});
  const router = useRouter();

  const onUpdate = () => {
    checkEmployee(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    // Call onUpdate when user.uid changes
    onUpdate();
  }, [user.uid]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const fetchedMenuItems = await getAllMenuItems();
        setMenuItems(fetchedMenuItems);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  const handleCreateOrder = async () => {
    try {
      const employeeId = myUser?.id;

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();

      // Fetch menu item details to calculate OrderPrice
      const menuItemsDetails = await Promise.all(
        Object.keys(menuItemQuantities).map(async (menuItemId) => {
          const menuItem = await getMenuItemById(menuItemId);
          return { id: menuItem.id, price: menuItem.price, quantity: menuItemQuantities[menuItemId] };
        }),
      );

      // Calculate OrderPrice based on selected menu items and their quantities
      const orderPrice = menuItemsDetails.reduce((totalPrice, menuItem) => totalPrice + menuItem.price * menuItem.quantity, 0);

      const orderResponse = await createOrder({
        orderName,
        tip,
        orderType,
        paymentType,
        customerName,
        customerEmail,
        customerPhone,
        employeeId: parseInt(employeeId, 10),
        menuItemQuantities: Object.fromEntries(
          Object.entries(menuItemQuantities).map(([menuItemId, quantity]) => [
            parseInt(menuItemId, 10),
            parseInt(quantity, 10),
          ]),
        ),
        DatePlaced: formattedDate,
        OrderPrice: orderPrice,
      });

      if (orderResponse && orderResponse.id) {
        const orderId = orderResponse.id;

        const associationPromises = Object.keys(menuItemQuantities).map(async (menuItemId) => {
          const quantity = menuItemQuantities[menuItemId];
          if (quantity > 0) {
            console.log(`Associating menu item ${menuItemId} with quantity ${quantity} to order ${orderId}`);
            await associateMenuItemWithOrder(orderId, menuItemId, quantity);
          }
        });

        await Promise.all(associationPromises);

        console.log('Order placed successfully!');
        router.push('/');
      } else {
        console.error('Error creating order: Unexpected or incomplete response received', orderResponse);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleMenuItemQuantityChange = (menuItemId, quantity) => {
    setMenuItemQuantities((prevQuantities) => ({
      ...prevQuantities,
      [menuItemId]: quantity,
    }));
  };

  return (
    <Form>
      <Form.Group controlId="formOrderName">
        <Form.Label>Order Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter order name"
          value={orderName}
          onChange={(e) => setOrderName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formTip">
        <Form.Label>Tip</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter tip amount"
          value={tip}
          onChange={(e) => setTip(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formOrderType">
        <Form.Label>Order Type</Form.Label>
        <Form.Control
          as="select"
          value={orderType}
          onChange={(e) => setOrderType(e.target.value)}
        >
          <option value="">Select order type</option>
          <option value="phone">Phone</option>
          <option value="inPerson">In Person</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formPaymentType">
        <Form.Label>Payment Type</Form.Label>
        <Form.Control
          as="select"
          value={paymentType}
          onChange={(e) => setPaymentType(e.target.value)}
        >
          <option value="">Select payment type</option>
          <option value="cash">Cash</option>
          <option value="debit">Debit</option>
          <option value="credit">Credit</option>
          <option value="paypal">PayPal</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formCustomerName">
        <Form.Label>Customer Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formCustomerEmail">
        <Form.Label>Customer Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter customer email"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formCustomerPhone">
        <Form.Label>Customer Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter customer phone"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formMenuItems">
        <Form.Label>Select Menu Items and Quantities:</Form.Label>
        {menuItems.map((menuItem) => (
          <Form.Group key={menuItem.id} controlId={`menuItem-${menuItem.id}`}>
            <Form.Label>{menuItem.name}</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={menuItemQuantities[menuItem.id] || 0}
              onChange={(e) => handleMenuItemQuantityChange(menuItem.id, parseInt(e.target.value, 10))}
            />
          </Form.Group>
        ))}
      </Form.Group>

      <Button variant="primary" onClick={handleCreateOrder}>
        Create Order
      </Button>
    </Form>
  );
};

export default CreateOrderForm;
