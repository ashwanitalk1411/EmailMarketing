# Deployment Guide

## Production Checklist

- [ ] Set strong `JWT_SECRET` (32+ random characters)
- [ ] Use production MySQL with backups
- [ ] Configure HTTPS (SSL/TLS)
- [ ] Set `NODE_ENV=production`
- [ ] Configure SMTP with production credentials
- [ ] Set correct `FRONTEND_URL` and `NEXT_PUBLIC_API_URL`
- [ ] Never commit `.env` files

## Backend Deployment

### Environment Variables (Production)

```env
PORT=5000
NODE_ENV=production
DB_HOST=your-db-host
DB_PORT=3306
DB_USER=email_marketing_user
DB_PASSWORD=strong-db-password
DB_NAME=email_marketing
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://yourdomain.com
```

### Deploy with PM2

```bash
cd backend
npm install --production
npm run migrate
npm run seed
pm2 start src/server.js --name email-marketing-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Frontend Deployment

### Build

```bash
cd frontend
npm install
npm run build
```

### Environment

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Deploy with PM2

```bash
pm2 start npm --name email-marketing-web -- start
```

### Vercel Deployment

1. Connect repository to Vercel
2. Set root directory to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

## Database

- Enable automated backups
- Use connection pooling (configured in knexfile.js production)
- Restrict database access to application server IP

## Security

- Enable HTTPS everywhere
- Use firewall rules
- Rate limiting is enabled (200 req/15min per IP)
- Helmet.js security headers enabled
- Passwords hashed with bcrypt (12 rounds)
