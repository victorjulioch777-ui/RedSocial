# Red Social

## Descripción del Proyecto

Red Social es una plataforma web moderna diseñada para conectar usuarios, permitiéndoles compartir contenido, interactuar con otros miembros de la comunidad y mantenerse actualizados con las novedades de sus contactos. La aplicación proporciona una experiencia de usuario intuitiva y responsive.

## Características Principales

- 👥 **Perfil de Usuario** - Crea y personaliza tu perfil con foto e información
- 📝 **Publicaciones** - Comparte textos, imágenes y contenido multimedia
- ❤️ **Interacciones** - Dale "me gusta" y comenta en publicaciones
- 🔗 **Seguir Usuarios** - Conecta con otros miembros de la comunidad
- 💬 **Mensajería** - Comunícate directamente con otros usuarios
- 🔔 **Notificaciones** - Recibe alertas de actividad en tu cuenta
- 🎨 **Interfaz Responsive** - Acceso desde dispositivos móviles, tablets y computadoras

## Tecnologías Utilizadas

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Responsive Design

- **Backend:**
  - Node.js (opcional)
  - Base de datos (opcional)

- **Herramientas:**
  - Git para control de versiones
  - GitHub para repositorio

## Instalación

### Requisitos Previos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Git instalado en tu máquina

### Pasos de Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/victorjulioch777-ui/RedSocial.git
   cd RedSocial
   ```

2. **Abrir la aplicación:**
   - Opción 1: Abre el archivo `index.html` directamente en tu navegador
   - Opción 2: Usa un servidor local:
     ```bash
     python -m http.server 8000
     # o si tienes Python 2
     python -m SimpleHTTPServer 8000
     ```
   - Luego accede a `http://localhost:8000` en tu navegador

## Uso

1. **Crear Cuenta** - Registrate con tu correo electrónico y contraseña
2. **Completar Perfil** - Añade tu foto, biografía e información personal
3. **Explorar** - Navega por el feed y descubre contenido de otros usuarios
4. **Interactuar** - Dale "me gusta" a publicaciones y deja comentarios
5. **Seguir** - Sigue a usuarios cuyos contenidos te interesen
6. **Compartir** - Publica tu propio contenido
7. **Conectar** - Envía mensajes directos a otros usuarios

## Estructura del Proyecto

```
RedSocial/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos de la aplicación
├── js/
│   └── script.js       # Lógica de la aplicación
├── assets/
│   └── images/         # Imágenes y recursos
├── README.md           # Este archivo
└── .gitignore          # Archivos ignorados por Git
```

## Características Futuras

- [ ] Integración con base de datos
- [ ] Sistema de autenticación mejorado
- [ ] Búsqueda avanzada
- [ ] Hashtags y trending topics
- [ ] Historias (stories)
- [ ] Sistema de recomendaciones
- [ ] Notificaciones en tiempo real
- [ ] Aplicación móvil nativa

## Contribuir

¿Tienes ideas para mejorar Red Social? ¡Nos encantaría contar con tu ayuda!

1. Fork el repositorio
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Autor

**Victor Julio Ch.**
- GitHub: [@victorjulioch777-ui](https://github.com/victorjulioch777-ui)

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---

**¡Gracias por usar Red Social! Si tienes preguntas o sugerencias, no dudes en abrir un issue o contactarme.**

## Login academico y rutas protegidas

Credenciales de prueba:

- Usuario: victor
- Contrasena: 1234

En un proyecto real las contrasenas no se guardan como texto plano; deben cifrarse con una herramienta como bcrypt.

### Carpetas y archivos creados

- config/testUser.js: credenciales academicas de prueba.
- controllers/auth.controller.js: muestra login, valida credenciales y cierra sesion.
- middlewares/auth.middleware.js: protege rutas con la cookie autenticado.
- routes/auth.routes.js: rutas /login y /logout.
- routes/page.routes.js: rutas /, /home, /write y /posts.
- views/: contiene login.html, index.html, write.html y posts.html.
- public/css/login.css: estilos de la pantalla de login.
- public/js/login.js: validacion del formulario y mensajes de error.

### Archivos movidos

Se movieron estos archivos desde public/html hacia views:

- public/html/index.html -> views/index.html
- public/html/write.html -> views/write.html
- public/html/posts.html -> views/posts.html

La carpeta public queda solo para CSS, JavaScript, imagenes y archivos estaticos.

### Enlaces actualizados

Las paginas protegidas usan rutas de Express:

- /home
- /write
- /posts
- /logout

Los recursos del navegador usan rutas publicas absolutas:

- /css/global.css
- /css/index.css
- /css/write.css
- /css/posts.css
- /css/login.css
- /js/write.js
- /js/posts.js
- /js/login.js

### Paquetes y comandos

Los paquetes necesarios son express, chalk, node-emoji, morgan y cookie-parser. path no se instala porque es un modulo nativo de Node.js.

Si falta alguna dependencia, ejecuta:

npm install express chalk node-emoji morgan cookie-parser

Para iniciar el servidor:

npm start

Para usar otro puerto:

node app.js 4000

Tambien puedes usar los scripts:

npm run start:3000
npm run start:4000

O en modo desarrollo:

npm run dev

Luego abre:

http://localhost:3000

### Casos de prueba manuales

CASO 1: Login correcto

1. Entra a http://localhost:3000
2. Escribe usuario victor y contrasena 1234.
3. Resultado esperado: se crea la cookie autenticado, se redirige a /home y puedes abrir /write y /posts.

CASO 2: Contrasena incorrecta

1. Escribe usuario victor y contrasena incorrecta.
2. Resultado esperado: no se crea cookie, sigues en login y aparece Usuario o contraseña incorrectos.

CASO 3: Campos vacios

1. Deja usuario o contrasena vacios.
2. Resultado esperado: el formulario no se envia y aparece Ambos campos son obligatorios.

CASO 4: Acceso sin autenticacion

1. Sin iniciar sesion, abre http://localhost:3000/home
2. Repite con http://localhost:3000/write y http://localhost:3000/posts
3. Resultado esperado: siempre redirige a /login.

CASO 5: Cerrar sesion

1. Inicia sesion y abre http://localhost:3000/logout
2. Resultado esperado: se elimina la cookie, redirige a /login y ya no puedes abrir /home, /write o /posts.

CASO 6: Expiracion de cookie

1. Inicia sesion y espera mas de 10 minutos.
2. Intenta abrir /home, /write o /posts.
3. Resultado esperado: la cookie expira y el servidor redirige a /login.

### Revisar la cookie en el navegador

1. Abre las herramientas de desarrollador.
2. Entra a Application o Storage.
3. Busca Cookies y selecciona http://localhost:3000.
4. Verifica que exista autenticado despues del login.
5. Confirma que tenga HttpOnly, SameSite=Lax y expiracion aproximada de 10 minutos.


## Importante sobre Go Live

Go Live solo sirve archivos HTML, CSS e imagenes. No ejecuta Express, por eso el login, las cookies y las rutas /login, /home, /write y /posts no funcionan correctamente con Go Live.

Para probar la aplicacion completa debes ejecutar:

npm start

Y abrir:

http://localhost:3000

Si Go Live ya esta usando el puerto 3000, cierralo o usa otro puerto para Express:

node app.js 4000

Los HTML dentro de views pueden verse con Go Live solo como vista estatica, porque ahora sus estilos apuntan tambien a /public/css y la imagen a /public/imagenes.
