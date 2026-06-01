# TX Men Wear — Premium Menswear E-Commerce Platform

A production-ready, modern luxury e-commerce frontend for **TX Men Wear**, built with React + Vite + TypeScript + Tailwind CSS. Fully containerized with Docker and automated with a Jenkins CI/CD pipeline.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 9+
- Docker (for containerized deployment)
- Jenkins (for CI/CD pipeline)

---

## 📦 Local Development Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

---

## 🏗️ Build for Production

```bash
cd frontend

# Type-check and build
npm run build

# Preview the production build locally
npm run preview
```

The `dist/` folder contains the static build ready to serve.

---

## 🐳 Docker Instructions

### Build the Docker Image

```bash
# From the project root
docker build -t tx-men-wear:latest ./frontend
```

### Run the Container

```bash
docker run -d \
  --name tx-men-wear-frontend \
  -p 8080:80 \
  --restart unless-stopped \
  tx-men-wear:latest
```

Open: **http://localhost:8080**

### Using Docker Compose

```bash
# From the project root
docker-compose up -d

# Rebuild and restart
docker-compose up -d --build

# Stop
docker-compose down
```

---

## 🔧 Jenkins CI/CD Setup

### 1. Prerequisites on Jenkins Server
- Docker installed and accessible by Jenkins user
- Jenkins plugins: **Pipeline**, **Git**, **Credentials Binding**

### 2. Configure Docker Hub Credentials
1. Go to: **Jenkins → Manage Jenkins → Manage Credentials**
2. Add new credentials of type: **Username with password**
3. Set the ID exactly to: `docker-hub-credentials`
4. Enter your Docker Hub username and password/access token

### 3. Create the Pipeline Job
1. **New Item** → **Pipeline**
2. Under **Pipeline**, select **Pipeline script from SCM**
3. Set SCM to **Git** and enter your repository URL
4. Set **Script Path** to `Jenkinsfile`
5. Save and click **Build Now**

### 4. Pipeline Stages Overview

| Stage | Description |
|-------|-------------|
| Checkout Code | Clones the repository and captures the git commit hash |
| Install Dependencies | Runs `npm ci` in the `frontend/` directory |
| Lint & Build | Runs ESLint and `npm run build` in parallel |
| Build Docker Image | Builds the multi-stage Docker image with labels |
| Tag Docker Image | Tags with build number, commit hash, and `latest` |
| Docker Hub Login | Authenticates using Jenkins credentials |
| Push Docker Image | Pushes all tags (3-retry mechanism) |
| Deploy Container | Stops old container, runs new one on port 8080 |
| Health Check | Verifies the app responds with HTTP 200 (5 retries) |

### 5. Environment Variables
Customize in `Jenkinsfile` env block:

| Variable | Default | Description |
|----------|---------|-------------|
| `DOCKER_IMAGE_NAME` | `txmenwear/frontend` | Docker Hub image name |
| `CONTAINER_NAME` | `tx-men-wear-frontend` | Local container name |
| `FRONTEND_PORT` | `8080` | Host port mapping |

---

## 📁 Project Structure

```
.
├── Jenkinsfile             # CI/CD pipeline
├── docker-compose.yml      # Docker Compose config
├── .gitignore
├── README.md
└── frontend/
    ├── Dockerfile          # Multi-stage Docker build
    ├── nginx.conf          # SPA-ready Nginx config
    ├── .dockerignore
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── api/            # Mock API services
        ├── assets/         # Static assets
        ├── components/     # Reusable UI components
        ├── hooks/          # Custom React hooks
        ├── layouts/        # Page layout wrappers
        ├── pages/          # Route-level page components
        ├── routes/         # React Router configuration
        ├── store/          # Zustand state stores
        └── utils/          # Types, constants, formatters
```

---

## 🎨 Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, categories, featured products, new arrivals |
| Shop | `/products` | Product grid with filters, search, sorting |
| Product Details | `/products/:id` | Image gallery, size selector, add to cart |
| Cart | `/cart` | Cart items, quantities, promo codes, totals |
| Checkout | `/checkout` | 3-step form (shipping → payment → review) |
| Login/Register | `/login` | Auth forms with social login UI |
| Admin Dashboard | `/admin` | Products table, create/edit/delete drawer |

---

## 🛒 Features

- **Dark/Light theme** — persisted in localStorage
- **Cart persistence** — cart survives page refresh via Zustand + localStorage
- **Promo codes** — try `TXMEN20`, `LUXURY15`, `WELCOME10`
- **Mock API** — realistic async delays, full CRUD simulation
- **Smooth animations** — Framer Motion throughout
- **Mobile-first** — fully responsive on all screen sizes
- **Admin panel** — manage products with real-time state updates

---

## 📄 License

MIT © TX Men Wear
