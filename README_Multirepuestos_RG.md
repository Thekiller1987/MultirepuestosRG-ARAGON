# 🚗 Multirepuestos RG

Sistema web completo para la gestión de inventarios, ventas, caja, clientes y reportes de un negocio de repuestos automotrices.

## 🧩 Arquitectura General
- **Frontend:** React + Vite (desplegado en Netlify)
- **Backend:** Node.js + Express (contenedor Docker en VPS DigitalOcean)
- **Base de Datos:** MySQL 8 (contenedor Docker)
- **Proxy:** Nginx (maneja / y /api)

## ⚙️ Estructura del Proyecto
```
/srv/app
├── client/        # Frontend React
│   ├── dist/      # Archivos compilados (Netlify)
│   ├── src/api.js # Conexión a la API
│   └── netlify.toml
├── server/        # Backend Node.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
├── nginx/
│   └── nginx.conf
├── compose.yml
└── .env
```

## 🚀 Despliegue
### Frontend (Netlify)
- **Base directory:** `client`
- **Build command:** `npm run build`
- **Publish directory:** `client/dist`
- **Functions directory:** *(vacío)*

### Backend (VPS con Docker)
```bash
cd /srv/app
docker compose up -d
```

### Conexión API
- Producción: `/api` (usando proxy Netlify)
- Local: `http://127.0.0.1:3001/api`

## 🔗 Flujo de Comunicación
Frontend (Netlify) → Proxy (/api) → VPS (Nginx) → API (Node.js) → MySQL

## 🧠 Variables Importantes
```env
MYSQL_ROOT_PASSWORD=RootSegura_2025!
DB_USER=appuser
DB_PASSWORD=AppSegura_2025!
DB_DATABASE=multirepuestosrg
```

## 🧪 Pruebas Rápidas
```bash
curl -i http://134.199.195.151/api/
```
Y desde el frontend:
```
https://<tu-sitio>.netlify.app
```

## 🆘 Soporte
Para asistencia técnica futura, mencionar:  
> Sistema Multirepuestos RG (React + Node + MySQL + Docker + Netlify)

---
© 2025 Waskar — Todos los derechos reservados.
