const getAllMenuItems = async () => {
  try {
    const response = await fetch('https://localhost:7027/api/menuitems', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching menu items');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching menu items: ${error.message}`);
  }
};

const getMenuItemById = async (id) => {
  try {
    const response = await fetch(`https://localhost:7027/api/menuitem/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching menu item');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Error fetching menu item: ${error.message}`);
  }
};

export { getAllMenuItems, getMenuItemById };
