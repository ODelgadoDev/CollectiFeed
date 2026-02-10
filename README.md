📚 LectuTrack - Tu Tracker de Lecturas
[
[
[
[

Demo en Vivo
[

Descripción del Proyecto
LectuTrack es una aplicación web moderna desarrollada con HTML5 + CSS3 + Vanilla JavaScript para tracking de lecturas (manga, libros, comics). Permite gestionar progreso dinámico, agregar notas de contexto y filtrar tu backlog de forma intuitiva.

Características principales:

CRUD completo con LocalStorage

Campos dinámicos por tipo de lectura

Filtros + buscador en tiempo real

Contadores de progreso

Modo claro/oscuro (extra especial)

Materia: Desarrollo Web Frontend
Docente: [Nombre del profe]
Última actualización: Febrero 2026

Equipo de Desarrollo:
Jesús Orlando Delgado Azar
Héctor Antonio Terrazas Guevara
Juan Arath López Alvídrez
[Tu nombre]


## Funcionalidades

| **Categoría** | **Características** | **Estados** |
|--------------|---------------------|-------------|
| 📖 **Manga** | Tomo + Página | Pendiente / Leyendo / Terminado |
| 📕 **Libro** | Capítulo (+Página opcional) | 🔁 Ciclo automático |
| 📗 **Comic** | Volumen + Página | 📊 Contadores en vivo |
| 🔍 **Filtros** | Por estado + tipo + buscador | ⚡ Tiempo real |

Funciones implementadas:

Formulario dinámico por tipo de lectura

Botón "Cambiar estado" (ciclo inteligente)

Historial persistente LocalStorage

Interfaz responsive móvil-first

🌙 Toggle claro/oscuro 

Tecnologías Utilizadas

Frontend: HTML5 - CSS3 (Variables/Grid/Flexbox) - Vanilla JS ES6+
Almacenamiento: LocalStorage API
Editor/Despliegue: StackBlitz
Tema: Tokyo Night + Light Mode

Estructura del Proyecto
LectuTrack/
├── index.html     # Interfaz principal + extras tema
├── styles.css     # Tokyo Night + light-mode toggle
├── script.js      # CRUD + filtros + LocalStorage
├── package.json   # StackBlitz runtime
└── README.md      # 📄 Esta documentación


Ejemplo de Uso

1️  Agrega "Berserk Vol. 1" (Manga)
2️  Pon Tomo 3, Página 45
3️  Nota: "Arco del Eclipse"
4️  → Se guarda + contador sube
5️  Filtra "Leyendo" → listo

Enlaces Importantes

| Recurso       | Enlace            |
| ------------- | ----------------- |
| Demo Live     | StackBlitz        |
| Editar Online | StackBlitz Editor |
| Código Fuente | Ver en StackBlitz |


