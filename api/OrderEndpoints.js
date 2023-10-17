const getAllOrders = async () => {
  try {
    const response = await fetch('https://localhost:7027/api/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching orders');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

export default getAllOrders;

const createOrder = async (orderData) => {
  try {
    const modifiedOrderData = {
      ...orderData,
      orderStatus: 'Open',
    };

    const response = await fetch('https://localhost:7027/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(modifiedOrderData),
    });

    if (!response.ok) {
      throw new Error('Error creating order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error creating order: ${error.message}`);
  }
};

const associateMenuItemWithOrder = async (orderId, menuItemId) => {
  try {
    const response = await fetch(`https://localhost:7027/api/order/${orderId}/menuitem/${menuItemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error associating menu item with order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error associating menu item with order: ${error.message}`);
  }
};

export {
  createOrder,
  associateMenuItemWithOrder,
};
