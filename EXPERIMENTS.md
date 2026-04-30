# Sección Experiments — Idea & Intención

## Concepto

Una sección del CV que funciona como mini design system docs: cada experimento tiene un preview en vivo embebido, nombre, descripción de qué explora, y stack usado. Inspiración visual: Radix UI, shadcn/ui, pero con la estética del portfolio — sin el look de documentación técnica.

**Por qué "experiments" y no "projects":**
- Sin presión de producto terminado
- Sin fricciones de NDA (todo es trabajo personal)
- Muestra curiosidad, proceso y forma de pensar
- Coherente con el perfil Design Engineer: alguien que vive en el cruce de diseño y código

---

## Formato de cada ítem

```
[número]  Nombre del experimento
          Stack · Stack · Stack
          Una línea sobre qué explora o qué problema resuelve
          ┌─────────────────────────────┐
          │  preview interactivo en     │
          │  vivo, embebido en el        │
          │  mismo CV                   │
          └─────────────────────────────┘
          [Ver código ↗]  [Demo completa ↗]   (opcionales)
```

- El preview es lo primero — no una imagen, no un gif, sino el componente corriendo real
- El número sigue el mismo lenguaje visual que Experience (01, 02...)
- El stack en el mismo estilo de tags que Experience (dot-separated, muted)
- Sin descripción larga — el experimento habla por sí solo

---

## Layout

Mantener la columna máxima de 860px del resto del sitio. Cada ítem apilado verticalmente como el timeline de Experience. El preview puede ser un iframe sandbox o el componente montado directamente en React si el experimento es parte del mismo repo.

Para previews complejos o con dependencias pesadas: iframe con `sandbox` apuntando a una URL externa (CodePen, StackBlitz, o una subpágina dedicada).

---

## Ideas de contenido (candidatos)

### Alta prioridad — muy coherentes con el perfil

1. **Scroll-color unlock** — El mecanismo del propio CV (IntersectionObserver + CSS custom property `--accent`). Ya existe, solo necesita ser aislado como demo standalone.

2. **Ambient bloom** — El mouse-follow con lerp y rAF. Pequeño, elegante, muestra dominio de animación sin librerías.

3. **Stat counter** — El count-up animado con ease-out cúbico. Simple pero pulido.

4. **Typography specimen** — Una exploración tipográfica interactiva: controles de peso, tracking, line-height en tiempo real. Muestra el ojo de diseño + código juntos.

### Media prioridad — requieren algo de construcción

5. **Fluid grid explorer** — Visualizador de `clamp()` y grid fluido. Útil, educativo, muestra dominio de CSS moderno.

6. **Motion transition** — Una transición de estado de UI bien diseñada (ej. un botón que se expande a un panel, o un loading state inusual). Puente entre After Effects thinking y Framer Motion.

7. **Accessible combobox** — Un combobox construido desde cero con ARIA completo, keyboard nav, y tests. Corto pero muy poderoso como señal de calidad técnica.

8. **Token visualizer** — Un visualizador de los design tokens del CV (colores por sección, espaciados, tipografía). Meta y coherente.

### Baja prioridad — más ambiciosos

9. **Generative pattern** — Un pattern SVG o canvas generativo, quizás relacionado con el lenguaje visual del CV.

10. **Document generator** — Referencia al trabajo en T&J con JsPDF. Una demo de generación de PDF con datos ficticios.

---

## Implementación futura — notas técnicas

- La sección sigue el sistema de secciones existente: `data-section="experiments"`, `--color-experiments` en `index.css`
- Color de acento sugerido: algo en el rango warm (amber o terracota) para no colisionar con los 4 existentes
- Número de sección: **05** (actualmente Contact es 04)
- Si los experimentos son componentes React puros, montar directamente en el árbol — sin iframe
- Si tienen dependencias pesadas o son demos aisladas, usar `<iframe sandbox="allow-scripts allow-same-origin">` con lazy loading
- Considerar un `<details>` o toggle para mostrar/ocultar el código fuente inline sin salir del CV

---

## Criterio de calidad para incluir un experimento

1. Es interactivo — no una imagen estática ni un gif
2. Corre en el propio CV o en un link inmediato
3. Tiene un punto de vista claro: explora *algo específico*, no es solo "hice un componente"
4. Se puede describir en una línea

**No incluir:** proyectos de trabajo (NDA), tutoriales seguidos, cosas sin terminar que no demuestren nada concreto.
