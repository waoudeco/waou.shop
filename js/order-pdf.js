/**
 * WAOU! - GENERADOR DE ORDEN DE COMPRA EN PDF & INTEGRACIÓN DIRECTA CON WHATSAPP
 * Línea de atención y ventas: +57 323 584 2247
 */

const WAOU_CONFIG = {
  storeName: "WAOU! Objetos Decorativos",
  whatsappNumber: "573235842247",
  contactPhone: "+57 323 584 2247",
  city: "Colombia",
  instagram: "@waoushop",
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbyFt1m6PuOnyhsvNXpv_T5iHTLNbzvFXXEpMQdDawzKfWs6jBV7oz5opALLxL9QLt3NBg/exec"
};

function generateOrderNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `WAOU-${year}-${random}`;
}

// ---------------------------------------------------------------------
// NOTIFICACIÓN DE RESPALDO POR CORREO (Google Apps Script + PDF Base64)
// ---------------------------------------------------------------------
async function sendEmailBackup(customerData, cartItems, orderNumber, pdfBase64) {
  try {
    const totalCOP = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);

    // Resumen detallado de productos
    const itemsSummary = cartItems.map((item, i) => {
      let details = [];
      if (item.circuit) details.push(`GP: ${item.circuit}`);
      if (item.size && item.size !== "Estándar") details.push(`Medida: ${item.size}`);
      if (item.finish) details.push(`Color: ${item.finish}`);
      if (item.customText) details.push(`Grabado: "${item.customText}"`);
      const detailsStr = details.length > 0 ? ` (${details.join(', ')})` : '';
      return `${i + 1}. ${item.name}${detailsStr} x${item.quantity} - $${(item.unitPriceCOP * item.quantity).toLocaleString('es-CO')} COP`;
    }).join('\n');

    const fullAddress = customerData.apartment 
      ? `${customerData.address} - ${customerData.apartment}`
      : customerData.address;

    const payload = {
      orderNumber: orderNumber,
      numeroOrden: orderNumber,
      name: customerData.name,
      nombre: customerData.name,
      phone: customerData.phone,
      telefono: customerData.phone,
      email: customerData.email || "",
      correo: customerData.email || "",
      department: customerData.department,
      departamento: customerData.department,
      city: customerData.city,
      ciudad: customerData.city,
      address: customerData.address,
      direccion: customerData.address,
      apartment: customerData.apartment || "",
      conjuntoApto: customerData.apartment || "",
      fullAddress: fullAddress,
      direccionCompleta: fullAddress,
      notes: customerData.notes || "",
      notas: customerData.notes || "",
      isGift: customerData.isGift || false,
      esRegalo: customerData.isGift ? "Sí" : "No",
      payOnDelivery: customerData.payOnDelivery || false,
      pagoEnCasa: customerData.payOnDelivery ? "Sí" : "No",
      paymentMethod: customerData.payOnDelivery ? "Pago en casa (Contra entrega)" : "Transferencia / Anticipado",
      metodoPago: customerData.payOnDelivery ? "Pago en casa (Contra entrega)" : "Transferencia / Anticipado",
      total: totalCOP,
      totalCOP: totalCOP,
      totalFormatted: `$${totalCOP.toLocaleString('es-CO')} COP`,
      summary: itemsSummary,
      resumen: itemsSummary,
      items: cartItems,
      productos: cartItems,
      pdfBase64: pdfBase64 || "",
      pdf: pdfBase64 || "",
      base64: pdfBase64 || "",
      filename: `Orden_Compra_${orderNumber}.pdf`,
      fileName: `Orden_Compra_${orderNumber}.pdf`,
      nombreArchivo: `Orden_Compra_${orderNumber}.pdf`,
      mimeType: "application/pdf"
    };

    const targetUrl = WAOU_CONFIG.googleScriptUrl;

    // Enviar petición POST asíncrona en modo no-cors para no bloquear la ejecución del cliente
    fetch(targetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      console.warn("Aviso al enviar respaldo de correo a Google Apps Script:", err);
    });

  } catch (err) {
    console.error("Error preparando el respaldo por correo:", err);
  }
}

// ---------------------------------------------------------------------
// NOTIFICACIÓN PUSH CELULAR (ntfy.sh)
// ---------------------------------------------------------------------
async function notifyNewOrder(customerData, cartItems, orderNumber) {
  try {
    const total = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);
    let tagBadge = "";
    if (customerData.isGift) tagBadge = " 🎁 [Regalo]";
    if (customerData.payOnDelivery) tagBadge = " 🏠 [Pago en Casa]";

    const message = `🚨 VENTA #${orderNumber}${tagBadge}\nCliente: ${customerData.name}\nTel: ${customerData.phone}\nCiudad: ${customerData.city} (${customerData.department})\nTotal: $${total.toLocaleString("es-CO")} COP`;

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
  const fullAddressPdf = customerData.apartment ? `${customerData.address} (${customerData.apartment})` : customerData.address;
  doc.text(fullAddressPdf.substring(0, 46), 128, 56);

  doc.setFont("helvetica", "bold");
  doc.text("Notas / Guía:", 110, 62);
  doc.setFont("helvetica", "normal");
  const notes = customerData.notes ? customerData.notes.substring(0, 45) : "Ninguna";
  doc.text(notes, 132, 62);

  if (customerData.isGift) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primaryRed);
    doc.text("🎁 PEDIDO PARA REGALO (No incluir precios impresos en el paquete)", 18, 70);
  } else if (customerData.payOnDelivery) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129); // Verde
    doc.text("🏠 PAGO EN CASA / CONTRA ENTREGA (Cobro del pedido al recibir en destino)", 18, 70);
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

  // Guardar PDF en el navegador del cliente
  const filename = `Orden_Compra_${orderNumber}.pdf`;
  doc.save(filename);

  // Extraer Base64 del PDF generado para envío por correo
  let pdfBase64 = "";
  try {
    const dataUri = doc.output("datauristring");
    pdfBase64 = dataUri.split(",")[1] || dataUri;
  } catch (e) {
    try {
      const dataUri = doc.output("dataurlstring");
      pdfBase64 = dataUri.split(",")[1] || dataUri;
    } catch (e2) {
      console.error("Error al extraer Base64 del PDF:", e2);
    }
  }

  return { doc, filename, pdfBase64 };
}

/**
 * Genera el enlace de WhatsApp estructurado con la GUÍA DE DESPACHO
 */
function buildWhatsAppUrl(customerData, cartItems, orderNumber) {
  const totalCOP = cartItems.reduce((sum, item) => sum + (item.unitPriceCOP * item.quantity), 0);

  let itemsListText = "";
  cartItems.forEach((item, index) => {
    let line = `${index + 1}. *${item.name}*\n`;
    line += `(Cant: ${item.quantity})\n`;
    if (item.circuit) line += `🏎️ *Circuito / GP:* ${item.circuit}\n`;
    if (item.size && item.size !== "Estándar") line += `📏 *Medida:* ${item.size}\n`;
    if (item.finish) line += `🎨 *Color:* ${item.finish}\n`;
    if (item.customText) line += `✏️ *Grabado:* "${item.customText}"\n`;
    line += `💵 *Valor:* $${(item.unitPriceCOP * item.quantity).toLocaleString("es-CO")} COP\n\n`;
    itemsListText += line;
  });

  let message = `¡Hola *WAOU!* 👋 Acabo de generar mi Orden de Compra\n`;
  message += `*#${orderNumber}* desde la página web.\n\n`;
  message += `📋 *DETALLE DE PRODUCTOS:*\n${itemsListText}`;
  message += `💰 *TOTAL A PAGAR:* $${totalCOP.toLocaleString("es-CO")} COP (Envío incluido)\n\n`;

  message += `📦 *INFORMACIÓN DE ENVÍO / GUÍA DE DESPACHO:*\n`;
  message += `• *Destinatario:* ${customerData.name}\n`;
  message += `• *Teléfono / WhatsApp:* ${customerData.phone}\n`;
  if (customerData.email) message += `• *Correo:* ${customerData.email}\n`;
  message += `• *Departamento:* ${customerData.department}\n`;
  message += `• *Ciudad / Municipio:* ${customerData.city}\n`;
  message += `• *Dirección Exacta:* ${customerData.address}\n`;
  if (customerData.apartment) message += `• *Conjunto / Torre / Apto:* ${customerData.apartment}\n`;
  if (customerData.notes) message += `• *Observaciones / Notas:* ${customerData.notes}\n`;
  if (customerData.isGift) {
    message += `• 🎁 *ES UN REGALO* (Por favor despachar sin precios impresos)\n`;
  } else if (customerData.payOnDelivery) {
    message += `• 🏠 *MÉTODO DE PAGO:* Pago en casa (Contra entrega)\n`;
  }

  // codificación obligatoria para preservar emojis (\uFFFF) y saltos de línea (\n)
  const encodedMessage = encodeURIComponent(message);

  return `https://api.whatsapp.com/send?phone=${WAOU_CONFIG.whatsappNumber}&text=${encodedMessage}`;
}

async function processOrderCheckout(customerData) {
  if (cartManager.items.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  const orderNumber = generateOrderNumber();

  try {
    // 1. Notificación Push a Celular (ntfy.sh)
    notifyNewOrder(customerData, cartManager.items, orderNumber);

    // 2. Generar PDF, descargarlo en el navegador y obtener su Base64
    const { pdfBase64 } = await generateOrderPDF(customerData, cartManager.items, orderNumber);

    // 3. Respaldo por Correo vía Google Apps Script (asíncrono, no bloqueante, con PDF adjunto en Base64)
    sendEmailBackup(customerData, cartManager.items, orderNumber, pdfBase64);

    // 4. Preparar enlace de WhatsApp y notificación al usuario
    const waUrl = buildWhatsAppUrl(customerData, cartManager.items, orderNumber);
    cartManager.showToast(`¡Orden #${orderNumber} generada y descargada!`);

    // 5. Redireccionar a WhatsApp
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