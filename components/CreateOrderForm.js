import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { associateMenuItemWithOrder, createOrder, updateOrder } from '../api/OrderEndpoints';
import { getAllMenuItems, getMenuItemById } from '../api/MenuItemEndpoints';
import { useAuth } from '../utils/context/authContext';
import { checkEmployee } from '../utils/auth';

const CreateOrderForm = ({ obj }) => {
  console.log('Received obj:', obj);
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();
  const [orderName, setOrderName] = useState('');
  const [orderType, setOrderType] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [menuItemQuantities, setMenuItemQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    console.log('Populating form fields with obj:', obj);
    if (obj) {
      setOrderName(obj.orderName || '');
      setOrderType(obj.orderType || '');
      setPaymentType(obj.paymentType || '');
      setCustomerName(obj.customerName || '');
      setCustomerEmail(obj.customerEmail || '');
      setCustomerPhone(obj.customerPhone || '');
      if (obj.menuItemQuantities) {
        setMenuItemQuantities(obj.menuItemQuantities);
      }
    }
  }, [obj]);

  const onUpdate = () => {
    checkEmployee(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
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

  const handleFormSubmit = async () => {
    try {
      console.log('Form submitted. Editing:', obj ? 'Yes' : 'No');
      const employeeId = myUser?.id;
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString();
      const menuItemsDetails = await Promise.all(
        Object.keys(menuItemQuantities).map(async (menuItemId) => {
          const menuItem = await getMenuItemById(menuItemId);
          return { id: menuItem.id, price: menuItem.price, quantity: menuItemQuantities[menuItemId] };
        }),
      );
      const orderPrice = menuItemsDetails.reduce((totalPrice, menuItem) => totalPrice + menuItem.price * menuItem.quantity, 0);

      if (obj) {
        await updateOrder(obj.id, {
          orderName,
          orderType,
          paymentType,
          customerName,
          customerEmail,
          customerPhone,
          employeeId: parseInt(employeeId, 10),
          menuItemQuantities: Object.fromEntries(
            Object.entries(menuItemQuantities).map(([menuItemId, quantity]) => [parseInt(menuItemId, 10), parseInt(quantity, 10)]),
          ),
          DatePlaced: formattedDate,
          OrderPrice: orderPrice,
        });
      } else {
        // It's a new order
        const orderResponse = await createOrder({
          orderName,
          orderType,
          paymentType,
          customerName,
          customerEmail,
          customerPhone,
          employeeId: parseInt(employeeId, 10),
          menuItemQuantities: Object.fromEntries(
            Object.entries(menuItemQuantities).map(([menuItemId, quantity]) => [parseInt(menuItemId, 10), parseInt(quantity, 10)]),
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
      }
    } catch (error) {
      console.error('Error creating/updating order:', error);
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

      <Button variant="primary" onClick={handleFormSubmit}>
        Create Order
      </Button>
    </Form>
  );
};

CreateOrderForm.propTypes = {
  obj: PropTypes.shape({
    id: PropTypes.number,
    orderName: PropTypes.string,
    orderType: PropTypes.string,
    paymentType: PropTypes.string,
    customerName: PropTypes.string,
    customerEmail: PropTypes.string,
    customerPhone: PropTypes.string,
    menuItemQuantities: PropTypes.objectOf(PropTypes.number),
  }),
};

CreateOrderForm.defaultProps = {
  obj: null,
};

export default CreateOrderForm;
