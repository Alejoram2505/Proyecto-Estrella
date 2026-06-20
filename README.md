# Proyecto Estrella

Una experiencia romántica interactiva hecha con React + Vite. Todo ocurre en una sola pantalla: un cielo nocturno renderizado con `canvas`, estrellas clickeables creadas con React y tarjetas tipo glassmorphism para revelar mini cartas.

No necesita backend, base de datos ni servicios externos. Está listo para ejecutarse localmente y desplegarse en Vercel como proyecto frontend-only.

## Tecnologías

- React
- Vite
- JavaScript
- CSS
- HTML5 Canvas

## Instalar dependencias

```bash
npm install
```

## Ejecutar localmente

```bash
npm run dev
```

Vite mostrará una URL local, normalmente:

```bash
http://localhost:5173
```

## Crear build de producción

```bash
npm run build
```

El resultado se genera en la carpeta `dist/`.

## Estructura principal

```text
src/
  App.jsx
  App.css
  main.jsx
  data/
    messages.js
  components/
    StarCanvas.jsx
    InteractiveStars.jsx
    ShootingStars.jsx
    MessageModal.jsx
```

## Cómo editar las mini cartas

Abre:

```text
src/data/messages.js
```

Las mini cartas ya no usan strings simples. Cada carta debe ser un objeto con `title` y `text`:

```js
export const messages = [
  {
    title: 'Título personalizado',
    text: 'Texto de la mini carta',
  },
];
```

Para cambiar el título de una carta, edita su propiedad `title`.

Para cambiar el texto de una carta, edita su propiedad `text`.

Si una carta no tiene `title`, el proyecto usará este fallback:

```text
Una estrella para ti
```

Si una carta no tiene `text`, el proyecto usará este fallback:

```text
Este mensaje todavía está esperando ser escrito.
```

## Cómo agregar una nueva carta

Agrega otro objeto dentro del array `messages`:

```js
export const messages = [
  {
    title: 'Primera carta',
    text: 'Texto de la primera carta',
  },
  {
    title: 'Nueva carta',
    text: 'Texto de la nueva carta',
  },
];
```

La cantidad de estrellas clickeables se genera automáticamente según la cantidad de cartas que haya en `messages`. No depende de que haya exactamente 6, 7 u 8 cartas.

Si el array está vacío o solo tiene una carta, la experiencia sigue funcionando sin errores.

## Cómo cambiar el mensaje final

En el mismo archivo, edita `finalMessage`. También debe ser un objeto con `title` y `text`:

```js
export const finalMessage = {
  title: 'Título personalizado del mensaje final',
  text: 'Texto del mensaje final',
};
```

La estrella final aparece después de abrir varios mensajes. Si hay menos de cuatro cartas, aparece después de abrir todas. Si no hay cartas, aparece al iniciar la experiencia.

## Cómo funciona

- `StarCanvas.jsx` dibuja el fondo estrellado en un `canvas` de pantalla completa.
- El canvas redibuja las estrellas al cambiar el tamaño de pantalla.
- Las estrellas normales, el parpadeo, la franja tipo Vía Láctea y las estrellas fugaces se animan con `requestAnimationFrame`.
- `InteractiveStars.jsx` crea solo las estrellas clickeables como elementos React.
- `MessageModal.jsx` muestra el título y texto de cada mini carta.
- `App.jsx` controla el estado de la experiencia, los mensajes abiertos y la aparición de la estrella final.

## Subirlo a GitHub

1. Crea un repositorio nuevo en GitHub.
2. En la terminal, desde la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Crear experiencia Proyecto Estrella"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repositorio.git
git push -u origin main
```

Si este proyecto ya estaba dentro de un repositorio Git, puedes omitir `git init`.

## Desplegar en Vercel

1. Entra a [Vercel](https://vercel.com/).
2. Inicia sesión con tu cuenta de GitHub.
3. Haz clic en **Add New Project**.
4. Selecciona el repositorio del proyecto.
5. Vercel detectará Vite automáticamente.
6. Verifica esta configuración:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

7. Haz clic en **Deploy**.

Cuando termine, Vercel te dará una URL pública para compartir la experiencia.

## Notas

- No incluye backend.
- No usa librerías pesadas.
- Está pensado para funcionar bien en móvil y desktop.
- El fondo usa `canvas` y la interfaz usa React.
- El link de inspiración técnica no aparece en la página final.
