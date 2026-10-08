# Estud-IA · Catálogo de cursos

Sitio estático con los 18 cursos de Capa 1. Sin frameworks: HTML, CSS y
JavaScript vanilla. No usa `localStorage` ni cookies.

## Deploy en Vercel en 3 pasos

1. **Instala la CLI** (una sola vez, necesita Node.js):

   ```bash
   npm install -g vercel
   ```

2. **Entra a esta carpeta y despliega:**

   ```bash
   cd Estud-IA_Catalogo_Cursos
   vercel
   ```

   Acepta las respuestas por defecto. Cuando pregunte *In which directory is
   your code located?* responde `./`. No hay build: Vercel detecta un sitio
   estático y sube los archivos tal cual.

3. **Publica en producción:**

   ```bash
   vercel --prod
   ```

   Te devuelve la URL definitiva.

> **Alternativa sin consola:** sube esta carpeta a un repositorio de GitHub y en
> [vercel.com/new](https://vercel.com/new) impórtala. Deja *Framework Preset* en
> **Other** y *Build Command* vacío. Cada `git push` vuelve a desplegar.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Catálogo con los filtros por línea de formación. |
| `curso.html` | Detalle de un curso. Lee el curso de `?id=`. |
| `styles.css` | Todos los estilos. |
| `cursos.json` | **Los datos. Es el único archivo que editas.** |
| `cursos.js` | Espejo generado de `cursos.json`. Ver abajo. |

La URL de un curso es `curso.html?id=` seguido del campo `id` del JSON:

```
curso.html?id=fundamentos-programacion-python
```

Si ese `id` no existe, la página muestra «Curso no encontrado» con un enlace de
regreso al catálogo.

## Para qué existe `cursos.js`

El sitio tenía que cumplir dos cosas a la vez: cargar los datos con `fetch()`
y **también** funcionar abriendo `index.html` con doble clic, sin servidor.

Eso no se puede con un solo archivo. Todos los navegadores bloquean `fetch()`
por CORS cuando la página viene de `file://`, así que abriendo el archivo
directo el `fetch` falla siempre.

La solución: `cursos.json` se carga con `fetch()`, que es lo que corre en
Vercel. Si el `fetch` falla, el sitio carga `cursos.js`, que es el mismo
contenido envuelto en una asignación (`window.__CURSOS__ = {...}`) y sí se
puede cargar desde `file://` con una etiqueta `<script>`.

**Editas solo `cursos.json`.** Después regeneras el espejo con esta línea:

```bash
node -e "const fs=require('fs');const d=fs.readFileSync('cursos.json','utf8');JSON.parse(d);fs.writeFileSync('cursos.js','// Generado desde cursos.json. No editar a mano.\n'+'window.__CURSOS__ = '+d+';\n')"
```

Si olvidas regenerarlo, en Vercel no pasa nada (allí nunca se usa); solo
quedaría desactualizado al abrir los archivos en local.

Si no te interesa que funcione con doble clic, borra `cursos.js`: el sitio
sigue funcionando en Vercel sin tocar nada más.

## Cambiar los datos

`cursos.json` tiene la forma:

```json
{
  "cursos": [
    {
      "id": "fundamentos-programacion-python",
      "categoria": "programacion",
      "orden": 1,
      "nombre": "Fundamentos de programación con Python",
      "descripcion": "…",
      "duracion": "60 horas",
      "modalidad": "Virtual (sincrónico y asincrónico)",
      "herramientas": ["Google Colab", "draw.io"],
      "perfil_entrada": "…",
      "perfil_salida": "…",
      "ruta_platzi": null,
      "base_conceptual": null,
      "modulos": [
        { "titulo": "M1 - Lógica y algoritmos", "contenidos": ["…", "…"] }
      ]
    }
  ]
}
```

Notas:

- `categoria` alimenta los filtros. Los nombres visibles están en la constante
  `LINEAS`, al inicio del `<script>` de cada HTML. Si agregas una categoría al
  JSON sin registrarla ahí, el filtro aparece igual, usando la clave como
  etiqueta.
- `orden` es la posición del curso dentro de su línea, **no un nivel ni una
  secuencia de prerrequisitos**: los 18 cursos de Capa 1 declaran que no exigen
  conocimiento previo. Solo se usa para ordenar el listado.
- `ruta_platzi` y `base_conceptual` están en `null` porque esas celdas vienen
  vacías en el Excel de origen. Hoy el sitio no las muestra.
- `herramientas` y `contenidos` son listas; el sitio las recorre, así que
  agregar o quitar elementos no requiere tocar el código.

## Ver el sitio en local

Doble clic en `index.html` funciona. Si prefieres servirlo, con Python:

```bash
python -m http.server 8000
```

y abre `http://localhost:8000`.
