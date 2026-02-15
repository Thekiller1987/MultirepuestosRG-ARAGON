# Despliegue en DigitalOcean (frontend en Netlify + backend+MySQL+Nginx en VPS)

## 1) Estructura esperada en el VPS
/srv/app
  compose.yml
  .env                <- crea este tomando como base .env.example (NO subas a Git)
  nginx/default.conf
  server/             <- tu carpeta backend (clonada desde tu repo)

## 2) Preparación local
- Guarda este bundle y edita `.env.example` con tus valores (luego renómbralo a `.env` solo en el VPS).
- Asegúrate de que tu backend arranca con `node server.js` (si tu archivo es app.js cambia el CMD del Dockerfile).

## 3) En el VPS (Ubuntu 22.04/24.04)
sudo apt update
curl -fsSL https://get.docker.com | sh
sudo apt-get install -y docker-compose-plugin

sudo mkdir -p /srv/app && sudo chown $USER:$USER /srv/app
cd /srv/app

# Clona solo tu backend en /srv/app/server
git clone <URL_DE_TU_REPO> server

# Sube archivos de este bundle
# (desde tu PC) scp compose.yml usuario@IP_VPS:/srv/app/
# (desde tu PC) scp -r nginx usuario@IP_VPS:/srv/app/
# (desde tu PC) scp .env usuario@IP_VPS:/srv/app/

# Levanta
docker compose up -d --build
docker compose ps

## 4) Probar
http://IP_DEL_VPS/health        -> ok
http://IP_DEL_VPS/api/health    -> { ok: true }

## 5) Importar base de datos (opcional)
# Copia empresa.sql a /srv/app en el VPS
docker ps   # identifica el contenedor mysql (db)
docker exec -i <NOMBRE_CONTENEDOR_DB> mysql -u$DB_USER -p$DB_PASSWORD $DB_DATABASE < /srv/app/empresa.sql

## 6) Frontend (Netlify)
- Base directory: client
- Build command: npm run build
- Publish directory: dist  (o build si usas CRA)
- Variable: VITE_API_URL=https://tu-dominio.com/api  (o http://IP/api mientras no tengas SSL)

## 7) Deploys futuros
En tu PC:
  git add . && git commit -m "cambios" && git push
En el VPS:
  cd /srv/app/server && git pull
  cd /srv/app && docker compose up -d --build

## 8) HTTPS cuando tengas dominio
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx
