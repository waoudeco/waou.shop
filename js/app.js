/**
 * WAOU! - APP CONTROLLER PRINCIPAL
 * Renderizado de catálogo, carrusel de banners limpio, galería interactiva de personalizados y checkout.
 */

// Estado global de la aplicación
const AppState = {
  currentCategory: "all",
  searchQuery: "",
  sortBy: "featured",
  activeModalProduct: null,
  selectedModalOptions: {
    size: "",
    sizePriceModifier: 0,
    circuit: "",
    finish: "",
    customText: ""
  },
  heroCurrentSlide: 0,
  heroSlideInterval: null,
  customShowcaseIndex: 0
};

// Banners para el carrusel superior (Sin textos, estética limpia)
const HERO_BANNERS = [
  { img: "Imagenes/polef1banner.jpeg", alt: "WAOU! F1 Pole Position Banner" },
  { img: "Imagenes/polef1.jpg", alt: "WAOU! F1 Award Showcase Banner" },
  { img: "Imagenes/Diffsize.jpg", alt: "WAOU! Esculturas de Pared & Circuitos Banner" }
];

// Ejemplos para la galería interactiva de Personalizados (1:1 Cuadrados)
const CUSTOM_GALLERY = [
  {
    title: "Siluetas y Esculturas 3D a Medida",
    desc: "Circuitos internacionales, trazados de karting o siluetas de autos personalizados.",
    img: "Imagenes/WhatsApp Image 2026-08-31 at 11.52.44 PM (1).jpg"
  },
  {
    title: "Placas y Trofeos Grabados",
    desc: "Trofeos para torneos de simracing, clubes de automovilismo y conmemoraciones.",
    img: "Imagenes/WhatsApp Image 2026-08-31 at 11.52.44 PM (2).jpg"
  },
  {
    title: "Logotipos y Proyectos Corporativos",
    desc: "Logotipos volumétricos para oficinas, talleres mecánicos y setups gamer.",
    img: "Imagenes/WhatsApp Image 2026-08-31 at 11.52.44 PM (3).jpg"
  },
  {
    title: "Escalas y Colores Personalizados",
    desc: "Piezas de hasta 1.20 metros con acabados especiales en PLA bio-polímero.",
    img: "Imagenes/WhatsApp Image 2026-08-31 at 11.52.44 PM (4).jpg"
  }
];

/**
 * Inicializa el Carrusel de Banners Limpio
 */
function initHeroCarousel() {
  const container = document.getElementById("heroCarouselSlides");
  const dotsContainer = document.getElementById("heroCarouselDots");
  if (!container || !dotsContainer) return;

  container.innerHTML = HERO_BANNERS.map((banner, idx) => `
    <div class="hero-slide ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      <img src="${banner.img}" alt="${banner.alt}" class="hero-slide-img" onerror="this.src='logos/WAOU Logo rojo.svg'">
    </div>
  `).join("");

  dotsContainer.innerHTML = HERO_BANNERS.map((_, idx) => `
    <button type="button" class="hero-dot ${idx === 0 ? 'active' : ''}" onclick="goToHeroSlide(${idx})" aria-label="Ir al slide ${idx + 1}"></button>
  `).join("");

  startHeroAutoSlide();
}

function goToHeroSlide(index) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");

  if (index >= HERO_BANNERS.length) index = 0;
  if (index < 0) index = HERO_BANNERS.length - 1;

  AppState.heroCurrentSlide = index;

  slides.forEach((s, idx) => {
    if (idx === index) s.classList.add("active");
    else s.classList.remove("active");
  });

  dots.forEach((d, idx) => {
    if (idx === index) d.classList.add("active");
    else d.classList.remove("active");
  });

  restartHeroAutoSlide();
}

function nextHeroSlide() {
  goToHeroSlide(AppState.heroCurrentSlide + 1);
}

function prevHeroSlide() {
  goToHeroSlide(AppState.heroCurrentSlide - 1);
}

function startHeroAutoSlide() {
  clearInterval(AppState.heroSlideInterval);
  AppState.heroSlideInterval = setInterval(() => {
    nextHeroSlide();
  }, 6500);
}

function restartHeroAutoSlide() {
  clearInterval(AppState.heroSlideInterval);
  startHeroAutoSlide();
}

/**
 * Inicializa la galería interactiva de Personalizados
 */
function initCustomGallery() {
  const previewImg = document.getElementById("customMainPreviewImg");
  const thumbsContainer = document.getElementById("customThumbsStrip");

  if (!thumbsContainer || !previewImg) return;

  thumbsContainer.innerHTML = CUSTOM_GALLERY.map((item, idx) => `
    <button type="button" class="custom-thumb-btn ${idx === 0 ? 'active' : ''}" onclick="switchCustomPreview(${idx})">
      <img src="${item.img}" alt="${item.title}" onerror="this.src='logos/WAOU Logo rojo.svg'">
    </button>
  `).join("");

  switchCustomPreview(0);
}

function switchCustomPreview(index) {
  AppState.customShowcaseIndex = index;
  const item = CUSTOM_GALLERY[index];
  if (!item) return;

  const previewImg = document.getElementById("customMainPreviewImg");
  const titleEl = document.getElementById("customProjectTitle");
  const descEl = document.getElementById("customProjectDesc");
  const thumbs = document.querySelectorAll(".custom-thumb-btn");

  if (previewImg) {
    previewImg.style.opacity = "0";
    previewImg.style.transform = "scale(0.96)";
    setTimeout(() => {
      previewImg.src = item.img;
      previewImg.style.opacity = "1";
      previewImg.style.transform = "scale(1)";
    }, 200);
  }

  if (titleEl) titleEl.textContent = item.title;
  if (descEl) descEl.textContent = item.desc;

  thumbs.forEach((t, idx) => {
    if (idx === index) t.classList.add("active");
    else t.classList.remove("active");
  });
}

/**
 * Renderiza la lista de productos filtrada y ordenada (1:1 Cuadrados)
 */
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const countEl = document.getElementById("productsCountLabel");
  if (!grid) return;

  // Filtrado
  let filtered = PRODUCTS_DATA.filter(product => {
    const matchCategory = AppState.currentCategory === "all" || product.category === AppState.currentCategory;
    const q = AppState.searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      product.name.toLowerCase().includes(q) || 
      product.description.toLowerCase().includes(q) || 
      product.categoryName.toLowerCase().includes(q) ||
      product.material.toLowerCase().includes(q);

    return matchCategory && matchSearch;
  });

  // Ordenamiento
  if (AppState.sortBy === "price-low") {
    filtered.sort((a, b) => a.priceCOP - b.priceCOP);
  } else if (AppState.sortBy === "price-high") {
    filtered.sort((a, b) => b.priceCOP - a.priceCOP);
  } else if (AppState.sortBy === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  if (countEl) {
    countEl.textContent = `${filtered.length} ${filtered.length === 1 ? 'objeto' : 'objetos'}`;
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background-color: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-light);">
        <h3 style="font-family: var(--font-heading); margin-bottom: 8px;">No encontramos objetos con ese criterio</h3>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 16px;">Intenta con otra palabra clave o categoría.</p>
        <button class="btn-secondary btn-sm" onclick="resetFilters()">Limpiar Filtros</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(product => {
    let badgeHtml = "";
    if (product.badge) {
      const bClass = product.badge.type === "limited" ? "badge-limited" : (product.badge.type === "new" ? "badge-new" : "badge-mono");
      badgeHtml = `<span class="${bClass}">${product.badge.text}</span>`;
    }

    return `
      <article class="product-card" data-id="${product.id}">
        <a href="producto.html?id=${product.id}" class="product-card-img-wrap" aria-label="Ver landing de ${product.name}">
          <div class="product-badges">
            ${badgeHtml}
          </div>
          <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" onerror="this.src='logos/WAOU Logo rojo.svg'">
          <button type="button" class="product-quick-view-btn" onclick="event.preventDefault(); openQuickView('${product.id}')" title="Ver opciones y personalizar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Personalizar
          </button>
        </a>
        <div class="product-card-body">
          <span class="product-category-meta">${product.categoryName}</span>
          <h3 class="product-card-title">
            <a href="producto.html?id=${product.id}" title="${product.name}" style="color: inherit;">
              ${product.name}
            </a>
          </h3>
          
          <div class="product-dimensions-spec">
            📐 <strong>DIMENSIONES:</strong><br>${product.dimensions}
          </div>

          <div class="product-card-footer">
            <div class="product-price-box">
              <span class="product-price-main">${formatPrice(product.priceCOP)}</span>
              <span class="product-price-secondary">${getSecondaryPriceText(product.priceCOP)}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <a href="producto.html?id=${product.id}" class="btn-secondary btn-sm" style="padding: 9px 10px;" title="Ver página exclusiva">
                Ver
              </a>
              <button type="button" class="product-add-cart-btn" onclick="quickAddToCart('${product.id}')" title="Añadir a orden">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Comprar
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function quickAddToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  cartManager.addItem(product, {
    size: product.sizes && product.sizes[0] ? product.sizes[0].name : "20 cm",
    sizePriceModifier: product.sizes && product.sizes[0] ? product.sizes[0].priceModifier : 0,
    circuit: product.circuits && product.circuits[0] ? product.circuits[0] : "",
    finish: product.finishes && product.finishes[0] ? product.finishes[0] : "Estándar"
  }, 1);
}

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  AppState.activeModalProduct = product;
  AppState.selectedModalOptions = {
    size: product.sizes && product.sizes[0] ? product.sizes[0].name : "20 cm",
    sizePriceModifier: product.sizes && product.sizes[0] ? product.sizes[0].priceModifier : 0,
    circuit: product.circuits && product.circuits[0] ? product.circuits[0] : "",
    finish: product.finishes && product.finishes[0] ? product.finishes[0] : "Estándar",
    customText: ""
  };

  const modalBackdrop = document.getElementById("quickViewBackdrop");
  const modalContent = document.getElementById("quickViewModalContent");
  if (!modalBackdrop || !modalContent) return;

  modalContent.innerHTML = `
    <div class="quick-view-gallery">
      <img id="qvMainImg" src="${product.image}" alt="${product.name}" class="quick-view-img" onerror="this.src='logos/WAOU Logo rojo.svg'">
    </div>
    <div class="quick-view-content">
      <button class="quick-view-close" onclick="closeQuickView()" aria-label="Cerrar modal">&times;</button>
      
      <div>
        <span class="product-category-meta">${product.categoryName}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.4rem; line-height: 1.2; margin-top: 4px;">${product.name}</h2>
      </div>

      <div class="product-dimensions-spec" style="font-size: 0.8rem;">
        📐 <strong>ESPECIFICACIONES TÉCNICAS:</strong><br>
        ${product.dimensions}<br>
        🛠️ <strong>MATERIAL:</strong> ${product.material}
      </div>

      <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5;">
        ${product.description}
      </p>

      <!-- Selector de Circuito F1 si aplica -->
      ${product.circuits && product.circuits.length > 0 ? `
        <div class="option-group">
          <label class="option-label">1. Selecciona el Circuito / Gran Premio (${product.circuits.length} disponibles):</label>
          <select id="qvCircuitSelect" class="form-select" style="font-family: var(--font-mono); font-weight: 600;" onchange="AppState.selectedModalOptions.circuit = this.value">
            ${product.circuits.map(c => `
              <option value="${c}">${c}</option>
            `).join('')}
          </select>
        </div>
      ` : ''}

      <!-- Selector de Medida / Escala si aplica -->
      ${product.sizes && product.sizes.length > 0 ? `
        <div class="option-group">
          <label class="option-label">2. Selecciona Medida / Escala:</label>
          <div class="size-pill-group">
            ${product.sizes.map((s, idx) => `
              <button type="button" class="option-pill ${idx === 0 ? 'selected' : ''}" 
                onclick="selectOption('size', '${s.name}', ${s.priceModifier}, this)">
                ${s.name} ${s.priceModifier > 0 ? `(+ $${s.priceModifier.toLocaleString('es-CO')})` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Selector de Acabado / Color -->
      ${product.finishes && product.finishes.length > 0 ? `
        <div class="option-group">
          <label class="option-label">${product.circuits ? '2. Acabado de la Llanta / Compuesto:' : 'Acabado / Color:'}</label>
          <div class="finish-pill-group">
            ${product.finishes.map((f, idx) => `
              <button type="button" class="option-pill ${idx === 0 ? 'selected' : ''}" 
                onclick="selectOption('finish', '${f}', 0, this)">
                ${f}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Grabado personalizado opcional -->
      <div class="option-group">
        <label class="option-label">Grabado Personalizado en Base (Opcional - Gratis):</label>
        <input type="text" id="qvCustomTextInput" class="form-input" placeholder="Ej: Nombre del fanático, fecha especial, dedicatoria..." maxlength="50" oninput="AppState.selectedModalOptions.customText = this.value">
      </div>

      <!-- Precio Total de la Configuración y CTA -->
      <div style="margin-top: 10px; padding-top: 14px; border-top: 1px solid var(--border-light); display: flex; align-items: center; justify-content: space-between; gap: 16px;">
        <div>
          <span style="font-size: 0.75rem; color: var(--text-secondary); display: block;">Total Configuración:</span>
          <div id="qvTotalPrice" style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 700; color: var(--accent-red);">
            ${formatPrice(product.priceCOP)}
          </div>
        </div>
        <button class="btn-primary" onclick="addModalProductToCart()" style="flex-grow: 1; padding: 12px 18px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Añadir a mi Orden
        </button>
      </div>

      <div style="text-align: center; margin-top: 8px;">
        <a href="producto.html?id=${product.id}" style="font-size: 0.8rem; color: var(--text-secondary); text-decoration: underline;">
          Ver página completa y exclusiva de este producto →
        </a>
      </div>
    </div>
  `;

  modalBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
  updateModalPrice();
}

function selectOption(type, value, priceModifier, btnElement) {
  if (type === "size") {
    AppState.selectedModalOptions.size = value;
    AppState.selectedModalOptions.sizePriceModifier = priceModifier;
  } else if (type === "finish") {
    AppState.selectedModalOptions.finish = value;
  } else if (type === "circuit") {
    AppState.selectedModalOptions.circuit = value;
  }

  if (btnElement && btnElement.parentElement) {
    btnElement.parentElement.querySelectorAll(".option-pill").forEach(p => p.classList.remove("selected"));
    btnElement.classList.add("selected");
  }

  updateModalPrice();
}

function updateModalPrice() {
  const priceEl = document.getElementById("qvTotalPrice");
  if (!priceEl || !AppState.activeModalProduct) return;

  const basePrice = AppState.activeModalProduct.priceCOP;
  const totalCOP = basePrice + AppState.selectedModalOptions.sizePriceModifier;
  
  priceEl.innerHTML = `
    <span>${formatPrice(totalCOP)}</span>
    ${currentCurrency !== "COP" ? `<span style="font-size: 0.75rem; color: var(--text-muted); display: block; font-weight: normal;">(Base: $${totalCOP.toLocaleString('es-CO')} COP)</span>` : ""}
  `;
}

function addModalProductToCart() {
  if (!AppState.activeModalProduct) return;
  const circuitSelect = document.getElementById("qvCircuitSelect");
  if (circuitSelect) AppState.selectedModalOptions.circuit = circuitSelect.value;

  cartManager.addItem(AppState.activeModalProduct, AppState.selectedModalOptions, 1);
  closeQuickView();
}

function closeQuickView() {
  const modalBackdrop = document.getElementById("quickViewBackdrop");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function openCheckoutModal() {
  if (cartManager.items.length === 0) {
    alert("Tu carrito está vacío. Añade algún objeto antes de continuar.");
    return;
  }

  cartManager.closeCartDrawer();
  const backdrop = document.getElementById("checkoutModalBackdrop");
  if (backdrop) {
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeCheckoutModal() {
  const backdrop = document.getElementById("checkoutModalBackdrop");
  if (backdrop) {
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }
}

function handleCheckoutFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("shipName").value.trim();
  const phone = document.getElementById("shipPhone").value.trim();
  const email = document.getElementById("shipEmail").value.trim();
  const department = document.getElementById("shipDepartment").value.trim();
  const city = document.getElementById("shipCity").value.trim();
  const address = document.getElementById("shipAddress").value.trim();
  const notes = document.getElementById("shipNotes").value.trim();
  const isGift = document.getElementById("shipIsGift").checked;

  if (!name || !phone || !department || !city || !address) {
    alert("Por favor completa los campos obligatorios marcados con asterisco (*).");
    return;
  }

  const customerData = {
    name,
    phone,
    email,
    department,
    city,
    address,
    notes,
    isGift
  };

  processOrderCheckout(customerData);
}

function initFilters() {
  const pills = document.querySelectorAll(".category-pill");
  pills.forEach(pill => {
    pill.addEventListener("click", () => {
      pills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      AppState.currentCategory = pill.dataset.category;
      renderProducts();
    });
  });

  const searchInput = document.getElementById("productSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      AppState.searchQuery = e.target.value;
      renderProducts();
    });
  }

  const sortSelect = document.getElementById("catalogSortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      AppState.sortBy = e.target.value;
      renderProducts();
    });
  }
}

function resetFilters() {
  AppState.currentCategory = "all";
  AppState.searchQuery = "";
  AppState.sortBy = "featured";

  const searchInput = document.getElementById("productSearchInput");
  if (searchInput) searchInput.value = "";

  const sortSelect = document.getElementById("catalogSortSelect");
  if (sortSelect) sortSelect.value = "featured";

  document.querySelectorAll(".category-pill").forEach(p => {
    if (p.dataset.category === "all") p.classList.add("active");
    else p.classList.remove("active");
  });

  renderProducts();
}

function toggleMobileMenu() {
  const drawer = document.getElementById("mobileMenuDrawer");
  if (drawer) {
    drawer.classList.toggle("open");
  }
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initHeroCarousel();
  initCustomGallery();
  initFilters();
  initCurrencySelector();
  renderProducts();

  document.addEventListener("waou:currencyChange", () => {
    renderProducts();
    if (AppState.activeModalProduct) {
      updateModalPrice();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeCheckoutModal();
      cartManager.closeCartDrawer();
    }
  });
});
