# Tests E2E - Frontend E-Commerce

Documentación completa de los tests end-to-end implementados con Cypress para el frontend de la aplicación e-commerce.

## 📁 Estructura de Tests

```
cypress/e2e/
├── features/
│   ├── auth/
│   │   ├── login.cy.ts          # Tests de inicio de sesión
│   │   └── register.cy.ts       # Tests de registro
│   ├── products/
│   │   ├── product-form.cy.ts   # Tests del formulario de productos
│   │   ├── add-product.cy.ts    # Tests E2E de agregar producto
│   │   ├── product-list.cy.ts   # Tests de listado de productos
│   │   ├── product-card.cy.ts   # Tests de tarjetas de productos
│   │   └── product-detail.cy.ts # Tests de detalles de producto
│   ├── api/
│   │   └── error-handling.cy.ts # Tests de manejo de errores de API
│   ├── home/
│   │   └── home.cy.ts           # Tests de página principal
│   └── nav/
│       └── nav.cy.ts            # Tests de navegación
└── app.cy.ts                     # Tests generales de la app
```

## 🧪 Tests Implementados

### 1. **Login Tests** (`auth/login.cy.ts`)

Cubre el flujo completo de autenticación de usuarios:

- ✅ **Renderizado**: Verificación de formulario y elementos
- ✅ **Validación**: HTML5 validation para email y contraseña
- ✅ **Login exitoso**: Usuario regular y administrador
- ✅ **Redux Persist**: Almacenamiento de datos del usuario
- ✅ **Manejo de errores**: Credenciales inválidas, errores de red, datos incompletos
- ✅ **Loading state**: Estado de carga y prevención de doble submit
- ✅ **Navegación**: Links a register y home
- ✅ **Accesibilidad**: Labels, tipos de input, campos requeridos

**Tests totales**: ~15 casos

### 2. **Register Tests** (`auth/register.cy.ts`)

Pruebas exhaustivas del registro de usuarios:

- ✅ **Renderizado**: Formulario completo con todos los campos
- ✅ **Validación**: Campos requeridos, formato de email, contraseñas coincidentes
- ✅ **Registro exitoso**: Creación de cuenta y redirección
- ✅ **Redux Persist**: Persistencia de datos del usuario
- ✅ **Errores**: Email duplicado, contraseña débil, email inválido
- ✅ **Network errors**: Manejo de fallos de conexión
- ✅ **Loading state**: Prevención de doble submit
- ✅ **Accesibilidad**: Labels y atributos correctos

**Tests totales**: ~20 casos

### 3. **ProductForm Tests** (`products/product-form.cy.ts`)

Tests detallados del formulario de productos:

- ✅ **Renderizado**: Todos los campos del formulario
- ✅ **Categorías**: Carga desde API, toggle entre existente y nueva
- ✅ **Validación**: Campos requeridos, números positivos
- ✅ **Gestión de imágenes**: Agregar (máx 5), remover, previsualización
- ✅ **Submisión**: Envío con datos válidos, nueva categoría, imágenes por defecto
- ✅ **Errores**: Validación del servidor, errores de red
- ✅ **Loading state**: Deshabilitación de botones durante submit
- ✅ **Cancelación**: Navegación sin guardar
- ✅ **Accesibilidad**: Labels, aria-labels, campos marcados como requeridos

**Tests totales**: ~25 casos

### 4. **AddProduct E2E** (`products/add-product.cy.ts`)

Tests de integración completa para agregar productos:

- ✅ **Navegación y acceso**: Desde dashboard, control de permisos
- ✅ **Flujo completo**: Creación de producto con todos los campos
- ✅ **Nueva categoría**: Creación y refetch de categorías
- ✅ **Imágenes**: Con y sin imágenes personalizadas
- ✅ **Validación**: Campos requeridos, errores del servidor
- ✅ **Prevención de doble submit**: Loading state
- ✅ **UX**: Botón volver, previews, textos de ayuda
- ✅ **Responsive**: Mobile, tablet, desktop

**Tests totales**: ~20 casos

### 5. **API Error Handling** (`api/error-handling.cy.ts`)

Tests completos del manejo de errores de la API:

- ✅ **Errores HTTP**: 400, 401, 404, 409, 500
- ✅ **Errores de red**: Timeout, fallo completo, DNS
- ✅ **AbortController**: Cancelación de requests al navegar/desmontar
- ✅ **Validación de datos**: Campos faltantes, JSON malformado, respuesta vacía
- ✅ **Recuperación de errores**: Reintentos, limpieza de errores previos
- ✅ **Loading states**: Detención de carga tras error
- ✅ **CORS**: Manejo de errores de seguridad
- ✅ **Mensajes de error**: Backend-provided y mensajes por defecto

**Tests totales**: ~25 casos

## 📊 Cobertura Total

- **Archivos de tests**: 5 archivos nuevos/actualizados
- **Tests totales**: ~105 casos de prueba
- **Áreas cubiertas**:
  - Autenticación (login/register)
  - Gestión de productos (CRUD)
  - Manejo de errores (API y red)
  - Estados de carga
  - Validación de formularios
  - Accesibilidad
  - Responsive design

## 🚀 Ejecución de Tests

### Ejecutar todos los tests

```bash
npm run test:e2e
# o
npx cypress open
```

### Ejecutar tests específicos

```bash
# Solo tests de login
npx cypress run --spec "cypress/e2e/features/auth/login.cy.ts"

# Solo tests de productos
npx cypress run --spec "cypress/e2e/features/products/**/*.cy.ts"

# Solo tests de API
npx cypress run --spec "cypress/e2e/features/api/**/*.cy.ts"
```

### Ejecutar en modo headless (CI/CD)

```bash
npm run test:e2e:headless
# o
npx cypress run
```

## 🔧 Comandos Personalizados

### `cy.loginProgrammatic(email, role)`

Comando helper para login sin pasar por UI:

```typescript
cy.loginProgrammatic('admin@test.com', 'admin');
```

Útil para:

- Setup de tests que requieren autenticación
- Evitar repetir el flujo de login en cada test
- Pruebas de funcionalidades protegidas

## ✅ Buenas Prácticas Implementadas

1. **Organización por features**: Tests agrupados semánticamente
2. **Interceptores de red**: Mock de APIs para tests predecibles
3. **Data-testid mínimo**: Uso de IDs existentes (#email, #password, etc.)
4. **Timeouts apropiados**: Esperas configuradas según operación
5. **Cleanup**: Tests independientes sin side effects
6. **Assertions específicas**: Verificaciones precisas de comportamiento
7. **Loading states**: Verificación de estados intermedios
8. **Error scenarios**: Casos de error y edge cases cubiertos
9. **Accesibilidad**: Verificación de labels, tipos, required
10. **Responsive**: Tests en diferentes viewports

## 🎯 Mejoras Aplicadas

### Desde la implementación original:

1. **Manejo de errores robusto**:
   - `ApiError` class en `api.ts`
   - Propagación automática de errores HTTP
   - Mensajes de error consistentes

2. **Loading states**:
   - Prevención de doble submit
   - Deshabilitación de botones durante requests
   - Feedback visual apropiado

3. **AbortController**:
   - Cancelación de requests en navegación
   - Prevención de memory leaks
   - Limpieza automática

4. **Validación de datos**:
   - Verificación de campos requeridos del backend
   - Manejo de respuestas incompletas
   - Fallbacks apropiados

5. **Redux Persist**:
   - Almacenamiento correcto con `id` del usuario
   - Verificación de persistencia en tests
   - Hidratación correcta del estado

## 📝 Notas

- Los tests usan interceptores de Cypress para mockear las APIs
- No requieren backend corriendo para ejecutarse
- Los tests son independientes y pueden ejecutarse en paralelo
- Cada test limpia su estado antes y después de ejecutarse

## 🐛 Troubleshooting

### Tests fallan con "element not found"

- Agregar `{ timeout: 10000 }` a comandos cy.get()
- Verificar que los IDs/classes coinciden con el código

### Tests de login/register fallan

- Verificar que mock incluye campo `id` en data
- Confirmar estructura de respuesta del backend

### Tests de productos fallan

- Asegurar que `cy.loginProgrammatic` se llama antes
- Verificar permisos de admin en mocks

## 🔗 Referencias

- [Cypress Documentation](https://docs.cypress.io/)
- [Testing Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Routes Testing](https://docs.cypress.io/api/commands/intercept)
