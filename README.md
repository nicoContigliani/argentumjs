# argentumjs
# ArgentumJS - Framework Modular con Hapi.js

![ArgentumJS Logo]("https://github.com/nicoContigliani/argentumjs/blob/main/public/images/argentum.jpg?raw=true")

ArgentumJS es un framework empresarial modular de alto rendimiento, construido sobre Hapi.js. Ofrece una base sólida para el desarrollo de aplicaciones robustas y escalables, con características esenciales preconfiguradas para la producción.

## 🚀 Características Principales

- ✅ **Autenticación JWT** lista para producción
- 🗄️ **MongoDB integrado** con conexión optimizada
- 🧩 **Arquitectura modular** basada en plugins para una fácil escalabilidad y mantenimiento
- ✔️ **Validación de datos** con Joi
- 🛡️ **Manejo centralizado de errores**
- 📚 **Documentación automática** (Swagger UI integrado)
- ⚙️ **Configuración centralizada** en app.json

## 📁 Estructura del Proyecto

\`\`\`
argentumjs/
├── lib/
│   ├── config/          # Configuración core
│   └── plugins/         # Plugins core del framework
├── plugins/
│   ├── auth/            # Plugin de autenticación
│   ├── db/              # Plugin de base de datos
│   └── docs/            # Plugin de documentación
├── modules/
│   └── users/           # Módulo de usuarios (ejemplo)
├── public/
│   └── images/          # Assets públicos
├── .env                 # Variables de entorno
├── app.json             # Archivo de configuración central
└── server.js            # Punto de entrada de la aplicación
\`\`\`

## 📋 Requisitos

- Node.js 16+
- MongoDB 4.4+
- npm 8+

## 🛠️ Instalación

1. **Clonar repositorio:**
   \`\`\`bash
   git clone https://github.com/tu-usuario/argentumjs.git
   cd argentumjs
   \`\`\`

2. **Instalar dependencias:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configurar entorno:**
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. **Iniciar servidor:**
   \`\`\`bash
   npm run dev
   \`\`\`

## 🌐 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/users/register` | Registrar un nuevo usuario |
| POST | `/api/users/login` | Iniciar sesión |
| GET | `/api/users/me` | Obtener el perfil del usuario autenticado |
| GET | `/health` | Health check del sistema |
| GET | `/docs` | Interfaz Swagger UI |

## ⚙️ Configuración

Edita el archivo `app.json` para personalizar las características de tu aplicación:

\`\`\`json
{
  "features": {
    "db": {
      "active": true,
      "type": "document"
    },
    "auth": {
      "active": true,
      "jwt": {
        "secret": "${JWT_SECRET}",
        "expiresIn": "8h"
      }
    }
  }
}
\`\`\`

## 🔐 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URI` | URL de conexión a MongoDB | `mongodb://localhost:27017/argentumjs` |
| `JWT_SECRET` | Clave secreta para JWT | *(requerida)* |
| `JWT_EXPIRES_IN` | Expiración de tokens JWT | `8h` |

## 🔧 Comandos Útiles

\`\`\`bash
# Desarrollo (con reinicio automático)
npm run dev

# Producción
npm start

# Tests (próximamente)
npm test

# Linter (próximamente)
npm run lint
\`\`\`

## 🤝 Contribución

Si deseas contribuir, por favor sigue estos pasos:

1. Haz un fork del proyecto
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`)
3. Realiza tus cambios y haz commit (`git commit -am 'Añade nueva funcionalidad'`)
4. Sube tus cambios a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.

---

© Nicolás Contigliani
