const products = [
  { id: "hex-m8", name: "Śruba sześciokątna M8", category: "Śruby", spec: "DIN 933 · klasa 8.8 · ocynk", price: 0.42, unit: "szt.", badge: "BESTSELLER", art: "bolt", tone: "steel" },
  { id: "wood-5", name: "Wkręt do drewna 5 × 60", category: "Wkręty", spec: "Torx T25 · ocynk żółty", price: 0.19, unit: "szt.", badge: "DO DREWNA", art: "wood", tone: "brass" },
  { id: "nut-m8", name: "Nakrętka samohamowna M8", category: "Nakrętki", spec: "DIN 985 · wkładka nylonowa", price: 0.31, unit: "szt.", badge: "PEWNY CHWYT", art: "nut", tone: "steel" },
  { id: "concrete-8", name: "Wkręt do betonu 8 × 80", category: "Wkręty", spec: "TX40 · bez kołka · hartowany", price: 1.25, unit: "szt.", badge: "MOCNE MOCOWANIE", art: "concrete", tone: "dark" },
  { id: "a2-m6", name: "Śruba nierdzewna A2 M6", category: "Śruby", spec: "DIN 933 · stal kwasoodporna", price: 0.74, unit: "szt.", badge: "STAL A2", art: "bolt", tone: "silver" },
  { id: "washer-m8", name: "Podkładka szeroka M8", category: "Nakrętki", spec: "DIN 9021 · ocynk galwaniczny", price: 0.12, unit: "szt.", badge: "WIĘKSZA POW.", art: "washer", tone: "brass" },
];

const money = (value) => `${value.toFixed(2).replace(".", ",")} zł`;
let cart = loadCart();
let activeFilter = "Wszystkie";
let toastTimer;
let artworkSequence = 0;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("srubex-cart") || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, quantity]) =>
      products.some((product) => product.id === id) && Number.isInteger(quantity) && quantity > 0
    ));
  } catch {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem("srubex-cart", JSON.stringify(cart));
  } catch {
    showToast("Nie udało się zapisać koszyka w tej przeglądarce.");
  }
}

function productArtwork(type, tone) {
  const gradientId = `product-metal-${++artworkSequence}`;
  const colors = {
    steel: ["#e8e9df", "#818981", "#424a45", "#f7f5eb"],
    brass: ["#f1cb83", "#aa713b", "#684326", "#fff0c8"],
    dark: ["#858b85", "#343a36", "#171d1a", "#c5c8bb"],
    silver: ["#f7f7f0", "#b9c0bd", "#7c8583", "#ffffff"],
  }[tone];
  if (type === "nut" || type === "washer") {
    const isWasher = type === "washer";
    return `<svg class="product-illustration" viewBox="0 0 240 180" aria-hidden="true">
      <defs><linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[3]}"/><stop offset=".5" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient></defs>
      <g transform="rotate(-20 120 90)">
        ${isWasher ? `<ellipse cx="120" cy="95" rx="77" ry="34" fill="url(#${gradientId})" stroke="${colors[2]}" stroke-width="2"/><ellipse cx="120" cy="95" rx="31" ry="13" fill="#e9e8df" stroke="${colors[2]}" stroke-width="2"/>` : `<path d="m57 74 31-39h64l31 39v37l-31 38H88l-31-38Z" fill="url(#${gradientId})" stroke="${colors[2]}" stroke-width="3"/><path d="m89 83 21-27h20l21 27v19l-21 27h-20l-21-27Z" fill="#e9e8df" stroke="${colors[2]}" stroke-width="3"/><path d="m59 75 29 18m64 0 29-18M59 111l29-18m64 0 29 18" fill="none" stroke="${colors[3]}" stroke-width="3" opacity=".7"/>`}
      </g></svg>`;
  }
  const wood = type === "wood";
  const concrete = type === "concrete";
  const width = wood ? 15 : concrete ? 24 : 28;
  const headY = wood ? 35 : 40;
  const shaftTop = wood ? 55 : 64;
  const shaftBottom = wood ? 153 : 149;
  const center = 120;
  return `<svg class="product-illustration" viewBox="0 0 240 180" aria-hidden="true">
    <defs><linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="1"><stop stop-color="${colors[3]}"/><stop offset=".28" stop-color="${colors[1]}"/><stop offset=".56" stop-color="${colors[0]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient></defs>
    <g transform="rotate(34 ${center} 90)">
      <rect x="${center - width / 2}" y="${shaftTop}" width="${width}" height="${shaftBottom - shaftTop}" rx="${wood ? 3 : 5}" fill="url(#${gradientId})"/>
      ${Array.from({ length: 7 }, (_, i) => {
        const y = shaftTop + 12 + i * (wood ? 12 : 11);
        return `<path d="M${center - width / 2 - 3} ${y}h${width + 6}l-${wood ? 5 : 8} 6h-${width - (wood ? 5 : 8)}Z" fill="${colors[2]}" opacity=".75"/><path d="M${center - width / 2} ${y}h${width}" stroke="${colors[3]}" stroke-width="1.5" opacity=".85"/>`;
      }).join("")}
      ${wood ? `<path d="m${center - 23} ${headY + 10} 23-19 23 19v13h-46Z" fill="url(#${gradientId})" stroke="${colors[2]}" stroke-width="2"/><path d="M${center - 7} ${headY + 7}h14m-7-7v14" stroke="${colors[2]}" stroke-width="3"/>` : `<path d="m${center - 29} ${headY + 8} 15-17h28l15 17v18h-58Z" fill="url(#${gradientId})" stroke="${colors[2]}" stroke-width="2"/><path d="M${center - 11} ${headY + 13}h22m-11-8v16" stroke="${colors[2]}" stroke-width="3"/>`}
      <path d="M${center - width / 2} ${shaftBottom}h${width / 2}l-${width / 2} 15Z" fill="${colors[2]}"/>
    </g></svg>`;
}

function renderProducts() {
  const query = document.querySelector("#search-input").value.trim().toLocaleLowerCase("pl");
  const visible = products.filter((product) => {
    const matchesFilter = activeFilter === "Wszystkie" || product.category === activeFilter;
    const matchesSearch = `${product.name} ${product.category} ${product.spec} ${product.badge}`.toLocaleLowerCase("pl").includes(query);
    return matchesFilter && matchesSearch;
  });
  document.querySelector("#product-grid").innerHTML = visible.map((product, index) => `
    <article class="product-card">
      <div class="product-visual">
        <span class="product-tag${index === 0 && activeFilter === "Wszystkie" && !query ? " hot" : ""}">${product.badge}</span>
        <span class="product-number">0${products.indexOf(product) + 1} / 06</span>
        ${productArtwork(product.art, product.tone)}
      </div>
      <div class="product-info">
        <div><p class="product-category">${product.category}</p><h3>${product.name}</h3><p class="product-spec">${product.spec}</p></div>
        <p class="product-price">${money(product.price)}<span class="product-unit">/ ${product.unit}</span></p>
      </div>
      <div class="product-actions"><span class="stock-status">Dostępny</span><button class="add-button" data-add="${product.id}">Dodaj <svg class="icon"><use href="#icon-plus"/></svg></button></div>
    </article>`).join("");
  document.querySelector("#result-count").textContent = `${String(visible.length).padStart(2, "0")} PRODUKT${visible.length === 1 ? "" : "ÓW"}`;
  document.querySelector("#empty-state").hidden = visible.length > 0;
  document.querySelector("#product-grid").hidden = visible.length === 0;
}

function updateCart() {
  const entries = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const totalQuantity = entries.reduce((sum, [, quantity]) => sum + quantity, 0);
  const total = entries.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === id).price * quantity, 0);
  document.querySelector("#cart-count").textContent = totalQuantity;
  document.querySelector("#drawer-count").textContent = `(${totalQuantity})`;
  document.querySelector("#cart-empty").hidden = totalQuantity > 0;
  document.querySelector("#drawer-footer").hidden = totalQuantity === 0;
  document.querySelector("#cart-items").innerHTML = entries.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return `<article class="cart-row">
      <div class="cart-thumb">${productArtwork(product.art, product.tone)}</div>
      <div class="cart-row-info"><h3>${product.name}</h3><p>${money(product.price)} / ${product.unit}</p>
        <div class="quantity-control"><button aria-label="Zmniejsz ilość: ${product.name}" data-quantity="${id}" data-change="-1"><svg class="icon"><use href="#icon-minus"/></svg></button><span>${quantity}</span><button aria-label="Zwiększ ilość: ${product.name}" data-quantity="${id}" data-change="1"><svg class="icon"><use href="#icon-plus"/></svg></button></div>
      </div><span class="cart-row-price">${money(product.price * quantity)}</span>
    </article>`;
  }).join("");
  document.querySelector("#cart-total").textContent = money(total);
  document.querySelector("#shipping-message").textContent = total >= 250 ? "Masz darmową dostawę!" : `Do darmowej dostawy brakuje ${money(250 - total)}.`;
  saveCart();
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function setDrawerOpen(open) {
  const drawer = document.querySelector("#cart-drawer");
  drawer.classList.toggle("open", open);
  drawer.setAttribute("aria-hidden", String(!open));
  document.querySelector("#drawer-backdrop").hidden = !open;
  document.body.classList.toggle("drawer-open", open);
  if (open) document.querySelector("#cart-close").focus();
  else document.querySelector("#cart-open").focus();
}

document.querySelector(".filter-list").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  activeFilter = button.dataset.filter;
  document.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
  renderProducts();
});

document.querySelector("#product-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  cart[button.dataset.add] = (cart[button.dataset.add] || 0) + 1;
  updateCart();
  const product = products.find((item) => item.id === button.dataset.add);
  showToast(`Dodano do koszyka: ${product.name}`);
});

document.querySelector("#search-input").addEventListener("input", renderProducts);
document.addEventListener("keydown", (event) => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault();
    document.querySelector("#search-input").focus();
  }
  if (event.key === "Escape") {
    if (document.querySelector("#cart-drawer").classList.contains("open")) setDrawerOpen(false);
    if (document.querySelector("#checkout-dialog").open) document.querySelector("#checkout-dialog").close();
  }
});

document.querySelector("#cart-open").addEventListener("click", () => setDrawerOpen(true));
document.querySelector("#cart-close").addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#drawer-backdrop").addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#continue-shopping").addEventListener("click", () => setDrawerOpen(false));
document.querySelector("#cart-items").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (!button) return;
  const id = button.dataset.quantity;
  cart[id] += Number(button.dataset.change);
  if (cart[id] <= 0) delete cart[id];
  updateCart();
});

document.querySelector("#contact-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#form-feedback").textContent = "To wersja demonstracyjna — wiadomość nie została wysłana.";
  event.currentTarget.reset();
});

const checkoutDialog = document.querySelector("#checkout-dialog");
document.querySelector("#checkout-button").addEventListener("click", () => checkoutDialog.showModal());
document.querySelector("#checkout-close").addEventListener("click", () => checkoutDialog.close());
document.querySelector("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();
  cart = {};
  updateCart();
  document.querySelector("#checkout-content").innerHTML = `<div class="checkout-success"><span class="success-icon"><svg class="icon"><use href="#icon-check"/></svg></span><p class="eyebrow">ZAMÓWIENIE DEMONSTRACYJNE</p><h2>Dzięki za<br>zaufanie.</h2><p>To wersja demonstracyjna sklepu. Zamówienie nie zostało przekazane do realizacji.</p><button class="button button-dark" id="success-close">Wróć do sklepu <svg class="icon"><use href="#icon-arrow"/></svg></button></div>`;
  document.querySelector("#success-close").addEventListener("click", () => {
    checkoutDialog.close();
    setDrawerOpen(false);
  });
});
checkoutDialog.addEventListener("click", (event) => {
  if (event.target === checkoutDialog) checkoutDialog.close();
});

renderProducts();
updateCart();
