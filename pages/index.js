import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkEmployee, signOut } from '../utils/auth';
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
      <Link passHref href="/OrderPage">
        <button type="button">View Orders</button>
      </Link>
      <Link passHref href="/CreateOrderForm">
        <button type="button">Create an Order</button>
      </Link>
      <Link passHref href="/OrderPage">
        <button type="button">View Revenue</button>
      </Link>
      <button type="button" onClick={signOut}>
        Sign Out
      </button>
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
