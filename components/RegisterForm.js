import PropTypes from 'prop-types';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FloatingLabel } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { createEmployee } from '../utils/auth';

function RegisterForm({ user, onUpdate }) {
  const [formData, setFormData] = useState({
    bio: '',
    uid: user.uid,
  });

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData, UID: user.uid, ProfileImageURL: user.fbUser.photoURL, CreatedOn: new Date(Date.now()), Active: true,
    };
    console.warn('my payload', payload);
    await createEmployee(payload);
    onUpdate();
    router.push('/');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label> Name</Form.Label>
        <Form.Control as="textarea" name="Name" required placeholder="Name" onChange={({ target }) => setFormData((prev) => ({ ...prev, [target.name]: target.value }))} />
        <Form.Label> Are you an employee?  </Form.Label>
        <FloatingLabel controlId="floatingInput1" label="Are you an Employee?" className="mb-3" style={{ color: 'red' }}>
          <Form.Select
            type="text"
            placeholder=""
            name="isEmployee"
            onChange={({ target }) => {
              const selectedValue = target.value === 'true'; // Convert to boolean
              setFormData((prev) => ({ ...prev, [target.name]: selectedValue }));
            }}
            required
          >
            <option>Are you an employee?</option>
            <option value="true" style={{ color: 'black' }}>Yes</option>
            <option value="false" style={{ color: 'black' }}>No</option>
          </Form.Select>
        </FloatingLabel>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    fbUser: PropTypes.shape({
      photoURL: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default RegisterForm;
