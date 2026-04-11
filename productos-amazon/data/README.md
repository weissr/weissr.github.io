# Inventario de productos (Amazon)

Archivo maestro: **`products.json`** — un array JSON de objetos, uno por producto.

Sirve como **inventario y referencia** (y para scripts futuros que comprueben enlaces). **La página `productos-amazon/index.html` no lee este archivo en el navegador:** las tarjetas de producto son HTML estático. Cuando añadas o cambies productos, actualiza el JSON y pide **bajo demanda** que se sincronicen los bloques `<article>` en el HTML con los datos del JSON (o edítalos a mano manteniendo la misma estructura). Las imágenes siguen en `/img/productos-amazon/`.

**Orden en el array y en el HTML:** primero por **subcategoría** (calzado → accesorios calzado → calcetines → guantes → ropa → accesorios generales → fuerza) y, dentro de cada una, por **título** alfabético en español. La primera tarjeta del grid conserva `fetchpriority="high"` en su imagen (producto destacado arriba).

## Esquema por producto

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `affiliate_url` | string | sí | **Enlace de afiliado** que debe llevar el botón «Ver en Amazon» en la página (p. ej. `https://amzn.to/...` o URL con tu `tag` de Associates). Es la que cuenta para comisiones. |
| `active` | boolean | sí | `true` si debe publicarse en la web. |
| `slug` | string | sí | Identificador estable (sin espacios); suele alinearse con el nombre del archivo de imagen. |
| `title` | string | sí | Título de la tarjeta (H2). |
| `description` | string | sí | Texto corto de la tarjeta. |
| `category` | string | sí | Slug de categoría (debe existir en `LABELS` en `amazon.js`, alineado con los productos publicados). Slugs usados: `esqui`, `trail`. **Varios valores:** slugs separados por **espacio** (p. ej. `trail esqui`) para que el producto cuente en más de una categoría al filtrar. |
| `subcategory` | string | sí | Slug de subcategoría o cadena vacía `""`. Slugs habituales en la web: `calzado`, `accesorios`, `calcetines`, `guantes`, `ropa`, `fuerza`. **Varios valores:** slugs separados por **espacio** (p. ej. `accesorios calzado`) para que aparezca al filtrar por cualquiera de ellas. |
| `search_keywords` | string | sí | Palabras para el atributo `data-search` (marcas, sinónimos). |
| `image` | string | sí | Nombre del archivo bajo `/img/productos-amazon/` (solo el nombre, p. ej. `producto.jpg`). |
| `badge` | string | no | Texto del badge; si se omite, se puede derivar de categorías + etiquetas. |
| `asin` | string | no | ASIN del producto (útil para scripts de comprobación). |
| `last_checked` | string | no | Fecha ISO de última revisión del enlace. |
| `notes` | string | no | Notas internas (no se muestran en la página). |

Los campos opcionales vacíos pueden ir como `""` o omitirse según prefieras.

## Coherencia con la página

- `affiliate_url` → atributo `href` del enlace con clase `product-card__cta` (botón «Ver en Amazon»).
- `category` → `data-category` (misma lista separada por espacios si hay varios)
- `subcategory` → `data-subcategory` (misma lista separada por espacios si hay varios)
- `search_keywords` → `data-search`
- Imagen en HTML: `/img/productos-amazon/` + valor de `image`
- El campo `active` indica si el producto debería estar publicado; al sincronizar el HTML, los inactivos no se copian a la página.

## Rastreo

`robots.txt` incluye `Disallow: /productos-amazon/data/` para que los buscadores no indexen estos ficheros (no sustituye a la seguridad por oscuridad).
