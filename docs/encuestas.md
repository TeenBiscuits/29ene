# Encuestas: fuentes y mantenimiento

El barómetro de octubre de 2026 fue elaborado por **40dB. para EL PAÍS y la Cadena SER**. Los documentos aportados proceden de [la publicación de los datos internos de la encuesta en EL PAÍS](https://elpais.com/espana/2026-10-05/consulte-todos-los-datos-internos-de-la-encuesta-de-el-pais-cuestionarios-cruces-y-respuestas-individuales.html). El registro de fuentes conserva la URL, los medios, el periodo, los archivos y el peso editorial de cada encuesta. La página muestra esta procedencia dentro de la metodología de la encuestadora.

## Organización

- `data/polls/sources.json`: registro de fuentes y pesos.
- `data/polls/raw/40db/2026-10/`: originales de 40dB., conservados sin modificaciones; incluye cuestionario, metodología, tablas, informes y microdatos en los formatos recibidos.
- `lib/polls/`: tipos, agregación, categorías, textos traducidos, formatos y metadatos. `landing.ts` y `history.json` mantienen el histórico de la portada.
- `lib/polls/generated/details.json`: datos generados, excluidos de Git.
- `scripts/polls/`: extracción del Excel y del informe PDF.
- `components/polls/`: interfaz de encuestas; `components/layout/` contiene el header y footer compartidos. `components/ui/` conserva únicamente componentes shadcn utilizados.
- `tests/polls/`: pruebas de extracción, agrupación y ponderación.
- `public/polls/`: descargas generadas, excluidas de Git.

Los HTML de referencia se eliminaron una vez trasladado su diseño a los componentes. No se necesitan para generar las gráficas. Los SVG de plantilla sin uso también se eliminaron.

## Generación y comprobación

`pnpm dev` y `pnpm build` ejecutan primero `pnpm polls:build`. Este comando regenera el JSON y las descargas a partir de los archivos originales. `pnpm polls:test` comprueba la extracción y los cálculos. No es necesario conservar ni editar manualmente los artefactos generados.

`pnpm 40db:sync` descarga el ZIP oficial de 40dB. para octubre de 2026 y actualiza los originales locales si han cambiado. `node scripts/polls/sync-40db.mjs --check` descarga y compara sus SHA-256 sin escribir archivos. Ambos comandos requieren `unzip` en el sistema.

El Excel aporta 475 observaciones de las preguntas P2 y P3 de «Recuerdo de voto - Generales», «Edad» y «Sexo». Se conserva el porcentaje, la hoja, la celda, la base y el SHA-256 de las tablas. Las 475 celdas se verificaron contra el Excel con un lector independiente. Una celda vacía permanece `null`, nunca se inventa un cero. Las tablas ya incluyen la ponderación de 40dB.; no se recalculan frecuencias sin ponderar a partir de microdatos. Estos últimos se conservan para trazabilidad, pero no se publican en la web.

La participación muestra la respuesta 10 de P2. La intención directa de P3 usa todos los encuestados de cada segmento como base. Las transferencias muestran cinco partidos y permiten consultar todas las respuestas en una tabla, sin renormalizar los porcentajes.

Las barras por edad y sexo usan ocho categorías explícitas en `demographics.mjs`. Nacionalistas y regionales reúne ERC, Junts, PNV, EH Bildu, Coalición Canaria, Nueva Canarias, BNG, CUP, España Vaciada, UPN y UPL. Otros reúne otros partidos, blanco, nulo, abstención, indecisos y quienes no contestan. Las categorías suman únicamente datos publicados; no se calcula un residuo hasta 100 %. El eje admite totales como 100,2 % por redondeo. Las etiquetas interiores se redondean a enteros; el tooltip y las tablas conservan un decimal.

Los dos hemiciclos comparan la estimación actual y el resultado de las generales del 23J de 2023, ambos sobre votos válidos. Se extraen del informe electoral de 40dB. (página 8), validando las etiquetas y los totales. El arco exterior muestra la estimación ponderada y el interior el resultado histórico. Se conserva «Otro + Blanco» del informe; Podemos no se presenta como candidatura separada en 2023. No se calculan escaños. Esta estimación se distingue de la intención directa de las demás gráficas.

## Añadir encuestadoras o periodos

1. Guardar los documentos en `data/polls/raw/<encuestadora>/<AAAA-MM>/`.
2. Registrar la fuente, URL, medios, archivos, periodo y peso en `sources.json`.
3. Añadir la metodología y sus traducciones en `lib/polls/methodologies.ts`.
4. Si el formato difiere, crear un adaptador en `scripts/polls/` que produzca las mismas claves después de comprobar preguntas, universos y bases. El adaptador actual corresponde a 40dB.; no basta con que otra fuente llame P3 a una pregunta.
5. Ejecutar `pnpm polls:build`, `pnpm polls:test` y `pnpm build`.

Solo se combinan fuentes del mismo periodo y observaciones comparables mediante `Σ(peso × porcentaje) / Σ(peso)`. Los datos ausentes se excluyen del denominador. Los pesos son editoriales, no se deducen del tamaño muestral. Las categorías se agrupan por fuente antes de aplicar estos pesos.

El selector ofrece la encuesta más reciente de cada encuestadora y exige al menos una seleccionada. Gráficas, tablas y etiquetas cambian juntas. El navegador combina porcentajes ya extraídos; no procesa archivos originales ni microdatos.

## Periodos y cobertura de la selección

El selector ofrece la encuesta más reciente de cada encuestadora, mostrando su mes. El periodo de cálculo es el más reciente entre las encuestas seleccionadas. Cuando se seleccionan meses diferentes, la página lo explica y muestra las fuentes de otro mes que quedan fuera; nunca se ponderan periodos distintos juntos. Los pesos mostrados corresponden a las fuentes del periodo activo y cada gráfica identifica solo sus contribuyentes reales.

Las pruebas de cobertura comprueban las fuentes del periodo activo, la diferencia entre cero y ausencia, y los valores publicados.

## Sigma Dos para EL MUNDO · Octubre de 2026

Fuentes: [publicación de Sigma Dos](https://www.sigmados.com/barometro-de-octubre-estimacion-de-voto-para-las-elecciones-generales/) y [publicación de EL MUNDO](https://www.elmundo.es/espana/encuestas/2026/10/04/6ac25e4dfc6c83bb588b458d.html). Se conservan los gráficos descargados directamente de ambas publicaciones en `data/polls/raw/sigma-dos/2026-10/`, junto al JSON transcrito y un TSV de estimación. No se usan las cifras de la imagen adjunta de referencia: se contrastaron con los gráficos publicados por los medios.

La estimación incluye quince categorías y 350 escaños. El gráfico de EL MUNDO publica explícitamente «Otros», 4,3 % y cero escaños; no es un residuo calculado. El resultado del 23J contiene doce categorías, 350 escaños y 100,1 % por redondeo. La ficha técnica procede de Sigma Dos: 2.116 entrevistas CATI/CAWI, realizadas del 22 de septiembre al 1 de octubre de 2026, con margen publicado de ±2,2 puntos al 95,5 % de confianza.

El trasvase muestra seis grupos de recuerdo de voto: PP, PSOE, Vox, Sumar, No votó y Resto. Se transcriben únicamente los 29 porcentajes escritos en el gráfico. Las otras 19 celdas se conservan como `null`; no se calculan a partir de píxeles ni se rellenan por diferencia hasta 100 %. Los cinco destinos partidistas y la abstención se corresponden con los conceptos de intención directa según recuerdo de voto; «Otros (Sigma Dos)» e «Indecisos (Sigma Dos)» conservan claves separadas porque no se conoce una equivalencia exacta con las respuestas individuales de 40dB. Los grupos de origen «Resto» y «Otro» también permanecen separados.

En selección individual se conservan el desglose y los escaños publicados. Para varias fuentes del mismo mes, `lib/polls/comparison.mjs` identifica los partidos desglosados por todas y suma, por fuente, las demás categorías publicadas en «Resto del voto publicado», antes de calcular la media. Así, SALF y «Otro + Blanco» de 40dB. suman 14,3 %, y los partidos pequeños más «Otros» de Sigma Dos suman 13,6 %. Sus pesos iguales dan PP 32,1 %, PSOE 26,5 %, Vox 18,35 %, Sumar 6,1 %, Podemos 3 % y resto 13,95 %, conservando el total del 100 %. Nunca se promedian escaños. El resultado histórico es una serie publicada, no una estimación ponderada.

Sigma Dos no aporta datos de participación, edad o sexo en estas publicaciones. En selección individual esas gráficas muestran el estado sin datos. En selección conjunta identifican únicamente a 40dB. como contribuyente. El trasvase identifica ambas fuentes, pero cada celda sin dato de Sigma Dos excluye su peso.
