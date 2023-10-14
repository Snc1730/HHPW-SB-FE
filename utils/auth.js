import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from './client';

const checkEmployee = (uid) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/checkemployee/${uid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(async (res) => {
      let data;
      if (res.ok) {
        data = await res.json();
        resolve(data);
      }
    })
    .catch(reject);
});

const createEmployee = (employeeInfo) => new Promise((resolve, reject) => {
  fetch(`${clientCredentials.databaseURL}/api/employee`, {
    method: 'POST',
    body: JSON.stringify(employeeInfo),
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((resp) => resolve(resp.json()))
    .catch(reject);
});

const signIn = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
};

const signOut = () => {
  firebase.auth().signOut();
};

export {
  signIn, //
  signOut,
  checkEmployee,
  createEmployee,
};
