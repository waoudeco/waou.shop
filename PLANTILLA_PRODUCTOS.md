# 📋 Plantilla para Agregar Nuevos Productos a WAOU!

Para agregar un producto nuevo al catálogo, solo cópianos y péganos este bloque de texto en el chat con los datos de tu pieza, o agrégalo en [`js/products.js`](file:///f:/paginas%20WEB/waoushop/wwwwaoushop/js/products.js):

---

### 📝 Formato para dictar productos en el Chat (El más fácil):

```text
NOMBRE: Trofeo Réplica Pole Position F1
CATEGORÍA: f1-motorsport (Opciones: f1-motorsport / coleccionables / personalizados)
PRECIO: 195000 (En pesos colombianos COP)
MEDIDAS: DIÁMETRO: 20 cm | PROFUNDIDAD: 10 cm
MATERIAL: PLA Bio-Polímero Premium + Base de Exhibición
FOTO: polef1.jpg (Nombre del archivo dentro de la carpeta "Imagenes")
DESCRIPCIÓN: Réplica a escala del neumático oficial Pole Position de Fórmula 1.
VARIANTES DE TAMAÑO:
- Escala 1:3 (20 cm) (Precio base: +0)
- Escala 1:2 (28 cm) (+ $45.000)
- Escala 1:1 Real (38 cm) (+ $110.000)
ACABADOS DISPONIBLES:
- Rojo Suave P Zero
- Amarillo Medio P Zero
- Blanco Duro P Zero
BADGE: EDICIÓN LIMITADA 1 DE 50 (Opcional: MÁS VENDIDO / NUEVO LANZAMIENTO / Ninguno)
GRABADO_PERSONALIZADO: SI (Opciones: SI / NO)
```

---

### 💻 Formato para agregar directamente en `js/products.js`:

```javascript
{
  id: "WAOU-BALLON-ORO",
  name: "BALLON D OR",
  category: "Futbol", // "f1-motorsport", "coleccionables", "personalizados"
  categoryName: "Futbol & sport",
  priceCOP: 70000,
  dimensions: "LARGO: 25 cm | ALTO: 25 cm | ESPESOR: 2 cm",
  material: "PLA Duradero, biodegradable, reciclable y hermoso",
  image: "Imagenes/calendariof1.png", // Imagen principal
  gallery: [
    "Imagenes/ballon0.png",
    "Imagenes/ballon1.png",     
    "Imagenes/ballon2.png",     
    "Imagenes/ballon3.png",     
    "Imagenes/ballon4.png",     
    "Imagenes/ballon5.png"    
  ],
  badge: { type: "limited", text: "EDICIÓN LIMITADA 1 DE 50" }, // O null si no lleva badge
  featured: true,
  description: "Descripción detallada de la pieza...",
  hasEngraving: false, // true si admite grabado personalizado en la base, false si no
  sizes: [
    { name: "Pequeño (10 cm)", priceModifier: -15000 },
    { name: "Mediano (15 cm)", priceModifier: 70000 },
    { name: "Grande (20 cm)", priceModifier: +55000 }
  ],
  //finishes: ["Negro Mate Titanio", "Rojo Carrera F1", "Blanco Minimal"]
}
```

---

### 🎬 ¿Cómo agregar Videos y GIFs a tus productos?
1. Guarda tu archivo de video (`.mp4`, `.webm`, `.mov`) o animación (`.gif`) en la carpeta `Imagenes/`.
2. Agrégalo en el arreglo `gallery: [...]` del producto en [`js/products.js`](file:///f:/paginas%20WEB/waoushop/wwwwaoushop/js/products.js).
3. En la página del producto (`producto.html`), se mostrará como miniatura interactiva con icono de reproducción (`🎬`), y al hacerle clic se reproducirá en bucle (*loop*) automáticamente de forma fluida.

---

### 🌐 Cada producto tiene automáticamente su propia Landing Page:

Al registrar un producto con su `id` (por ejemplo `WAOU-POLE-F1`), automáticamente se habilita su página exclusiva e individual de compra en:

👉 **`producto.html?id=WAOU-POLE-F1`**

Esta página incluye:
- Galería 1:1 cuadrada de alta calidad con zoom y miniaturas.
- Ficha técnica completa con medidas.
- Selector de tamaños y acabados.
- Botón de compra directa con generación de PDF y WhatsApp.
- Botón de compartir enlace para tus redes sociales (Instagram, TikTok, WhatsApp).
