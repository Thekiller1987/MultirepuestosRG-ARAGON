import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components'; // Importamos 'css' para las media queries
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Iconos SVG ---
const EyeIcon = ({ closed }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {closed ? (
      <><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></>
    ) : (
      <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></>
    )}
  </svg>
);

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

// --- Estilos Mejorados (CON MODIFICACIONES PARA MOBILE) ---
const PageWrapper = styled.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;

  // 💡 MOBILE: Ajustar padding
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: 100dvh;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  // 💡 MOBILE: Apilar en pantallas pequeñas
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #343a40;

  // 💡 MOBILE: Reducir tamaño de fuente
  @media (max-width: 768px) {
    font-size: 1.8rem;
    text-align: center;
  }
`;

const Button = styled.button`
  padding: 0.7rem 1.3rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);

  &:active {
    transform: scale(0.98);
    box-shadow: none;
  }
`;

const BackButton = styled(Link)`
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: #495057;
    font-weight: 600;
    margin-bottom: 2rem;
    &:hover {
        color: #007bff;
    }

    // 💡 MOBILE: Centrar y hacer el botón más visible
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
      font-size: 1rem;
      align-self: flex-start;
    }
`;

const CreateButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }

  // 💡 MOBILE: Ocupar todo el ancho cuando apilado
  @media (max-width: 500px) {
    width: 100%;
    justify-content: center;
  }
`;

const EditButton = styled(Button)`
  background: none;
  border: 1px solid #ffc107;
  color: #ffc107;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  &:hover { 
    background-color: #ffc107;
    color: #212529;
  }
`;

const DeleteButton = styled(Button)`
  background: none;
  border: 1px solid #dc3545;
  color: #dc3545;
  padding: 0.5rem 1rem;
  &:hover { 
    background-color: #dc3545;
    color: white;
  }
`;

// 💡 MOBILE: Contenedor para la vista de tarjetas en móvil
const MobileCardContainer = styled.div`
  display: none; /* Oculto por defecto */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

// 💡 MOBILE: Estilo de tarjeta para cada usuario
const UserCard = styled.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${props => props.$roleColor || '#007bff'};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 
    "name role"
    "id id"
    "actions actions";
  gap: 0.5rem;
`;

const CardDetail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  strong {
    color: #343a40;
    font-weight: 700;
  }
`;

const CardName = styled.p`
  grid-area: name;
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0;
`;

const CardRole = styled.span`
  grid-area: role;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.$roleColor};
`;

const CardActions = styled.div`
  grid-area: actions;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.8rem;

  ${EditButton}, ${DeleteButton} {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    margin-right: 0;
  }
`;

// 💡 DESKTOP: Estilos de Tabla (Oculta en móvil)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none; /* Ocultar la tabla en móvil */
  }
`;

const Th = styled.th`
  background-color: #343a40;
  color: white;
  padding: 1.2rem 1rem;
  text-align: left;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1.2rem 1rem;
  border-bottom: 1px solid #dee2e6;
  color: #495057;
`;

const Tr = styled.tr`
    &:last-child ${Td} {
        border-bottom: none;
    }
    &:hover {
        background-color: #f8f9fa;
    }
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
`;

// --- Estilos para el Modal Animado (Ajuste para móvil) ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.form)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

  // 💡 MOBILE: Ocupar más espacio en pantalla y ajuste de padding
  @media (max-width: 500px) {
    width: 95%;
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  margin-bottom: 2rem;
  color: #343a40;
  text-align: center;

  @media (max-width: 500px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem 1rem;
  margin-bottom: 1.2rem;
  border-radius: 8px;
  border: 1px solid #ced4da;
  font-size: 1rem;

  // 💡 MOBILE: Fuente ligeramente más grande para tacto
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.span`
  position: absolute;
  right: 15px;
  top: 15px;
  cursor: pointer;
  user-select: none;
  color: #adb5bd;

  // 💡 MOBILE: Ajustar posición
  @media (max-width: 768px) {
    top: 17px;
    right: 18px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;

  // 💡 MOBILE: Ocupar todo el ancho en móvil
  @media (max-width: 500px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1.5rem;

    ${Button} {
      width: 100%;
      justify-content: center;
    }
  }
`;

const SaveButton = styled(Button)`
  background-color: #007bff;
  color: white;
  &:hover { background-color: #0069d9; }
`;

const CancelButton = styled(Button)`
  background-color: #f8f9fa;
  color: #6c757d;
  border: 1px solid #ced4da;
  &:hover { background-color: #e2e6ea; }
`;

const ModalError = styled.p`
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  min-height: 1.2rem;
`;

// --- Componente ---
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nombre_usuario: '', password: '', confirmPassword: '', rol: 'Vendedor' });
  const [showPassword, setShowPassword] = useState(false);
  const [modalError, setModalError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('/api/users', config);
      setUsers(data);
    } catch (err) {
      setError('Error al cargar los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 💡 Helper para asignar color a la tarjeta según el rol (mejora visual en móvil)
  const getRoleColor = (rol) => {
    switch(rol) {
      case 'Administrador': return '#dc3545'; // Rojo
      case 'Contador': return '#ffc107'; // Amarillo
      case 'Vendedor': return '#007bff'; // Azul
      default: return '#6c757d';
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({ nombre_usuario: '', password: '', confirmPassword: '', rol: 'Vendedor' }); // Resetear formulario
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ nombre_usuario: user.nombre_usuario, password: '', confirmPassword: '', rol: user.rol });
    setModalError('');
    setShowPassword(false);
    setIsModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/users/${userToDelete.id_usuario}`, config);
      setUsers(users.filter(u => u.id_usuario !== userToDelete.id_usuario));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    } catch (err) {
      setError('Error al eliminar el usuario.');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setModalError('');
    
    // Lógica de validación mejorada
    if (!editingUser || formData.password) {
      if (formData.password !== formData.confirmPassword) {
        setModalError('Las contraseñas no coinciden.');
        return;
      }
    }

    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    try {
      if (editingUser) {
        const updateData = { rol: formData.rol };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await axios.put(`/api/users/${editingUser.id_usuario}`, updateData, config);
      } else {
        await axios.post('/api/auth/register', {
          nombre_usuario: formData.nombre_usuario,
          password: formData.password,
          rol: formData.rol
        }, config);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setModalError(err.response?.data?.msg || 'Error al guardar. Verifique los datos.');
    }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 }
  };

  if (loading) return <PageWrapper><Message>Cargando usuarios...</Message></PageWrapper>;
  if (error) return <PageWrapper><Message style={{ color: 'red' }}>{error}</Message></PageWrapper>;

  return (
    <PageWrapper>
      <BackButton to="/dashboard"><BackIcon /> Volver al Dashboard</BackButton>
      <TopBar>
        <Header>Gestión de Usuarios</Header>
        <CreateButton onClick={openCreateModal}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Crear Nuevo Usuario
        </CreateButton>
      </TopBar>
      
      {/* 💡 DESKTOP VIEW: Tabla */}
      <Table>
        <thead>
          <Tr>
            <Th>ID</Th><Th>Nombre de Usuario</Th><Th>Rol</Th><Th>Acciones</Th>
          </Tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Tr key={user.id_usuario}>
              <Td>{user.id_usuario}</Td>
              <Td>{user.nombre_usuario}</Td>
              <Td>{user.rol}</Td>
              <Td>
                <EditButton onClick={() => openEditModal(user)}>✏️ Editar</EditButton>
                <DeleteButton onClick={() => openDeleteModal(user)}>🗑️ Eliminar</DeleteButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
      
      {/* 💡 MOBILE VIEW: Tarjetas */}
      <MobileCardContainer>
        {users.map((user) => (
          <UserCard key={user.id_usuario} $roleColor={getRoleColor(user.rol)}>
            <CardName>{user.nombre_usuario}</CardName>
            <CardRole $roleColor={getRoleColor(user.rol)}>{user.rol}</CardRole>
            <CardDetail style={{ gridArea: 'id' }}>ID: <strong>{user.id_usuario}</strong></CardDetail>
            <CardActions>
              <EditButton onClick={() => openEditModal(user)}>✏️ Editar</EditButton>
              <DeleteButton onClick={() => openDeleteModal(user)}>🗑️ Eliminar</DeleteButton>
            </CardActions>
          </UserCard>
        ))}
      </MobileCardContainer>
      

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
            <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSaveUser} onClick={(e) => e.stopPropagation()}>
              <ModalTitle>{editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</ModalTitle>
              <ModalError>{modalError}</ModalError>
              <Input 
                type="text" name="nombre_usuario" placeholder="Nombre de usuario" 
                value={formData.nombre_usuario} onChange={handleInputChange}
                disabled={!!editingUser} required 
              />
              <PasswordWrapper>
                <Input 
                  type={showPassword ? 'text' : 'password'} name="password"
                  placeholder={editingUser ? 'Nueva contraseña (opcional)' : 'Contraseña'} 
                  value={formData.password} onChange={handleInputChange}
                  required={!editingUser} 
                />
                <TogglePasswordButton onClick={() => setShowPassword(!showPassword)}>
                  <EyeIcon closed={!showPassword} />
                </TogglePasswordButton>
              </PasswordWrapper>
              
              {( !editingUser || (editingUser && formData.password) ) && (
                <PasswordWrapper>
                    <Input 
                        type={showPassword ? 'text' : 'password'} name="confirmPassword"
                        placeholder="Confirmar contraseña" 
                        value={formData.confirmPassword} onChange={handleInputChange}
                        required
                    />
                </PasswordWrapper>
              )}

              <Select name="rol" value={formData.rol} onChange={handleInputChange}>
                <option value="Vendedor">Vendedor</option>
                <option value="Contador">Contador</option>
                <option value="Administrador">Administrador</option>
              </Select>
              <ModalActions>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>Cancelar</CancelButton>
                <SaveButton type="submit">Guardar Cambios</SaveButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)}>
              <ModalContent as="div" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
                  <ModalTitle>Confirmar Eliminación</ModalTitle>
                  <p>¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete?.nombre_usuario}</strong>? Esta acción no se puede deshacer.</p>
                  <ModalActions>
                      <CancelButton onClick={() => setIsDeleteModalOpen(false)}>Cancelar</CancelButton>
                      <DeleteButton style={{backgroundColor: '#dc3545', color: 'white'}} onClick={confirmDelete}>Sí, Eliminar</DeleteButton>
                  </ModalActions>
              </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default UserManagement;