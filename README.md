# Proyecto Estrella

Una experiencia romántica interactiva hecha con React + Vite. Todo ocurre en una sola pantalla: un cielo nocturno renderizado con `canvas`, estrellas clickeables creadas con React y tarjetas tipo glassmorphism para revelar mensajes.

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

## Cómo editar los mensajes

Abre:

```text
src/data/messages.js
```

El array `messages` contiene las frases normales:

```js
export const messages = [
  'Desde que llegaste, hasta las noches más simples parecen tener algo especial.',
  'Hay personas que iluminan sin darse cuenta. Tú eres una de ellas.',
];
```

Puedes agregar, quitar o cambiar frases sin tocar otros archivos. La cantidad de estrellas clickeables se genera automáticamente según la cantidad de frases que haya en `messages`.

Si el array está vacío o solo tiene una frase, la experiencia sigue funcionando sin errores.

## Cómo cambiar el mensaje final

En el mismo archivo, edita `finalMessage`:

```js
export const finalMessage =
  'Me gustas. Y si tú quieres, me encantaría que esto que siento por ti se convierta en algo bonito entre los dos.';
```

La estrella final aparece después de abrir varios mensajes. Si hay menos de cuatro frases, aparece después de abrir todas. Si no hay frases, aparece al iniciar la experiencia.

## Cómo funciona

- `StarCanvas.jsx` dibuja el fondo estrellado en un `canvas` de pantalla completa.
- El canvas redibuja las estrellas al cambiar el tamaño de pantalla.
- Las estrellas normales, el parpadeo, la franja tipo Vía Láctea y las estrellas fugaces se animan con `requestAnimationFrame`.
- `InteractiveStars.jsx` crea solo las estrellas clickeables como elementos React.
- `MessageModal.jsx` muestra las tarjetas flotantes con blur y glassmorphism.
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
- El link de inspiración técnica no aparece en la página final.
