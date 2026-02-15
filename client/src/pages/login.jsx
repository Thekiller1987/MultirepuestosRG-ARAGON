// client/src/pages/Login.jsx
import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, createGlobalStyle, css } from 'styled-components';
import { FaUser, FaLock, FaSignInAlt, FaApple, FaAndroid, FaTimes, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import * as api from '../service/api.js'; // 💡 tu api.js real

// Ruta del logo
const LOGO_PATH = '/icons/logo.png';

/* ===========================
    PALETA DE COLORES Y EFECTOS
    =========================== */
const C_BG_1 = '#0b1220';
const C_BG_2 = '#1d2b64';
const C_ACCENT = '#4A90E2';
const C_ACCENT_D = '#3B7ADF';
const C_TEXT_1 = '#e6ecff';
const C_TEXT_2 = '#99a3c4';
const GLASS_BG = 'rgba(255, 255, 255, 0.08)';
const GLASS_STROKE = 'rgba(255, 255, 255, 0.18)';

/* ===========================
    ANIMACIONES
    =========================== */
const spin = keyframes`to { transform: rotate(360deg); }`;
const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ===========================
    ESTILOS GLOBALES
    =========================== */
const GlobalStyle = createGlobalStyle`
  html, body, #root {
    height: 100%;
    margin: 0;
    font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial;
    color: ${C_TEXT_1};
    background:
      radial-gradient(1200px 800px at 15% 10%, #2b3d6d 0%, transparent 60%),
      radial-gradient(900px 600px at 85% 90%, #18325b 0%, transparent 60%),
      linear-gradient(135deg, ${C_BG_1} 0%, ${C_BG_2} 100%);
    -webkit-tap-highlight-color: transparent;
    
    // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste de scroll en móvil
    @media (max-width: 768px) {
        // Esto asegura que el fondo y el scroll se manejen bien en pantallas pequeñas
        min-height: 100vh;
        min-height: 100dvh; /* Para Safari y Chrome móvil */
    }
    // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
  }
`;

/* ===========================
    CONTENEDORES Y ESTRUCTURA
    =========================== */
const Stage = styled.main`
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste de padding en móvil
  @media (max-width: 768px) {
    padding: 16px; 
    // Evita que el teclado virtual empuje el contenido si el foco está en un input
    align-items: flex-start; 
    padding-top: 5vh; 
    padding-bottom: 5vh;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;

const AnimatedBackdrop = styled.div`
  position: absolute;
  inset: -20%;
  background: linear-gradient(-45deg, #4674ff, #3f7efb, #21c8f6, #7f53ac);
  filter: blur(72px) saturate(120%);
  opacity: 0.13;
  background-size: 400% 400%;
  animation: ${gradientFlow} 22s ease infinite;
  animation-play-state: ${p => (p.$paused ? 'paused' : 'running')};
  pointer-events: none;
`;

const Card = styled.form`
  width: min(440px, 94vw);
  background: ${GLASS_BG};
  border: 1px solid ${GLASS_STROKE};
  border-radius: 28px;
  backdrop-filter: ${p => (p.$typing ? 'saturate(120%) blur(6px)' : 'saturate(120%) blur(14px)')};
  -webkit-backdrop-filter: ${p => (p.$typing ? 'saturate(120%) blur(6px)' : 'saturate(120%) blur(14px)')};
  box-shadow:
    0 18px 48px rgba(0,0,0,0.42),
    inset 0 1px 0 rgba(255,255,255,0.08);
  padding: clamp(22px, 5.2vw, 34px);
  display: grid;
  gap: clamp(12px, 2.8vw, 18px);
  animation: ${fadeUp} .5s ease both;
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Ajuste del formulario en móvil
  @media (max-width: 768px) {
      width: 100%; /* Ocupa todo el ancho en móvil */
      max-width: 400px; 
      padding: 24px;
      margin-top: auto; /* Permite centrar mejor si Stage tiene flex */
      margin-bottom: auto;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;

const LogoWrap = styled.div`
  display: grid;
  place-items: center;
  padding: 14px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
`;

const Logo = styled.img`
  width: clamp(120px, 42vw, 180px);
  height: auto;
  display: block;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.35));
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Logo ligeramente más pequeño en móvil
  @media (max-width: 480px) {
    width: 100px; /* Tamaño fijo en móvil muy pequeño */
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;

const Title = styled.h2`
  margin: 2px 0 0;
  font-size: clamp(1.5rem, 4.8vw, 1.9rem);
  text-align: center;
  font-weight: 800;
`;

const Subtitle = styled.p`
  margin: -2px 0 6px;
  color: ${C_TEXT_2};
  text-align: center;
  font-size: clamp(.9rem, 3.4vw, .95rem);
`;

/* ===========================
    CAMPOS
    =========================== */
const Field = styled.label`
  display: grid;
  grid-template-columns: 42px 1fr;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.14);
  transition: box-shadow .25s ease, border-color .25s ease, background .25s ease;
  &:focus-within {
    background: rgba(255,255,255,0.08);
    border-color: rgba(118,166,255,0.6);
    box-shadow: 0 0 0 3px rgba(74,144,226,0.25);
  }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Padding más generoso en móvil
  @media (max-width: 768px) {
    padding: 14px 10px;
    border-radius: 18px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;
const IconBox = styled.span`
  display: grid;
  place-items: center;
  font-size: 18px;
  color: ${C_TEXT_2};
`;
const Input = styled.input`
  border: none;
  outline: none;
  background: transparent;
  color: ${C_TEXT_1};
  font-size: 16px;
  padding: 8px 2px;
  &::placeholder { color: ${C_TEXT_2}; }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Fuente un poco más grande en móvil
  @media (max-width: 768px) {
    font-size: 17px; 
    padding: 6px 2px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;
const Error = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 12px;
  font-size: .92rem;
  text-align: center;
  color: #ffe6eb;
  background: rgba(255,70,104,0.12);
  border: 1px solid rgba(255,70,104,0.35);
`;

/* ===========================
    BOTÓN
    =========================== */
const Button = styled.button`
  display: grid;
  grid-auto-flow: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 14px 18px;
  border-radius: 16px;
  border: none;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  background: linear-gradient(180deg, ${C_ACCENT} 0%, ${C_ACCENT_D} 100%);
  box-shadow: 0 14px 24px rgba(74,144,226,0.35);
  transition: all .25s ease;
  &:hover { filter: brightness(1.05); }
  &:disabled { opacity: .6; cursor: not-allowed; }
  
  // 💡 INICIO CÓDIGO AÑADIDO/MODIFICADO: Botón más grande en móvil
  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 17px;
    border-radius: 18px;
  }
  // 💡 FIN CÓDIGO AÑADIDO/MODIFICADO
`;
const Spinner = styled(FaSpinner)`animation: ${spin} 1s linear infinite;`;

/* ===========================
    PROMPT PWA
    =========================== */
const PwaPrompt = styled.div`
  position: fixed;
  left: 12px; right: 12px;
  bottom: 16px;
  background: ${GLASS_BG};
  border: 1px solid ${GLASS_STROKE};
  backdrop-filter: blur(14px);
  border-radius: 18px;
  padding: 14px;
  z-index: 50;
  box-shadow: 0 18px 40px rgba(0,0,0,0.45);
  animation: ${fadeUp} .35s ease both;
  @media (min-width: 768px) { display: none; }
`;
const PwaHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  font-weight: 800; color: ${C_TEXT_1};
  margin-bottom: 6px;
  svg { cursor: pointer; color: ${C_TEXT_2}; }
`;
const PwaText = styled.p`
  margin: 0 0 10px;
  color: ${C_TEXT_2};
  font-size: .95rem;
`;
const PwaButton = styled.button`
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 14px;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(180deg, ${C_ACCENT} 0%, ${C_ACCENT_D} 100%);
  box-shadow: 0 12px 22px rgba(74,144,226,.35);
`;

/* ===========================
    COMPONENTE PRINCIPAL
    =========================== */
const Login = () => {
  const { login } = useAuth(); // del AuthContext
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [pwaPlatform, setPwaPlatform] = useState(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // 💡 INICIO CÓDIGO MODIFICADO: Lógica de PWA Prompt
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    // isStandalone será TRUE si la app se abrió desde el icono de la PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone; // Soporte para iOS viejo

    // Solo mostramos el prompt si es Android/iOS Y NO está en modo standalone (es decir, está en el navegador)
    if ((isIOS || isAndroid) && !isStandalone) {
      setPwaPlatform(isIOS ? 'ios' : 'android');
      setShowPwaPrompt(true);
    } else {
        // Ocultar si ya está instalada o no es un móvil compatible con el prompt nativo
        setShowPwaPrompt(false);
    }
    // 💡 FIN CÓDIGO MODIFICADO
  }, []);

  // ✅ Lógica corregida
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login({ nombre_usuario: username, password });
      const token = data?.token ?? data?.accessToken ?? data?.data?.token ?? null;
      const user = data?.user ?? data?.usuario ?? data?.data?.user ?? null;
      if (!token || !user) throw new Error('Respuesta de login inválida');
      await login(user, token); // AuthContext maneja todo
    } catch (err) {
      const msg = err?.message?.includes('401')
        ? 'Credenciales inválidas.'
        : err?.message || 'Error al conectar con el servidor.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Stage>
        <AnimatedBackdrop $paused={typing} />
        <Card onSubmit={handleSubmit} $typing={typing}>
          <LogoWrap>
            <Logo src={LOGO_PATH} alt="Logo Multirepuestos RG" />
          </LogoWrap>

          <Title>Acceso al Sistema</Title>
          <Subtitle>Introduce tus credenciales de usuario para ingresar.</Subtitle>

          {error && <Error>{error}</Error>}

          <Field>
            <IconBox><FaUser /></IconBox>
            <Input
              type="text"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onFocus={() => setTyping(true)}
              onBlur={() => setTyping(false)}
              required
              disabled={loading}
              autoComplete="username"
              spellCheck={false}
            />
          </Field>

          <Field>
            <IconBox><FaLock /></IconBox>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setTyping(true)}
              onBlur={() => setTyping(false)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </Field>

          <Button type="submit" disabled={loading}>
            {loading ? <Spinner /> : <FaSignInAlt />}
            {loading ? 'Cargando…' : 'Ingresar'}
          </Button>
        </Card>

        {showPwaPrompt && (
          <PwaPrompt>
            <PwaHeader>
              <span>¡Descarga MultirepuestosRG! 📲</span>
              <FaTimes onClick={() => setShowPwaPrompt(false)} />
            </PwaHeader>
            <PwaText>
              {pwaPlatform === 'ios'
                ? 'Para instalar la app, toca el botón de Compartir (⬆️) y luego “Añadir a pantalla de inicio”.'
                : 'Toca el menú (⋮) de tu navegador y luego “Instalar aplicación”.'}
            </PwaText>
            <PwaButton onClick={() => setShowPwaPrompt(false)}>
              {pwaPlatform === 'ios' ? <FaApple /> : <FaAndroid />}
              {pwaPlatform === 'ios' ? 'Entendido' : 'Instalar ahora'}
            </PwaButton>
          </PwaPrompt>
        )}
      </Stage>
    </>
  );
};

export default Login;