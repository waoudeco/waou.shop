/**
 * WAOU! - GESTOR DEL CARRITO DE COMPRAS
 * Manejo de estado, persistencia en localStorage, cálculo de totales y eventos del DOM.
 */

class CartManager {
  constructor() {
    this.items = this.loadCart();
    this.initEventListeners();
  }

  loadCart() {
    try {
      const saved = localStorage.getItem("waou_cart_items");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error al cargar carrito:", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem("waou_cart_items", JSON.stringify(this.items));
      this.updateBadges();
      this.renderCartDrawer();
      document.dispatchEvent(new CustomEvent("waou:cartUpdated", { detail: { items: this.items } }));
    } catch (e) {
      console.error("Error al guardar carrito:", e);
    }
  }

  /**
   * Agrega un ítem con sus variantes personalizadas (tamaño, circuito, acabado, grabado)
   */
  addItem(product, options = {}, quantity = 1) {
    const size = options.size || (product.sizes && product.sizes[0] ? product.sizes[0].name : "20 cm");
    const sizeMod = options.sizePriceModifier || 0;
    const circuit = options.circuit || (product.circuits && product.circuits[0] ? product.circuits[0] : "");
    const finish = options.finish || (product.finishes && product.finishes[0] ? product.finishes[0] : "Estándar");
    const customText = options.customText || "";

    const unitPriceCOP = product.priceCOP + sizeMod;
    const cartItemId = `${product.id}_${size}_${circuit}_${finish}_${customText}`.replace(/\s+/g, '-').toLowerCase();

    const existingIndex = this.items.findIndex(item => item.cartItemId === cartItemId);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        cartItemId,
        id: product.id,
        name: product.name,
        unitPriceCOP,
        image: product.image,
        size,
        circuit,
        finish,
        customText,
        dimensions: product.dimensions,
        quantity
      });
    }

    this.saveCart();
    this.showToast(`¡"${product.name}" añadido al carrito!`);
    this.openCartDrawer();
  }

  removeItem(cartItemId) {
    this.items = this.items.filter(item => item.cartItemId !== cartItemId);
    this.saveCart();
  }

  updateQuantity(cartItemId, newQty) {
    const item = this.items.find(item => item.cartItemId === cartItemId);
    if (!item) return;

    if (newQty <= 0) {
      this.removeItem(cartItemId);
    } else {
      item.quantity = newQty;
      this.saveCart();
    }
  }

  clearCart() {
    this.items = [];
    this.saveCart();
  }

  getTotalItems() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotalCOP() {
    return this.items.reduce((total, item) => total + (item.unitPriceCOP * item.quantity), 0);
  }

  updateBadges() {
    const totalCount = this.getTotalItems();
    const badges = document.querySelectorAll(".cart-badge");
    badges.forEach(badge => {
      badge.textContent = totalCount;
      badge.classList.add("bump");
      setTimeout(() => badge.classList.remove("bump"), 300);
    });
  }

  renderCartDrawer() {
    const container = document.getElementById("cartItemsContainer");
    const subtotalEl = document.getElementById("cartSubtotalValue");
    const totalItemsEl = document.getElementById("cartItemsCountSummary");
    const checkoutBtn = document.getElementById("openCheckoutModalBtn");

    if (!container) return;

    if (this.items.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.15rem;">Tu carrito está vacío</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); max-width: 280px;">
            Explora nuestra colección de F1 y objetos decorativos para armar tu pedido.
          </p>
          <button class="btn-secondary btn-sm" onclick="cartManager.closeCartDrawer(); window.location.href='index.html#catalogo';">
            Ver Colección
          </button>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = formatPrice(0);
      if (totalItemsEl) totalItemsEl.textContent = "0 productos";
      if (checkoutBtn) checkoutBtn.disabled = true;
      return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    container.innerHTML = this.items.map(item => {
      let variantDetails = [];
      if (item.circuit) variantDetails.push(`🏎️ <strong>GP:</strong> ${item.circuit}`);
      if (item.size && item.size !== "Estándar") variantDetails.push(`📏 ${item.size}`);
      if (item.finish) variantDetails.push(`🎨 ${item.finish}`);
      if (item.customText) variantDetails.push(`✍️ "${item.customText}"`);

      return `
        <div class="cart-item" data-id="${item.cartItemId}">
          <div class="cart-item-img-wrap">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='logos/WAOU Logo rojo.svg'">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-variant" style="line-height: 1.4;">
              ${variantDetails.join("<br>")}
            </div>
            <div class="cart-item-price">
              ${formatPrice(item.unitPriceCOP)}
            </div>
          </div>
          <div class="cart-item-actions">
            <button class="cart-item-remove-btn" onclick="cartManager.removeItem('${item.cartItemId}')" title="Eliminar producto">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <div class="cart-qty-control">
              <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.cartItemId}', ${item.quantity - 1})">-</button>
              <span class="cart-qty-value">${item.quantity}</span>
              <button class="cart-qty-btn" onclick="cartManager.updateQuantity('${item.cartItemId}', ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    const subtotalCOP = this.getSubtotalCOP();
    if (subtotalEl) {
      subtotalEl.innerHTML = `
        <span>${formatPrice(subtotalCOP)}</span>
        ${currentCurrency !== "COP" ? `<span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: normal;">(Base: $${Math.round(subtotalCOP).toLocaleString('es-CO')} COP)</span>` : ""}
      `;
    }
    if (totalItemsEl) {
      const count = this.getTotalItems();
      totalItemsEl.textContent = `${count} ${count === 1 ? 'producto' : 'productos'}`;
    }
  }

  openCartDrawer() {
    const backdrop = document.getElementById("cartDrawerBackdrop");
    const drawer = document.getElementById("cartDrawer");
    if (backdrop && drawer) {
      backdrop.classList.add("open");
      drawer.classList.add("open");
      document.body.style.overflow = "hidden";
      this.renderCartDrawer();
    }
  }

  closeCartDrawer() {
    const backdrop = document.getElementById("cartDrawerBackdrop");
    const drawer = document.getElementById("cartDrawer");
    if (backdrop && drawer) {
      backdrop.classList.remove("open");
      drawer.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  showToast(message) {
    let toast = document.getElementById("waouToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "waouToast";
      toast.className = "toast-notification";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  initEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.updateBadges();
      this.renderCartDrawer();
    });

    document.addEventListener("waou:currencyChange", () => {
      this.renderCartDrawer();
    });
  }
}

const cartManager = new CartManager();
