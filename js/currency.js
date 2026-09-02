/**
 * WAOU! - GESTOR DE MULTI-MONEDA & CONVERSIÓN
 * Moneda Base de Facturación: COP (Pesos Colombianos)
 * Soporte para compradores internacionales que envían regalos dentro de Colombia.
 */

const CURRENCY_CONFIG = {
  base: "COP",
  rates: {
    COP: 1,
    USD: 0.00025,   // ~ 4,000 COP por USD
    EUR: 0.00023,   // ~ 4,350 COP por EUR
    MXN: 0.0048,    // ~ 208 COP por MXN
    CAD: 0.00034,   // ~ 2,950 COP por CAD
    CLP: 0.24       // ~ 4.1 COP por CLP
  },
  symbols: {
    COP: "$",
    USD: "US$",
    EUR: "€",
    MXN: "Mex$",
    CAD: "CA$",
    CLP: "CLP$"
  }
};

let currentCurrency = localStorage.getItem("waou_selected_currency") || "COP";

/**
 * Formatea un valor en pesos colombianos (COP) a la moneda activa
 * @param {number} amountCOP - Monto en pesos colombianos
 * @param {string} currencyCode - Código de moneda opcional
 * @returns {string} Texto formateado con símbolo y separadores
 */
function formatPrice(amountCOP, currencyCode = currentCurrency) {
  if (isNaN(amountCOP)) amountCOP = 0;

  if (currencyCode === "COP") {
    return "$" + Math.round(amountCOP).toLocaleString("es-CO") + " COP";
  }

  const rate = CURRENCY_CONFIG.rates[currencyCode] || 1;
  const converted = amountCOP * rate;
  const symbol = CURRENCY_CONFIG.symbols[currencyCode] || "$";

  if (currencyCode === "EUR") {
    return converted.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + symbol;
  }

  return symbol + " " + converted.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + currencyCode;
}

/**
 * Obtiene el precio secundario/referencia (ej. si está en USD muestra el base en COP)
 */
function getSecondaryPriceText(amountCOP) {
  if (currentCurrency === "COP") {
    // Si la moneda activa es COP, muestra aproximado en USD
    const usdVal = amountCOP * CURRENCY_CONFIG.rates.USD;
    return `~ US$ ${usdVal.toFixed(2)} USD`;
  } else {
    // Si la moneda activa es extranjera, muestra siempre el oficial en COP
    return `Precio base: $${Math.round(amountCOP).toLocaleString("es-CO")} COP`;
  }
}

/**
 * Cambia la moneda activa y despacha evento global
 */
function setCurrency(newCurrency) {
  if (CURRENCY_CONFIG.rates[newCurrency]) {
    currentCurrency = newCurrency;
    localStorage.setItem("waou_selected_currency", newCurrency);
    document.dispatchEvent(new CustomEvent("waou:currencyChange", { detail: { currency: newCurrency } }));
  }
}

/**
 * Inicializa el selector de moneda del Header/TopBar
 */
function initCurrencySelector() {
  const selects = document.querySelectorAll(".currency-select");
  selects.forEach(select => {
    select.value = currentCurrency;
    select.addEventListener("change", (e) => {
      setCurrency(e.target.value);
    });
  });
}
