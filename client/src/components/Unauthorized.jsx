import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

// --- Icono SVG ---
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);

// --- Estilos ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  text-align: center;
  padding: 2rem;
`;

const MessageBox = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  background-color: white;
  padding: 3rem 4rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  color: #dc3545;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-top: 1.5rem;
  color: #343a40;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background-color: #007bff;
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

const Unauthorized = () => {
  return (
    <Wrapper>
      <MessageBox>
        <LockIcon />
        <Title>Acceso Denegado</Title>
        <Message>No tienes los permisos suficientes para acceder a esta página.</Message>
        <BackButton to="/dashboard">Volver al Dashboard</BackButton>
      </MessageBox>
    </Wrapper>
  );
};

export default Unauthorized;
