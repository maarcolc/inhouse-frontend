import React from 'react';
import { Container } from 'react-bootstrap';
import Users from './components/Users';

function App() {
  return (
    <Container className="full-height">
      <h1>API de Usuarios</h1>
      <Users />
    </Container>
  );
}

export default App;
