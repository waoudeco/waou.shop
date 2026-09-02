/**
 * WAOU! - GENERADOR DE ORDEN DE COMPRA EN PDF & INTEGRACIÓN DIRECTA CON WHATSAPP
 * Línea de atención y ventas: +57 323 584 2247
 */

const WAOU_CONFIG = {
  storeName: "WAOU! Objetos Decorativos",
  whatsappNumber: "573235842247",
  contactPhone: "+57 323 584 2247",
  city: "Colombia",
  instagram: "@waoushop"
};

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WAOU-${year}-${random}`;
}

// ---------------------------------------------------------------------
// NUEVA FUNCIÓN: Notificación Instantánea a tu Celular vía ntfy.sh
// ---------------------------------------------------------------------
async function notifyNewOrder(customerData, cartItems, orderNumber) {
  try {
    const total = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);

    // Asigna un nombre único para tu canal (ej: waou_pedidos_123)
    const topic = "waou_ventas_secretas_88";

    // Mensaje limpio en texto
    const message = `🚨 VENTA #${orderNumber}\nCliente: ${customerData.name}\nTel: ${customerData.phone}\nCiudad: ${customerData.city}\nTotal: $${total.toLocaleString("es-CO")} COP`;

    // Enviar petición compatible con navegadores (evita CORS)
    await fetch("https://ntfy.sh/amorventawaou", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: message
    });
  } catch (err) {
    console.error("Error enviando notificación al vendedor:", err);
  }
}

/**
 * Genera el documento PDF de la Orden de Compra usando jsPDF
 */
async function generateOrderPDF(customerData, cartItems, orderNumber) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const primaryRed = [225, 6, 0];      // #E10600
  const darkBlack = [17, 17, 19];      // #111113
  const textGray = [85, 85, 92];       // #55555C
  const lightBg = [249, 249, 251];     // #F9F9FB
  const borderGray = [229, 231, 235];  // #E5E7EB

  // 1. Barra superior roja
  doc.setFillColor(...primaryRed);
  doc.rect(0, 0, 210, 6, "F");

  // 2. Encabezado de Marca
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...darkBlack);
  doc.text("WAOU!", 14, 20);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textGray);
  doc.text("DISEÑO Y FABRICACIÓN DE OBJETOS DECORATIVOS & F1", 14, 25);
  doc.text("Colombia | WhatsApp: +57 323 584 2247", 14, 30);

  // 3. Cuadro de Datos de la Orden
  doc.setFillColor(...lightBg);
  doc.roundedRect(125, 12, 71, 22, 2, 2, "F");
  doc.setDrawColor(...borderGray);
  doc.roundedRect(125, 12, 71, 22, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primaryRed);
  doc.text("ORDEN DE COMPRA", 130, 18);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...darkBlack);
  doc.text(`N°: ${orderNumber}`, 130, 24);

  const dateStr = new Date().toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text(`Fecha: ${dateStr}`, 130, 29);

  // 4. Sección de Datos de Envío del Cliente (GUÍA DE DESPACHO)
  doc.setFillColor(...darkBlack);
  doc.rect(14, 38, 182, 6.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text("GUÍA DE DESPACHO E INFORMACIÓN DE ENVÍO (COLOMBIA)", 18, 42.5);

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderGray);
  doc.rect(14, 44.5, 182, 30, "FD");

  doc.setFontSize(8);
  doc.setTextColor(...darkBlack);

  // Columna 1
  doc.setFont("helvetica", "bold");
  doc.text("Destinatario:", 18, 50);
  doc.setFont("helvetica", "normal");
  doc.text(`${customerData.name}`, 42, 50);

  doc.setFont("helvetica", "bold");
  doc.text("WhatsApp / Tel:", 18, 56);
  doc.setFont("helvetica", "normal");
  doc.text(`${customerData.phone}`, 44, 56);

  doc.setFont("helvetica", "bold");
  doc.text("Correo:", 18, 62);
  doc.setFont("helvetica", "normal");
  doc.text(`${customerData.email || "No especificado"}`, 32, 62);

  // Columna 2
  doc.setFont("helvetica", "bold");
  doc.text("Ciudad / Dpto:", 110, 50);
  doc.setFont("helvetica", "normal");
  doc.text(`${customerData.city}, ${customerData.department}`, 135, 50);

  doc.setFont("helvetica", "bold");
  doc.text("Dirección:", 110, 56);
  doc.setFont("helvetica", "normal");
  doc.text(`${customerData.address}`, 128, 56);

  doc.setFont("helvetica", "bold");
  doc.text("Notas / Guía:", 110, 62);
  doc.setFont("helvetica", "normal");
  const notes = customerData.notes ? customerData.notes.substring(0, 45) : "Ninguna";
  doc.text(notes, 132, 62);

  if (customerData.isGift) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryRed);
    doc.text("🎁 PEDIDO PARA REGALO (No incluir precios impresos en el paquete)", 18, 70);
  }

  // 5. Tabla de Productos (jsPDF AutoTable)
  const tableRows = cartItems.map((item, index) => {
    let detailsArr = [];
    if (item.circuit) detailsArr.push(`Circuito / GP: ${item.circuit}`);
    if (item.size && item.size !== "Estándar") detailsArr.push(`Medida: ${item.size}`);
    if (item.finish) detailsArr.push(`Color: ${item.finish}`);
    if (item.customText) detailsArr.push(`Grabado: "${item.customText}"`);

    const details = detailsArr.join(" | ");
    const subtotalItem = item.unitPriceCOP * item.quantity;

    return [
      index + 1,
      item.name + (details ? "\n" + details : ""),
      item.quantity,
      `$${item.unitPriceCOP.toLocaleString("es-CO")} COP`,
      `$${subtotalItem.toLocaleString("es-CO")} COP`
    ];
  });

  const totalCOP = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);

  doc.autoTable({
    startY: 78,
    head: [["#", "PRODUCTO / ESPECIFICACIONES TÉCNICAS", "CANT.", "VALOR UNIT.", "SUBTOTAL"]],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: darkBlack,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "left"
    },
    styles: {
      font: "helvetica",
      fontSize: 7.5,
      textColor: darkBlack,
      cellPadding: 3,
      valign: "middle"
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 96 },
      2: { cellWidth: 16, halign: "center" },
      3: { cellWidth: 31, halign: "right" },
      4: { cellWidth: 31, halign: "right", fontStyle: "bold" }
    }
  });

  const finalY = doc.lastAutoTable.finalY + 6;

  // 6. Resumen de Totales
  doc.setFillColor(...lightBg);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(120, finalY, 76, 26, 2, 2, "FD");

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textGray);
  doc.text("Subtotal Productos:", 124, finalY + 7);
  doc.text(`$${totalCOP.toLocaleString("es-CO")} COP`, 192, finalY + 7, { align: "right" });

  doc.text("Envío Nacional:", 124, finalY + 13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(16, 185, 129); // Verde
  doc.text("INCLUIDO", 192, finalY + 13, { align: "right" });

  doc.setDrawColor(...primaryRed);
  doc.line(124, finalY + 16, 192, finalY + 16);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...primaryRed);
  doc.text("TOTAL ORDEN:", 124, finalY + 22);
  doc.text(`$${totalCOP.toLocaleString("es-CO")} COP`, 192, finalY + 22, { align: "right" });

  // 7. Medios de Pago & Instrucciones
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...borderGray);
  doc.roundedRect(14, finalY, 100, 36, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(...darkBlack);
  doc.text("DATOS PARA PAGO EN COLOMBIA:", 18, finalY + 6);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...textGray);
  doc.text("1. Paga o transfiere a la cuenta oficial de WAOU!:", 18, finalY + 12);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...darkBlack);
  doc.text("• Nequi / Daviplata: 323 584 2247", 22, finalY + 17);
  doc.text("• Bancolombia / Transferencia: Solicitar datos al WhatsApp", 22, finalY + 22);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textGray);
  doc.text("2. Envía tu comprobante junto a esta orden para iniciar", 18, finalY + 28);
  doc.text("   la fabricación y el despacho del paquete.", 18, finalY + 32);

  // 8. Pie de página
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...textGray);
  doc.text("WAOU! - Piezas decorativas de precisión, arte y pasión por los detalles.", 105, 285, { align: "center" });
  doc.text("Fabricación y despacho desde Colombia.", 105, 289, { align: "center" });

  // Guardar PDF
  const filename = `Orden_Compra_${orderNumber}.pdf`;
  doc.save(filename);
}

/**
 * Genera el enlace de WhatsApp estructurado con la GUÍA DE DESPACHO
 */
function buildWhatsAppUrl(customerData, cartItems, orderNumber) {
  const totalCOP = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);

  let itemsListText = "";
  cartItems.forEach((item, index) => {
    let line = `${index + 1}. * ${item.name}* (Cant: ${item.quantity}) \n`;
    if (item.circuit) line += `   - 🏎️ * Circuito / GP:* ${item.circuit} \n`;
    if (item.size && item.size !== "Estándar") line += `   - Medida: ${item.size} \n`;
    if (item.finish) line += `   - Color: ${item.finish} \n`;
    if (item.customText) line += `   - Grabado: "${item.customText}"\n`;
    line += `   - Valor: $${(item.unitPriceCOP * item.quantity).toLocaleString("es-CO")} COP\n`;
    itemsListText += line;
  });

  let message = `¡Hola * WAOU! * 👋 Acabo de generar mi * Orden de Compra #${orderNumber}* desde la página web.\n\n`;
  message += `📋 * DETALLE DE PRODUCTOS:*\n${itemsListText} \n`;
  message += `💰 * TOTAL A PAGAR:* $${totalCOP.toLocaleString("es-CO")} COP(Envío incluido) \n\n`;

  message += `📦 * INFORMACIÓN DE ENVÍO / GUÍA DE DESPACHO:*\n`;
  message += `• * Destinatario:* ${customerData.name} \n`;
  message += `• * Teléfono / WhatsApp:* ${customerData.phone} \n`;
  if (customerData.email) message += `• * Correo:* ${customerData.email} \n`;
  message += `• * Departamento:* ${customerData.department} \n`;
  message += `• * Ciudad / Municipio:* ${customerData.city} \n`;
  message += `• * Dirección Exacta:* ${customerData.address} \n`;
  if (customerData.notes) message += `• * Observaciones / Notas:* ${customerData.notes} \n`;
  if (customerData.isGift) message += `• 🎁 * ES UN REGALO * (Por favor despachar sin precios impresos) \n`;

  message += `\n📄 * He descargado mi archivo PDF oficial(${orderNumber}.pdf).* Adjunto el comprobante para confirmar el pago e iniciar el despacho.`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WAOU_CONFIG.whatsappNumber}?text=${encoded}`;
}

async function processOrderCheckout(customerData) {
  if (cartManager.items.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const orderNumber = generateOrderNumber();

  try {
    // -----------------------------------------------------------------
    // LLAMADA A LA NOTIFICACIÓN PUSH (Te avisa apenas presionan Checkout)
    // -----------------------------------------------------------------
    notifyNewOrder(customerData, cartManager.items, orderNumber);

    await generateOrderPDF(customerData, cartManager.items, orderNumber);
    const waUrl = buildWhatsAppUrl(customerData, cartManager.items, orderNumber);
    cartManager.showToast(`¡Orden #${orderNumber} generada y descargada!`);

    setTimeout(() => {
      window.open(waUrl, "_blank");
    }, 900);

    const checkoutModal = document.getElementById("checkoutModalBackdrop");
    if (checkoutModal) checkoutModal.classList.remove("open");
    cartManager.closeCartDrawer();

    return orderNumber;
  } catch (error) {
    console.error("Error al procesar la orden:", error);
    alert("Hubo un detalle al generar tu orden. Por favor inténtalo de nuevo o contáctanos por WhatsApp.");
  }
}