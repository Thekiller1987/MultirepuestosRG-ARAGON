import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaCheck, FaPlus, FaTrash, FaUser, FaClock, FaCheckCircle, FaRegCircle, FaArrowLeft, FaClipboardList, FaSpinner, FaEdit } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import * as api from '../service/api';

/* ─────────────────────────────────────────────────────────────────
   PREMIUM STYLES (Matching Inventory & Dashboard)
   ───────────────────────────────────────────────────────────────── */
const PageWrapper = styled.div`
  padding: 20px;
  background-color: #f8fafc;
  min-height: 100vh;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  
  @media(max-width: 640px) {
    padding: 10px;
  }
`;

const HeaderContainer = styled.div`
  display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;

  @media(min-width: 768px) { 
    flex-direction: row; justify-content: space-between; align-items: center; 
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.8rem; color: #1e293b; display: flex; align-items: center; gap: 0.75rem; margin: 0; font-weight: 800;
  svg { color: #f59e0b; }
`;

const BackButton = styled(Link)`
  display: inline-flex; align-items: center; gap: 8px;
  color: #64748b; text-decoration: none; font-weight: 600; font-size: 0.95rem;
  padding: 8px 16px; margin-bottom: 1rem; border-radius: 99px;
  background: white; border: 1px solid #cbd5e1;
  transition: all 0.2s;
  width: fit-content;
  
  &:hover { color: #3b82f6; background: #eff6ff; border-color: #bfdbfe; transform: translateX(-2px); }
`;

const InputSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
  border: 1px solid #e2e8f0;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.25rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background: #f8fafc;

  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0 2rem;
  height: 54px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  }
  
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

// Tarjeta con efecto "Glass" sutil para completadas
const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Estado Completado */
  ${props => props.completed && `
    background: #f1f5f9;
    opacity: 0.85;
    border-color: #cbd5e1;
    &:hover { opacity: 1; }
  `}

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }

  /* Borde lateral de estado */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${props => props.completed ? '#10b981' : '#f59e0b'};
  }
`;

const CardContent = styled.div`
  flex: 1;
  margin-bottom: 1.5rem;
  padding-right: 2rem; /* Espacio para el check button */
`;

const CardText = styled.p`
  font-size: 1.15rem;
  color: ${props => props.completed ? '#64748b' : '#1e293b'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  margin: 0;
  line-height: 1.5;
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9;
  font-size: 0.85rem;
  color: #64748b;
`;

const UserBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
  font-weight: 600;
  color: #475569;
`;

const TimeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
`;

const CheckBtn = styled.button`
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: white;
  border: 2px solid ${props => props.completed ? '#10b981' : '#cbd5e1'};
  color: ${props => props.completed ? '#10b981' : '#cbd5e1'};
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.completed ? '#059669' : '#3b82f6'};
    color: ${props => props.completed ? '#059669' : '#3b82f6'};
    transform: scale(1.1);
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  background: white;
  border-radius: 16px;
  border: 2px dashed #e2e8f0;
  
  svg { font-size: 3rem; margin-bottom: 1rem; opacity: 0.5; }
  p { font-size: 1.1rem; margin: 0; }
`;

const Solicitudes = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [newDesc, setNewDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const fetchRequestsData = useCallback(async () => {
    try {
      const res = await api.fetchRequests(token);
      if (res) setRequests(res);
    } catch (e) {
      console.error("Error loading requests", e);
    } finally {
      setInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchRequestsData();
    const interval = setInterval(() => {
      if (!document.hidden && !editingId) fetchRequestsData(); // Don't refresh while editing
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchRequestsData, editingId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDesc.trim()) return;

    setLoading(true);
    try {
      await api.createRequest({
        descripcion: newDesc,
        usuario_id: user?.id || user?.id_usuario,
        usuario_nombre: user?.nombre || user?.nombre_usuario || 'Usuario'
      }, token);
      setNewDesc('');
      fetchRequestsData();
    } catch (error) {
      console.error("Error adding request", error);
      alert("Error al crear solicitud");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (reqItem) => {
    const newStatus = !reqItem.check_mark;
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === reqItem.id ? { ...r, check_mark: newStatus, estado: newStatus ? 'completado' : 'pendiente' } : r));

    try {
      await api.toggleRequestStatus(reqItem.id, newStatus, token);
    } catch (error) {
      console.error("Error toggling", error);
      fetchRequestsData(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
    try {
      await api.deleteRequest(id, token);
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting", error);
      alert("Error al eliminar");
    }
  };

  const startEdit = (req) => {
    setEditingId(req.id);
    setEditValue(req.descripcion);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      await api.updateRequest(id, editValue, token);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, descripcion: editValue } : r));
      setEditingId(null);
    } catch (error) {
      console.error("Error updating", error);
      alert("Error al actualizar");
    }
  };

  const fmtDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-NI', { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageWrapper>
      <BackButton to="/dashboard">
        <FaArrowLeft /> Regresar al Dashboard
      </BackButton>

      <HeaderContainer>
        <HeaderTitle>
          <FaClipboardList /> Solicitudes de Productos
        </HeaderTitle>
        <div style={{ color: '#64748b', fontWeight: '500' }}>
          Gestiona los pedidos y requerimientos del equipo
        </div>
      </HeaderContainer>

      <form onSubmit={handleAdd}>
        <InputSection>
          <Input
            placeholder="¿Qué producto necesitas pedir? Escribe aquí..."
            value={newDesc}
            onChange={e => setNewDesc(e.target.value)}
            disabled={loading}
          />
          <AddBtn type="submit" disabled={loading}>
            {loading ? <FaSpinner className="fa-spin" /> : <><FaPlus /> Agregar Solicitud</>}
          </AddBtn>
        </InputSection>
      </form>

      {initialLoading ? (
        <EmptyState>
          <FaSpinner className="fa-spin" />
          <p>Cargando solicitudes...</p>
        </EmptyState>
      ) : (
        <Grid>
          {requests.map(req => (
            <Card key={req.id} completed={Boolean(req.check_mark)}>
              <CheckBtn
                completed={Boolean(req.check_mark)}
                onClick={() => toggleStatus(req)}
                title={req.check_mark ? "Marcar como pendiente" : "Completar solicitud"}
              >
                {req.check_mark ? <FaCheck /> : null}
              </CheckBtn>

              <CardContent>
                {editingId === req.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      style={{ padding: '8px', fontSize: '0.95rem' }}
                    />
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                      <AddBtn onClick={() => saveEdit(req.id)} style={{ height: '36px', fontSize: '0.9rem', padding: '0 1rem' }}>Guardar</AddBtn>
                      <button
                        onClick={cancelEdit}
                        style={{
                          background: 'white', border: '1px solid #cbd5e1',
                          borderRadius: '8px', padding: '0 1rem', cursor: 'pointer',
                          color: '#64748b', fontWeight: 600
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <CardText completed={Boolean(req.check_mark)}>
                    {req.descripcion}
                  </CardText>
                )}
              </CardContent>

              <CardFooter>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <UserBadge title={`ID: ${req.usuario_id}`}>
                    <FaUser size={11} /> {req.usuario_nombre || 'Desconocido'}
                  </UserBadge>
                  <TimeInfo>
                    <FaClock size={11} /> {fmtDate(req.fecha_creacion)}
                  </TimeInfo>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {!req.check_mark && editingId !== req.id && ( // Only show edit if not completed
                    <button
                      onClick={() => startEdit(req)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#3b82f6', fontSize: '1.1rem' }}
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(req.id)}
                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', fontSize: '1rem' }}
                    title="Eliminar"
                  >
                    <FaTrash />
                  </button>
                </div>
              </CardFooter>
            </Card>
          ))}

          {requests.length === 0 && (
            <EmptyState>
              <FaClipboardList />
              <p>No hay solicitudes pendientes.</p>
              <small>¡Agrega una nueva solicitud arriba!</small>
            </EmptyState>
          )}
        </Grid>
      )}
    </PageWrapper>
  );
};

export default Solicitudes;
