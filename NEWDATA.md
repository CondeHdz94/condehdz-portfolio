Nombre: Juan Camilo Conde Hernández
Título universitario: Multimedia Engineer
Resumen de presentación: "Building at the intersection of design and code. 5+ years crafting digital experiences across fintech, edtech and beyond."
Lema:"The best way to face challenges is with an open mind and an insatiable curiosity."

#sobre mi (contrarresta entre el about me actual)

Frontend Developer/Design Engineer with a Multimedia Engineering background, passionate about the intersection of design and code. I care deeply about user interaction, UX, usability, and HCI — and I bring that sensibility directly into every interface I build.

5+ years of professional experience crafting scalable, component-driven UIs with JavaScript, TypeScript, React, HTML, CSS, SASS and Tailwind. I work fluidly across the full design-to-production pipeline — from Figma prototypes to tested, production-ready code — with experience in Jest and Testing Library. Basic backend knowledge in SQL, PHP, and Python rounds out my stack.

A background in digital graphic design, motion graphics, character creation, and video post-production — using tools like the Adobe suite (Photoshop, Illustrator, After Effects, Premiere Pro) — gives me a sharp visual eye that directly elevates the quality and polish of the products I work on.

Collaborative, curious, and continuously learning — especially at the intersection of design systems, developer experience, and user-centered products.

No se si mostrar cosas como: 
05+ Years experience
20+ Completed projects
03+ Companies worked

#Skill

Para el tema de Skills debes validar la info y a que sección pertenecen.

No sé si implementar iconos o dejarlo plano

#Experiencia

##UNI2 Microcrédito
Desarrollador de front-end

UNI2 Microcrédito · Jornada completa

nov. 2021 - actualidad · 4 años 6 meses

Cali, Valle del Cauca, Colombia

Desarrollador Frontend para el aplicativo web del core bancario UNI2, implementado las tecnologías de React, Redux, Boostrap, HTML y SCSS. Actualizando y generando nuevas características tales como:
* Automatización de procesos
* Soporte a necesidades del aplicativo
* Mejoras de interacción, diseño y estilo
* Implementación de metodologías
* Actualización y reestructuración de código

Desarrollando un sistema de diseño para la plataforma respetando las normas de la marca y validando temas de accesibilidad. 

Mantenimiento, validación y actualización de librerías del Frontend usadas en la plataforma.

* También estoy creando un nuevo aplicativo que soporta diferentes empresas con foco en arquitectura de aplicaciones React + TypeScript a escala. En el último año lideré la construcción del frontend de gestión de solicitudes de crédito de Uni2Lite — una aplicación que no es un CRUD más, sino un orquestador de procesos multi-step con estados editables y de consulta, integrado contra un workflow backend con acciones paramétricas.
                                                                                                                                        
  Lo que diseñé y construí:                                                                                                             
   
  - Arquitectura por capas con flujo de dependencias unidireccional — Feature-Sliced Design adaptado: pages → processes → steps →       
  features → domains → components. Las violaciones de capa son bloqueantes en revisión. Esto permite que un step (pre-aprobador,
  info-cliente, info-crédito, info-contacto, autorización de datos, documentos, asegurabilidad) sea reutilizable en cualquier proceso   
  futuro sin tocar su código.                                                      
  - Sistema de formularios declarativo — los formularios no se escriben en JSX. Se configuran como FieldConfig[] y un builder genera el
  schema Zod con mensajes en español, que alimenta React Hook Form. Soporta crossFieldRefines, dependencias entre campos, y secciones.  
  Resultado: agregar un campo nuevo en un step es una línea de config, no un PR de 200 líneas.
  - Motor de stepper desacoplado — progressBar.store (Zustand) maneja el estado del proceso. Dos patrones de registro:                  
  useFormStepHandler para steps con RHF, y registerSubmitHandler directo para flujos custom (upload de documentos, OTP polling). El     
  componente de navegación progress-navigation ya se desacopló de credit-application para servir a futuros procesos.
  - Modo dual edit/visual/consult en el mismo flujo — el mismo CreditApplicationFlow recibe un prop mode y decide qué variante de step  
  renderizar y qué acciones exponer. Esto evitó duplicar todo el árbol de componentes para el módulo de búsqueda y consulta de          
  solicitudes (credit/search) que se montó después.
  - Capa de servicios robusta — Axios con interceptores en cadena (logger → error → auth), refresh proactivo de token antes de expirar, 
  retry transparente en 401, headers Authorization y Role-Id inyectados automáticamente. React Query encima para cache de servidor;     
  Zustand sólo para estado de cliente — separación que evita el antipatrón de duplicar estado.
  - Tabla de datos genérica (SmartTable) — paginación, sorting y filtros server-side, configurable por columna, con renderers custom    
  (StatusCell con mutaciones optimistas, columna de responsable, popovers de acción).                                                   
   
  componente de navegación progress-navigation ya se desacopló de credit-application para servir a futuros procesos.
  - Modo dual edit/visual/consult en el mismo flujo — el mismo CreditApplicationFlow recibe un prop mode y decide qué variante de step
  renderizar y qué acciones exponer. Esto evitó duplicar todo el árbol de componentes para el módulo de búsqueda y consulta de
  solicitudes (credit/search) que se montó después.
  - Capa de servicios robusta — Axios con interceptores en cadena (logger → error → auth), refresh proactivo de token antes de expirar,
  retry transparente en 401, headers Authorization y Role-Id inyectados automáticamente. React Query encima para cache de servidor;
  Zustand sólo para estado de cliente — separación que evita el antipatrón de duplicar estado.
  - Tabla de datos genérica (SmartTable) — paginación, sorting y filtros server-side, configurable por columna, con renderers custom
  (StatusCell con mutaciones optimistas, columna de responsable, popovers de acción).

  Stack productivo: React 18, TypeScript estricto, Vite, TailwindCSS 4, Zustand 5, React Query 5, Zod, React Hook Form, Framer Motion,
  react-router 7, react-imask.

  Cómo trabajo: Convenciones como ley (kebab-case, PascalCase, barrel exports, @/ paths). Las decisiones se justifican con tradeoffs
  explícitos, no con preferencias. Cuando algo está mal, lo digo con evidencia técnica; cuando me equivoco, lo reconozco con la misma
  evidencia. Prefiero entender el patrón antes de escribir la implementación.

  Lo que busco es un equipo donde la arquitectura no sea decoración — donde el flujo de dependencias se respete, las abstracciones se
  justifiquen, y el código declarativo le gane al imperativo por defecto.

JavaScript, Desarrollo front end y 5 aptitudes más

##TAYLOR & JOHNSON INTERNATIONAL, INC.
Ingeniero multimedia

TAYLOR & JOHNSON INTERNATIONAL, INC. · Jornada completa

dic. 2018 - oct. 2021 · 2 años 11 meses

Cali, Valle del Cauca, Colombia

* Actualización a entorno web de un core bancario en interfaz 5250 (pantalla verde) usando la herramienta Presto de Fresche Solutions mediante los lenguajes de HTML, Javascript (JQuery) y CSS.

* Test Automation -> Sería Python en automatización de pruebas usando Selenium y ruta parametrizable a partir del consumo de un web service. eran pruebas P2P y para la automatización de procesos generadores de documentos o llenar información a partir del consumo de información (API y su data).


* Digital Signature Integration -> Integración de firmas digitales sobre la herramienta Presto de Fresche Solutions usando dispositivos TOPAZ LCD para manejos de firmas en documentos. eliminando procesos basados en papel y garantizando la integridad legal de los datos directamente en el ERP. Con esa actualización ahora ya el core bancaría tenía acceso a esa funcionalidad.
Case 04: Esto no es Test Automation, es Process Automation / Data Migration. Usaste Selenium como robot de entrada de datos para migrar registros de tu sistema 
  al de un cliente externo, parametrizado desde la fuente de datos. El nombre actual en el código es engañoso — lo cambiaría a algo como Automated Data Migration 
  o Process Automation.


* Parametric Document Generation -> Generación parametrizable de documentos mediante la librería JsPdf.js usando consultas SQL o web services con una estructura predefinida. En este proyecto. La idea es que a partir de una estructura que se definió de manera consolidada por la parte del equipo de COBOL y yo, se logró crear que desde el la AS400 pudieran generar documentos más estilizados y estandarizados, cuyo logo y estilos cambiaba dependiendo del cliente. Este proyecto a nivel parametrizable, tomo en cuenta que a partir de una tabla en AS400, se tuviera acceso a editar desde la pantalla verde el texto, tamaño, color, peso, espaciado, firma, imagen, etc... 

* Integración servicios y consumo de repositorios de archivos a la herramienta Presto de Fresche Solutions.

* Integración de firmas digitales sobre la herramienta Presto de Fresche Solutions usando dispositivos TOPAZ LCD para manejos de firmas en documentos. eliminando procesos basados en papel y garantizando la integridad legal de los datos directamente en el ERP.

* Estudio de innovación e interacciones con el usuario para un software bancario basado en COBOL.

 JavaScript y Desarrollo front end

##SISTEL
Desarrollador de cursos Web

SISTEL · Jornada completa

jul. 2017 - nov. 2018 · 1 año 5 meses

Cali, Valle del Cauca, Colombia

Transmitiendo conocimiento diseñando cursos virtuales en Flash, HTML5 y la herramienta de Articulate en la empresa Sistel Ltda. que combinan interactividad, lúdica, andragogía y creatividad, logrando cautivar al usuario y generar conocimiento en diferentes ámbitos.


