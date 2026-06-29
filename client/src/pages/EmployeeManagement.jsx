import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchEmployees, createEmployeeApi, updateEmployeeApi, deleteEmployeeApi } from '../service/api.js';
import socket from '../service/socket.js';

// --- Iconos SVG ---
const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

// --- Estilos ---
const PageWrapper = styled.div`
  padding: 2rem 4rem;
  background-color: #f8f9fa;
  min-height: 100vh;
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
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
`;

const Header = styled.h1`
  font-size: 2.5rem;
  color: #343a40;
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
    &:hover { color: #007bff; }
    @media (max-width: 768px) {
      margin-bottom: 1.5rem;
      font-size: 1rem;
    }
`;

const CreateButton = styled(Button)`
  background-color: #28a745;
  color: white;
  &:hover { background-color: #218838; }
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

const ActivateButton = styled(Button)`
  background: none;
  border: 1px solid #28a745;
  color: #28a745;
  padding: 0.5rem 1rem;
  &:hover {
    background-color: #28a745;
    color: white;
  }
`;

// --- Tabla Desktop ---
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  border-radius: 12px;
  overflow: hidden;
  @media (max-width: 768px) {
    display: none;
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
    &:last-child ${Td} { border-bottom: none; }
    &:hover { background-color: #f8f9fa; }
`;

// --- Tarjetas Mobile ---
const MobileCardContainer = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;

const EmployeeCard = styled.div`
  background-color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${props => props.$active ? '#28a745' : '#dc3545'};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardName = styled.p`
  font-size: 1.1rem;
  font-weight: 700;
  color: #343a40;
  margin: 0;
`;

const CardDetail = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
  strong { color: #343a40; font-weight: 700; }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
  ${EditButton}, ${DeleteButton}, ${ActivateButton} {
    padding: 0.6rem 0.8rem;
    font-size: 0.8rem;
    margin-right: 0;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$active ? '#155724' : '#721c24'};
`;

// --- Toggle para ver inactivos ---
const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #495057;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 26px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  span {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 26px;
    &::before {
      content: "";
      position: absolute;
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: 0.3s;
      border-radius: 50%;
    }
  }
  input:checked + span {
    background-color: #007bff;
    &::before { transform: translateX(22px); }
  }
`;

// --- Modal ---
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
  @media (max-width: 768px) {
    padding: 0.9rem 1rem;
    font-size: 1.05rem;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #495057;
  font-size: 0.9rem;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
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

const Message = styled.p`
  font-size: 1.2rem;
  color: #6c757d;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.07);
  h3 {
    color: #343a40;
    margin-bottom: 0.5rem;
  }
  p {
    color: #6c757d;
  }
`;

// --- Componente Principal ---
const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInactive, setShowInactive] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', telefono: '', cargo: '' });
  const [modalError, setModalError] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const data = await fetchEmployees(token, showInactive);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Error al cargar los empleados.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();

    socket.on('employees:update', loadEmployees);

    return () => {
      socket.off('employees:update', loadEmployees);
    };
  }, [showInactive]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCreateModal = () => {
    setEditingEmployee(null);
    setFormData({ nombre: '', telefono: '', cargo: '' });
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setFormData({
      nombre: emp.nombre || '',
      telefono: emp.telefono || '',
      cargo: emp.cargo || ''
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const openDeleteModal = (emp) => {
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      const token = localStorage.getItem('token');
      await deleteEmployeeApi(employeeToDelete.id_empleado, token);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (err) {
      setError(err.message || 'Error al desactivar el empleado.');
    }
  };

  const handleReactivate = async (emp) => {
    try {
      const token = localStorage.getItem('token');
      await updateEmployeeApi(emp.id_empleado, { ...emp, activo: true }, token);
      loadEmployees();
    } catch (err) {
      setError(err.message || 'Error al reactivar empleado.');
    }
  };

  const handleSaveEmployee = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!formData.nombre.trim()) {
      setModalError('El nombre del empleado es obligatorio.');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      if (editingEmployee) {
        await updateEmployeeApi(editingEmployee.id_empleado, formData, token);
      } else {
        await createEmployeeApi(formData, token);
      }
      setIsModalOpen(false);
      loadEmployees();
    } catch (err) {
      setModalError(err.message || 'Error al guardar. Verifique los datos.');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 50, scale: 0.95 }
  };

  if (loading) return <PageWrapper><Message>Cargando empleados...</Message></PageWrapper>;
  if (error) return <PageWrapper><Message style={{ color: 'red' }}>{error}</Message></PageWrapper>;

  return (
    <PageWrapper>
      <BackButton to="/dashboard"><BackIcon /> Volver al Dashboard</BackButton>
      <TopBar>
        <Header>Gestión de Trabajadores</Header>
        <CreateButton onClick={openCreateModal}>
          <span style={{ fontSize: '1.2rem' }}>+</span> Nuevo Trabajador
        </CreateButton>
      </TopBar>

      <ToggleContainer>
        <ToggleSwitch>
          <input type="checkbox" checked={showInactive} onChange={() => setShowInactive(!showInactive)} />
          <span></span>
        </ToggleSwitch>
        Mostrar inactivos
      </ToggleContainer>

      {employees.length === 0 ? (
        <EmptyState>
          <h3>👷 No hay trabajadores registrados</h3>
          <p>Presiona "Nuevo Trabajador" para agregar el primero.</p>
        </EmptyState>
      ) : (
        <>
          {/* DESKTOP: Tabla */}
          <Table>
            <thead>
              <Tr>
                <Th>ID</Th><Th>Nombre</Th><Th>Teléfono</Th><Th>Cargo</Th><Th>Estado</Th><Th>Acciones</Th>
              </Tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <Tr key={emp.id_empleado}>
                  <Td>{emp.id_empleado}</Td>
                  <Td style={{ fontWeight: 600 }}>{emp.nombre}</Td>
                  <Td>{emp.telefono || '—'}</Td>
                  <Td>{emp.cargo || '—'}</Td>
                  <Td>
                    <StatusBadge $active={!!emp.activo}>
                      {emp.activo ? '✅ Activo' : '❌ Inactivo'}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <EditButton onClick={() => openEditModal(emp)}>✏️ Editar</EditButton>
                    {emp.activo ? (
                      <DeleteButton onClick={() => openDeleteModal(emp)}>🚫 Desactivar</DeleteButton>
                    ) : (
                      <ActivateButton onClick={() => handleReactivate(emp)}>✅ Reactivar</ActivateButton>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>

          {/* MOBILE: Tarjetas */}
          <MobileCardContainer>
            {employees.map((emp) => (
              <EmployeeCard key={emp.id_empleado} $active={!!emp.activo}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardName>{emp.nombre}</CardName>
                  <StatusBadge $active={!!emp.activo}>
                    {emp.activo ? 'Activo' : 'Inactivo'}
                  </StatusBadge>
                </div>
                {emp.cargo && <CardDetail>Cargo: <strong>{emp.cargo}</strong></CardDetail>}
                {emp.telefono && <CardDetail>Tel: <strong>{emp.telefono}</strong></CardDetail>}
                <CardActions>
                  <EditButton onClick={() => openEditModal(emp)}>✏️ Editar</EditButton>
                  {emp.activo ? (
                    <DeleteButton onClick={() => openDeleteModal(emp)}>🚫 Desactivar</DeleteButton>
                  ) : (
                    <ActivateButton onClick={() => handleReactivate(emp)}>✅ Reactivar</ActivateButton>
                  )}
                </CardActions>
              </EmployeeCard>
            ))}
          </MobileCardContainer>
        </>
      )}

      {/* Modal Crear/Editar */}
      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)}>
            <ModalContent variants={modalVariants} initial="hidden" animate="visible" exit="exit" onSubmit={handleSaveEmployee} onClick={(e) => e.stopPropagation()}>
              <ModalTitle>{editingEmployee ? 'Editar Trabajador' : 'Nuevo Trabajador'}</ModalTitle>
              <ModalError>{modalError}</ModalError>
              
              <Label>Nombre *</Label>
              <Input 
                type="text" name="nombre" placeholder="Nombre completo del trabajador" 
                value={formData.nombre} onChange={handleInputChange}
                required autoFocus
              />

              <Label>Teléfono</Label>
              <Input 
                type="text" name="telefono" placeholder="Ej: 8888-0000 (opcional)" 
                value={formData.telefono} onChange={handleInputChange}
              />

              <Label>Cargo</Label>
              <Select name="cargo" value={formData.cargo} onChange={handleInputChange}>
                <option value="">— Sin cargo —</option>
                <option value="Vendedor">Vendedor</option>
                <option value="Bodeguero">Bodeguero</option>
                <option value="Cajero">Cajero</option>
                <option value="Repartidor">Repartidor</option>
                <option value="Administrador">Administrador</option>
                <option value="Otro">Otro</option>
              </Select>

              <ModalActions>
                <CancelButton type="button" onClick={() => setIsModalOpen(false)}>Cancelar</CancelButton>
                <SaveButton type="submit">
                  {editingEmployee ? 'Guardar Cambios' : 'Crear Trabajador'}
                </SaveButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* Modal Confirmar Desactivación */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)}>
            <ModalContent as="div" variants={modalVariants} initial="hidden" animate="visible" exit="exit" onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Confirmar Desactivación</ModalTitle>
              <p>¿Estás seguro de que quieres desactivar al trabajador <strong>{employeeToDelete?.nombre}</strong>?</p>
              <p style={{ fontSize: '0.9rem', color: '#6c757d' }}>El trabajador no se eliminará, solo se marcará como inactivo. Puedes reactivarlo después.</p>
              <ModalActions>
                <CancelButton onClick={() => setIsDeleteModalOpen(false)}>Cancelar</CancelButton>
                <DeleteButton style={{ backgroundColor: '#dc3545', color: 'white' }} onClick={confirmDelete}>Sí, Desactivar</DeleteButton>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default EmployeeManagement;
