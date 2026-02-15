/**
 * Persistencia y sincronización de sesión de caja por USUARIO y por DÍA.
 * - Clave por día: "caja_session_${userId}_${YYYY-MM-DD}"
 * - Índice estable: "caja_session_index_${userId}" -> apunta a la clave del día vigente
 * - Sync entre pestañas con "storage"
 */

// ───────────────────────────────────────────────────────────────
// Utilidades de fecha y claves
// ───────────────────────────────────────────────────────────────

/** Día LOCAL YYYY-MM-DD (Usa el desfase del navegador para obtener la fecha local) */
const toDay = (date) => {
  const d = (date instanceof Date) ? date : new Date(date);
  
  // Calcula el desfase de la zona horaria local y lo aplica
  const offset = d.getTimezoneOffset() * 60000;
  const localDate = new Date(d.getTime() - offset);

  // Formatea a YYYY-MM-DD
  return localDate.toISOString().split('T')[0];
};

/** Clave por día para una sesión de caja de un usuario */
const dayKey = (userId, date) => `caja_session_${userId}_${toDay(date)}`;
/** Índice estable que apunta a la clave vigente del día (o la última usada) */
const indexKey = (userId) => `caja_session_index_${userId}`;
/** Prefijo para detectar eventos de otras fechas en storage */
const keyPrefix = (userId) => `caja_session_${userId}_`;

/* ──────────────────────────────────────────────────────────────
   Normalización de usuario (para que no aparezca "Usuario 3")
   ────────────────────────────────────────────────────────────── */
export const displayCajaUser = (u) => {
  if (!u) return '—';
  if (typeof u === 'string') return u;
  return (
    u.name ??
    u.nombre ??
    u.fullName ??
    u.displayName ??
    u.nombre_usuario ??
    u.username ??
    (u.id ? `Usuario ${u.id}` : '—')
  );
};

export const normalizeCajaUser = (u, fallbackId) => {
  if (!u) {
    const id = String(fallbackId ?? '').trim();
    return id ? { id, name: `Usuario ${id}` } : null;
  }
  if (typeof u !== 'object') return { name: String(u) };

  const id = String(u.id ?? fallbackId ?? '').trim();
  const name =
    u.name ??
    u.nombre ??
    u.fullName ??
    u.displayName ??
    u.nombre_usuario ??
    u.username ??
    (id ? `Usuario ${id}` : undefined);

  return {
    ...u,
    ...(id ? { id } : {}),
    ...(name ? { name } : {}),
  };
};

// ───────────────────────────────────────────────────────────────
// CARGAR / GUARDAR / LIMPIAR
// ───────────────────────────────────────────────────────────────
/**
 * Carga la sesión vigente:
 * 1) Usa índice estable si existe; 2) intenta por el día actual; 3) busca huérfanas (últimos 7 días, sin closedAt)
 */
export const loadCajaSession = (userId) => {
  if (!userId) return null;
  try {
    const idx = localStorage.getItem(indexKey(userId));
    if (idx) {
      const raw = localStorage.getItem(idx);
      if (raw) return JSON.parse(raw);
    }
    const todayRaw = localStorage.getItem(dayKey(userId, new Date()));
    if (todayRaw) return JSON.parse(todayRaw);
    return findStaleSession(userId);
  } catch (e) {
    console.error('Error al cargar la sesión de caja:', e);
    return null;
  }
};

/**
 * Guarda la sesión y actualiza índice estable. Respeta el día de openedAt si viene, o usa hoy.
 * Además, normaliza openedBy/closedBy para asegurar que tengan `name`.
 */
export const saveCajaSession = (userId, sessionObj) => {
  if (!userId || !sessionObj) return;
  try {
    const normalized = { ...sessionObj };
    if (normalized.openedBy) {
      normalized.openedBy = normalizeCajaUser(normalized.openedBy, userId);
    }
    if (normalized.closedBy) {
      normalized.closedBy = normalizeCajaUser(normalized.closedBy, normalized.closedBy?.id || userId);
    }

    const openedDate = normalized.openedAt ? new Date(normalized.openedAt) : new Date();
    const dKey = dayKey(userId, openedDate);
    localStorage.setItem(dKey, JSON.stringify(normalized));
    localStorage.setItem(indexKey(userId), dKey);
  } catch (e) {
    console.error('Error al guardar la sesión de caja:', e);
  }
};

/** Limpia la sesión del DÍA ACTUAL y el índice estable */
export const clearCajaSession = (userId) => {
  if (!userId) return;
  try {
    const todayK = dayKey(userId, new Date());
    localStorage.removeItem(todayK);
    localStorage.removeItem(indexKey(userId));
  } catch (e) {
    console.error('Error al limpiar la sesión de caja:', e);
  }
};

/**
 * Busca sesiones abiertas (sin closedAt) en los últimos 7 días.
 * Retorna la MÁS RECIENTE encontrada (si existe) y actualiza el índice para “recuperarla”.
 */
export const findStaleSession = (userId) => {
  if (!userId) return null;
  try {
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const past = new Date(today);
      past.setDate(today.getDate() - i);
      const k = dayKey(userId, past);
      const raw = localStorage.getItem(k);
      if (raw) {
        const session = JSON.parse(raw);
        if (session && !session.closedAt) {
          localStorage.setItem(indexKey(userId), k);
          return session;
        }
      }
    }
    return null;
  } catch (e) {
    console.error('Error buscando sesiones antiguas:', e);
    return null;
  }
};

// ───────────────────────────────────────────────────────────────
// SYNC ENTRE PESTAÑAS
// ───────────────────────────────────────────────────────────────
/**
 * Escucha cambios en el índice estable y en cualquier clave de caja del usuario.
 * Llama a callback con la sesión vigente.
 */
export const subscribeCajaChanges = (userId, callback) => {
  if (!userId) return () => {};
  const handler = (e) => {
    if (!e.key) return;
    const idxK = indexKey(userId);
    const prefix = keyPrefix(userId);
    if (e.key === idxK || e.key.startsWith(prefix)) {
      const s = loadCajaSession(userId);
      callback?.(s);
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

// ───────────────────────────────────────────────────────────────
// FETCH OPCIONAL DESDE SERVIDOR (para cross-device real)
// ───────────────────────────────────────────────────────────────
export async function fetchCajaSessionFromServer(userId, api) {
  if (!api?.getCajaSession || !userId) return null;
  try {
    const s = await api.getCajaSession(userId);
    if (s) {
      // Normaliza posibles usuarios antes de persistir
      if (s.openedBy) s.openedBy = normalizeCajaUser(s.openedBy, userId);
      if (s.closedBy) s.closedBy = normalizeCajaUser(s.closedBy, s.closedBy?.id || userId);
      saveCajaSession(userId, s);
      return s;
    }
    return null;
  } catch {
    return null;
  }
}

// ───────────────────────────────────────────────────────────────
// TASA DÓLAR POR USUARIO (helpers)
// ───────────────────────────────────────────────────────────────
const tasaKey = (userId) => `tasa_dolar_${userId}`;

export const saveTasaDolar = (userId, value) => {
  if (!userId) return;
  try {
    localStorage.setItem(tasaKey(userId), String(value));
    // Ping suave al índice para que otras pestañas refresquen
    const idx = localStorage.getItem(indexKey(userId));
    if (idx) localStorage.setItem(indexKey(userId), idx);
  } catch (e) {
    console.error('Error al guardar tasa dólar:', e);
  }
};

export const loadTasaDolar = (userId, fallback = 36.60) => {
  if (!userId) return Number(fallback);
  const raw = localStorage.getItem(tasaKey(userId));
  const n = Number(raw);
  return Number.isFinite(n) ? n : Number(fallback);
};

// ───────────────────────────────────────────────────────────────
// Helpers opcionales para UI (no autocierra a medianoche)
// ───────────────────────────────────────────────────────────────
export const isSessionOpen = (session) => Boolean(session && !session.closedAt);

export const getSessionOpenedDay = (session) =>
  session?.openedAt ? toDay(new Date(session.openedAt)) : null;

export const shouldWarnCrossDay = (session) => {
  if (!isSessionOpen(session)) return false;
  const openedDay = getSessionOpenedDay(session);
  const today = toDay(new Date());
  return openedDay && openedDay !== today;
};

export const pingCajaIndex = (userId) => {
  if (!userId) return;
  const idxK = indexKey(userId);
  const idx = localStorage.getItem(idxK);
  if (idx) localStorage.setItem(idxK, idx); // dispara 'storage'
};