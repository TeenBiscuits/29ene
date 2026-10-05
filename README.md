# 29N · Guía electoral

Web infográfica para ayudar a la ciudadanía a informarse sobre las elecciones generales en España, con lenguaje sencillo, fuentes enlazadas y contenido en español, galego, català y euskara.

El proyecto está en fase de definición. La interfaz electoral todavía no está implementada.

## Documentación

- [Alcance y diseño acordados](docs/producto.md).
- [Criterios editoriales](docs/editorial.md).
- [Glosario](GLOSSARY.md).
- [Decisiones de arquitectura](docs/adr/).

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación local se sirve en http://localhost:3000. Los comandos disponibles están en `package.json`.

La tecnología acordada es Next.js, shadcn y GSAP para las animaciones. GSAP está pendiente de incorporar. Antes de desarrollar, consulta [AGENTS.md](AGENTS.md) y las guías locales de la versión instalada de Next.js.

El despliegue previsto es Vercel, en https://29ene.pablopl.dev. La licencia acordada para el código es MIT; queda pendiente añadir el archivo de licencia.

## Contribuciones

Las contribuciones se propondrán mediante pull requests y el responsable del proyecto aprobará su publicación. Se habilitarán plantillas de GitHub Issues para corregir información y comunicar problemas de la web.
