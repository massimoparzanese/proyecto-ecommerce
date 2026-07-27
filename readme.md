# 🛒 E-Commerce Platform

Plataforma de comercio electrónico full-stack desarrollada con tecnologías modernas, diseñada para ofrecer una experiencia de compra completa y escalable.

## 📋 Descripción

Este proyecto es una aplicación de e-commerce que permite a los usuarios navegar productos, gestionar un carrito de compras, realizar pedidos y administrar su cuenta. Incluye un panel de administración para la gestión de productos, categorías, órdenes y usuarios.

## 🎯 Características Principales

- 🔐 Autenticación y autorización de usuarios (JWT)
- 🛍️ Catálogo de productos con búsqueda y filtros
- 🛒 Carrito de compras persistente
- 💳 Proceso de checkout completo
- 📦 Gestión de órdenes y estados
- 👤 Perfiles de usuario
- 🔧 Panel de administración
- 📱 Diseño responsive con Tailwind CSS
- ⚡ Optimizado para rendimiento

## 🏗️ Arquitectura del Proyecto

```
ecommerce/
├── backend/          # API REST con Node.js + TypeScript
│   ├── src/
│   │   ├── config/       # Configuraciones
│   │   ├── controllers/  # Controladores de rutas
│   │   ├── middlewares/  # Middlewares personalizados
│   │   ├── models/       # Modelos de Mongoose
│   │   ├── routes/       # Definición de rutas
│   │   └── server.ts     # Punto de entrada
│   ├── cypress/      # Tests E2E de API
│   └── docker-compose.yml
│
└── frontend/         # Aplicación React + TypeScript
    ├── src/
    │   ├── features/     # Características por dominio
    │   │   ├── auth/         # Autenticación y autorización
    │   │   │   ├── components/
    │   │   │   ├── hooks/
    │   │   │   ├── services/
    │   │   │   └── types/
    │   │   ├── products/     # Gestión de productos
    │   │   ├── cart/         # Carrito de compras
    │   │   ├── orders/       # Órdenes y checkout
    │   │   └── admin/        # Panel de administración
    │   ├── shared/       # Código compartido
    │   │   ├── components/   # Componentes reutilizables
    │   │   ├── hooks/        # Custom hooks comunes
    │   │   ├── utils/        # Utilidades
    │   │   └── types/        # Tipos TypeScript globales
    │   ├── assets/       # Recursos estáticos
    │   ├── layouts/      # Layouts de la aplicación
    │   ├── routes/       # Configuración de rutas
    │   └── store/        # Estado global (si se usa)
    └── cypress/      # Tests E2E
```

## 🛠️ Stack Tecnológico

### Backend

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **Docker** - Containerización

### Frontend

- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS v4** - Framework CSS utility-first
- **React Router** - Navegación
- **Axios** - Cliente HTTP

### Herramientas de Desarrollo

- **ESLint** - Linter de código
- **Prettier** - Formateador de código
- **Cypress** - Testing E2E
- **tsx** - Ejecutor de TypeScript
- **ts-node-dev** - Hot reload para desarrollo

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 18.x
- Docker y Docker Compose
- pnpm

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd ecommerce
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependencias
pnpm install

# Copiar variables de entorno
cp .env.example .env

# Editar .env con tus configuraciones
# PORT=4000
# MONGO_URI=mongodb://localhost:27017/ecommerce
# JWT_SECRET=tu_secreto_aqui
# REFRESH_SECRET=tu_refresh_secreto_aqui
# CLIENT_URL=http://localhost:5173

# Levantar MongoDB con Docker
docker compose up -d

# Iniciar servidor de desarrollo
pnpm run dev
```

El backend estará disponible en `http://localhost:4000`

### 3. Configurar Frontend

```bash
cd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 📝 Scripts Disponibles

### Backend

```bash
pnpm run dev          # Iniciar servidor de desarrollo con hot-reload
pnpm run build        # Compilar TypeScript a JavaScript
pnpm start            # Iniciar servidor en producción
pnpm run lint         # Verificar código con ESLint
pnpm run lint:fix     # Corregir errores de linting automáticamente
pnpm run format       # Formatear código con Prettier
pnpm run type-check   # Verificar tipos de TypeScript
```

### Frontend

```bash
pnpm run dev          # Iniciar servidor de desarrollo
pnpm run build        # Build para producción
pnpm run preview      # Preview del build de producción
pnpm run lint         # Verificar código con ESLint
pnpm run lint:fix     # Corregir errores de linting automáticamente
pnpm run format       # Formatear código con Prettier
pnpm run type-check   # Verificar tipos de TypeScript
pnpm run cypress:open # Abrir Cypress en modo interactivo
pnpm run cypress:run  # Ejecutar tests de Cypress en modo headless
pnpm run test:e2e     # Ejecutar tests E2E completos
```

## 🧪 Testing

### Tests E2E con Cypress

**Frontend:**

```bash
cd frontend

# Modo interactivo (recomendado para desarrollo)
pnpm run cypress:open

# Modo headless (para CI/CD)
pnpm run test:e2e
```

**Backend:**

```bash
cd backend

# Tests de API
pnpm run cypress:open
```

## 🐳 Docker

### Levantar base de datos MongoDB

```bash
cd backend
docker compose up -d
```

### Comandos útiles

```bash
docker compose ps        # Ver estado de contenedores
docker compose logs -f   # Ver logs en tiempo real
docker compose stop      # Detener contenedores
docker compose down      # Detener y eliminar contenedores
docker compose restart   # Reiniciar contenedores
```

## 🔧 Variables de Entorno

### Backend (.env)

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=tu_jwt_secret_aqui
REFRESH_SECRET=tu_refresh_secret_aqui
CLIENT_URL=http://localhost:5173
```

## 📁 Estructura de Datos

### Modelos Principales

- **User**: Usuarios del sistema (clientes y administradores)
- **Product**: Productos disponibles en la tienda
- **Category**: Categorías de productos
- **Order**: Órdenes de compra
- **Cart**: Carrito de compras

## 🎨 Configuración de VSCode

El proyecto incluye configuración automática de VSCode para:

- ✅ Formateo automático al guardar
- ✅ Corrección de linting al guardar
- ✅ Autocompletado de Tailwind CSS
- ✅ IntelliSense de TypeScript

### Extensiones Recomendadas

- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- Cypress Snippets

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Estándares de Código

- Usar TypeScript strict mode
- Seguir las reglas de ESLint configuradas
- Formatear código con Prettier antes de commitear
- Escribir tests para nuevas funcionalidades
- Documentar funciones y componentes complejos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

Massimo

## 🔗 Enlaces Útiles

- [Documentación de React](https://react.dev/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de MongoDB](https://www.mongodb.com/docs/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)
- [Documentación de Cypress](https://docs.cypress.io/)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
