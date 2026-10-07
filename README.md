# 29N / Guía electoral

Web infográfica para ayudar a la ciudadanía a informarse sobre las elecciones generales en España, con lenguaje sencillo, fuentes enlazadas y contenido en español, galego, català y euskara.

## Desarrollo

```bash
pnpm install
pnpm dev
```

## Datos de encuestas

El barómetro de 40dB. fue elaborado para EL PAÍS y la Cadena SER. La procedencia, la organización de los archivos y los pasos para añadir encuestadoras están documentados en [docs/encuestas.md](docs/encuestas.md).

```bash
pnpm polls:build
pnpm polls:test
```

Los originales se conservan en `data/polls/raw/`. El JSON y las descargas se regeneran antes del desarrollo y la compilación.

## Contribuciones

Estamos abiertos a contribuciones para mejorar esta guía.
