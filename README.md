# Estud-IA · Catálogo de cursos

Sitio estatico con los 36 cursos de Capa 1 y Capa 2. Sin frameworks: HTML,
CSS y JavaScript vanilla. No usa `localStorage` ni cookies.

**En línea:** <https://estudia-rust.vercel.app>

## Ya está desplegado

Esta carpeta es un repositorio de Git conectado a GitHub, y GitHub está
conectado a Vercel. **Cada `git push` a `main` vuelve a publicar el sitio**, sin
build ni comandos extra.

```
Capa 1.xlsx + Capa 2.xlsx  →  convertir_cursos.py  →  cursos.json + cursos.js
                           →  git push  →  Vercel
```

## Dónde vive cada cosa

Esta carpeta está *dentro* de otra con el mismo nombre. La de afuera guarda el
Excel y el conversor; la de adentro —esta— es el sitio y lo único que se publica:

```
Estud-IA_Catalogo_Cursos/            ← el proyecto
├── Plan estudio/
│   ├── Capa 1.xlsx                  ← la fuente real de los cursos
│   └── Capa 2.xlsx                  ← idem
├── convertir_cursos.py              ← se corre desde AQUI
└── Estud-IA_Catalogo_Cursos/        ← el sitio (este repo, lo que ve Vercel)
    ├── index.html                   ← portada del programa
    ├── capa.html                     ← catalogo de una capa
    ├── curso.html                    ← detalle de un curso
    ├── datos.js                      ← logica compartida
    ├── styles.css
    ├── cursos.json
    └── cursos.js
```

## Actualizar los cursos

**El origen es el Excel, no el JSON.** Editar `cursos.json` a mano no sirve: la
siguiente corrida del conversor lo sobrescribe.

1. Edita `Plan estudio/Capa 1.xlsx` o `Plan estudio/Capa 2.xlsx`.
2. Desde la carpeta de afuera, corre el conversor. Regenera `cursos.json` **y**
   `cursos.js` dentro del sitio, así que no hay un segundo paso que olvidar:

   ```bash
   python convertir_cursos.py
   ```

3. Publica:

   ```bash
   git add . ; git commit -m "Actualiza cursos" ; git push
   ```

Vercel detecta el push y republica en unos segundos.

## Archivos

| Archivo | Para qué |
|---|---|
| `index.html` | Portada: presentacion del programa y acceso a las dos capas. |
| `capa.html` | Catalogo de una capa. Lee la capa de `?n=1` o `?n=2`. |
| `curso.html` | Detalle de un curso. Lee el curso de `?id=`. |
| `datos.js` | Carga de datos y utilidades que comparten las tres paginas. |
| `styles.css` | Todos los estilos. |
| `cursos.json` | Los datos. **Generado desde el Excel — no editar a mano.** |
| `cursos.js` | Espejo de `cursos.json`, también generado. Ver abajo. |

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

**No hay que regenerarlo a mano:** `convertir_cursos.py` escribe los dos
archivos en la misma corrida, así que no pueden quedar desfasados.

Si no te interesa que funcione con doble clic, borra `cursos.js`: el sitio
sigue funcionando en Vercel sin tocar nada más.

## Forma de los datos

Esto es lo que produce el conversor. Sirve para entender el JSON, no para
editarlo: los cambios se hacen en el Excel.

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
- `capa` vale `1` o `2`, y es lo que separa los dos catálogos.
- `nivel` es `"basico"`, `"intermedio"` o `"avanzado"` **solo en Capa 2**. En
  Capa 1 es `null`, porque sus 18 cursos declaran que no exigen conocimiento
  previo: ahí no hay una secuencia de prerrequisitos. El filtro de nivel
  aparece únicamente cuando la capa tiene niveles.
- `orden` es la posición del curso dentro de su línea (1–3). Solo se usa para
  ordenar el listado.
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
