# Alcance y diseño

Este documento recoge las decisiones acordadas para 29N · Guía electoral. Los puntos pendientes están separados de los requisitos aprobados.

## Objetivo

Ofrecer información electoral visual y comprensible para todo el territorio español. La web tendrá fuentes enlazadas, código abierto y lenguaje sencillo. El contenido y el diseño permitirán incorporar información y modificarla con rapidez.

El nombre público es **29N · Guía electoral**. El dominio previsto es `29ene.pablopl.dev`, con despliegue en Vercel. La fecha del 29 de noviembre procede del anuncio aportado durante la definición del proyecto; su publicación y cualquier calendario deberán contrastarse con las fuentes correspondientes antes de aparecer como información confirmada.

## Primera versión

La portada mostrará el siguiente texto, con salto de línea:

```text
29N
Elecciones Generales
```

La acompañará un hemiciclo formado por 350 puntos, uno por cada diputado. Los colores coincidirán con los de los partidos. En una secuencia breve y difusa, las zonas de color crecerán y decrecerán rápidamente para expresar la imprevisibilidad de la situación. La secuencia terminará con los colores a partes iguales.

Al hacer scroll, la página dará paso a una cronología animada. Su contenido se incorporará posteriormente desde `calendar.html`. Ese archivo queda fuera del análisis y la modificación en esta fase documental.

## Ampliaciones previstas

Cuando aumente la información disponible se añadirán gráficos de encuestas de voto y una tabla comparativa de propuestas de los partidos que se presenten. Estas ampliaciones quedan fuera de la primera versión y requieren definir sus criterios de selección y comparación antes de implementarlas.

## Idiomas y dispositivos

| Idioma | Ruta |
| --- | --- |
| Español, principal | `/` |
| Galego | `/gl` |
| Català | `/ca` |
| Euskara | `/eu` |

Los cuatro idiomas se publicarán y actualizarán a la vez. Escritorio y móvil tendrán composiciones similares, adaptadas a cada formato para mantener la legibilidad y el acceso a la información.

## Tecnología y apertura

Se utilizarán Next.js, shadcn y GSAP. El código se publicará bajo licencia MIT. La web enlazará fuentes, recursos y formularios de GitHub Issues para que sus visitantes puedan proponer correcciones o comunicar problemas.

## Decisiones pendientes

- Lista de partidos y correspondencia de colores para el hemiciclo.
- Tratamiento del reparto final cuando 350 puntos no se puedan dividir exactamente entre los colores elegidos.
- Aclaración visible de que el hemiciclo es ilustrativo y no representa encuestas ni resultados. Fue propuesta, pero no aprobada.
- Comportamiento con la preferencia de movimiento reducido. La versión estática fue propuesta, pero no aprobada.
- Duración, ritmo y comportamiento al volver a la portada.
- Método de revisión de las traducciones, manteniendo la publicación simultánea acordada.
- Criterios concretos de selección y orden de partidos, temas y encuestas para las futuras secciones.

Estos puntos requieren una decisión antes de implementar el comportamiento afectado. Las recomendaciones de la entrevista no respondidas no constituyen requisitos aprobados.
