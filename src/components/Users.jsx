import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Modal, Form } from 'react-bootstrap';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/users');
    const data = await response.json();
    setUsers(data);
  };

  const handleShowModal = (user = null) => {
    setSelectedUser(user || {});
    setIsCreating(!user);
    setShowModal(true);
    setErrorMessage(""); 
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;

    if (name === "edad") {
      if (value && (isNaN(value) || Number(value) < 0 || Number(value) > 99)) {
        setErrorMessage("Por favor, ingresa un número válido para la edad (0-99).");
        return;
      } else {
        setErrorMessage("");
      }
    }

    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (errorMessage) {
      alert("Por favor, corrige los errores antes de enviar.");
      return;
    }

    if (isCreating) {
      await createUser();
    } else {
      await updateUser();
    }
  };

  const createUser = async () => {
    const response = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    });
    if (response.ok) {
      handleCloseModal();
      fetchUsers();
    } else {
      console.error('Error al crear el usuario');
    }
  };

  const updateUser = async () => {
    const response = await fetch(`/users/${selectedUser.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    });
    if (response.ok) {
      handleCloseModal();
      fetchUsers();
    } else {
      console.error('Error al actualizar el usuario');
    }
  };

  const deleteUser = async (id) => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este usuario?');
    if (confirmed) {
      const response = await fetch(`/users/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error('Error al eliminar el usuario');
      }
    }
  };

  return (
    <Container>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Usuarios</h2>
        <Button variant="success" onClick={() => handleShowModal()}>+</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Email</th>            
            <th>Edad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.email}</td>
              <td>{user.edad}</td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(user)}>Editar</Button>{' '}
                <Button variant="danger"style={{ backgroundColor: 'red' }} onClick={() => deleteUser(user.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      
      <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Title>{isCreating ? 'Crear Usuario' : 'Editar Usuario'}</Modal.Title>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Nombre" name="nombre" value={selectedUser.nombre || ''} onChange={handleUserChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" name="email" value={selectedUser.email || ''} onChange={handleUserChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formUserAge">
              <Form.Label>Edad</Form.Label>
              <Form.Control type="number" placeholder="Edad" name="edad" value={selectedUser.edad || ''} onChange={handleUserChange} />
              {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {isCreating ? 'Crear' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Users;
