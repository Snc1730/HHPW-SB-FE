import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkEmployee } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';
import RegisterForm from '../components/RegisterForm';

function Home() {
  const { user } = useAuth();
  const [myUser, setMyUser] = useState();

  const onUpdate = () => {
    checkEmployee(user.uid).then((data) => setMyUser(data[0]));
  };

  useEffect(() => {
    checkEmployee(user.uid).then((data) => setMyUser(data[0]));
  }, [user.uid]);

  const renderEmployeeContent = () => (
    <div>
      <h1>Welcome {user.fbUser.displayName}!</h1>
      <Link passHref href="/ViewOrdersPage">
        <button type="button">View Orders</button>
      </Link>
      <Link passHref href="/CreateOrderPage">
        <button type="button">Create an Order</button>
      </Link>
      <Link passHref href="/OrderPage">
        <button type="button">View Revenue</button>
      </Link>
    </div>
  );

  const renderNonEmployeeContent = () => (
    <p>You must be logged in as an employee.</p>
  );

  return (
    <>
      {myUser === undefined && <RegisterForm user={user} onUpdate={onUpdate} />}
      {myUser?.isEmployee && renderEmployeeContent()}
      {myUser?.isEmployee === false && renderNonEmployeeContent()}
    </>
  );
}

export default Home;
