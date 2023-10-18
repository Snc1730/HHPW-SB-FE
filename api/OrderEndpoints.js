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

const getOrderById = async (id) => {
  try {
    const response = await fetch(`https://localhost:7027/api/order/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching order: ${error.message}`);
  }
};

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

const getOrderMenuItems = async (orderId) => {
  try {
    const response = await fetch(`https://localhost:7027/api/orders/${orderId}/orderitems`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching order menu items');
    }

    const orderItems = await response.json();
    return orderItems;
  } catch (error) {
    throw new Error(`Error fetching order menu items: ${error.message}`);
  }
};

export {
  createOrder,
  associateMenuItemWithOrder,
  getAllOrders,
  getOrderById,
  getOrderMenuItems,
};
