
const PRODUCTS = [
  {
    id: 1,
    name: "Gelatina de mazapán",
    price: 380,
    desc: "Postre suave y cremoso elaborado con leche y mazapán, con un sabor a cacahuate dulce y una textura firme pero delicada.",
    img: "img/gelatinamazapan.jpg"
  },
  {
    id: 2,
    name: "Capirotada",
    price: 95,
    desc: "Tradicional postre mexicano elaborado con pan frito o tostado, bañado en miel de piloncillo, acompañado de plátano, pasas, cacahuates y queso.",
    img: "img/capirotada.jpg"
  },
  {
    id: 3,
    name: "Ponche de frutas",
    price: 85,
    desc: "Bebida dulce elaborada con frutas como tejocote, guayaba, manzana, caña de azúcar y canela.",
    img: "img/ponche.png"
  },
  {
    id: 4,
    name: "Pay de queso con fresas y zarzamoras",
    price: 280,
    desc: "Pay de base galleta con un relleno cremoso de queso, decorada con fresas y zarzamoras frescas.",
    img: "img/payqueso.jpg"
  },
  {
    id: 5,
    name: "Gelatina multicolor con frutas",
    price: 380,
    desc: "Gelatina de varios colores mezclada con trozos de frutas como duraznos, uvas o piña.",
    img: "img/multifrutas.jpg"
  },
  {
    id: 6,
    name: "Gelatina multicolor mexicana",
    price: 280,
    desc: "Gelatina con los colores de la bandera mexicana (verde, blanco y rojo).",
    img: "img/mexicanamulti.jpg"
  },
  
];

const productsSection = document.getElementById('products-section');
const productModal = document.getElementById('product-modal');
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const searchBtn = document.getElementById('search-btn');

let cart = [];

function renderProducts(products) {
  productsSection.innerHTML = "";
  products.forEach(prod => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${prod.img}" alt="${prod.name}" />
      <div class="prod-name">${prod.name}</div>
    `;
    card.onclick = () => openProductModal(prod);
    productsSection.appendChild(card);
  });
}

function openProductModal(prod) {
  productModal.className = 'modal visible';
  productModal.innerHTML = `
    <div class="modal-content" style="position:relative">
      <button class="close-btn" title="Cerrar">&times;</button>
      <img src="${prod.img}" alt="${prod.name}" />
      <div class="prod-name">${prod.name}</div>
      <div class="prod-desc">${prod.desc}</div>
      <div class="prod-price">$${prod.price} MXN</div>
      <button class="buy-btn">Comprar</button>
    </div>
  `;
  productModal.querySelector('.close-btn').onclick = closeProductModal;
  productModal.querySelector('.buy-btn').onclick = () => {
    addToCart(prod);
    closeProductModal();
  }
  productModal.onclick = (e) => {
    if (e.target === productModal) closeProductModal();
  }
}
function closeProductModal() {
  productModal.className = 'modal hidden';
}

function addToCart(prod) {
  const idx = cart.findIndex(p => p.id === prod.id);
  if (idx >= 0) {
    cart[idx].qty += 1;
  } else {
    cart.push({...prod, qty: 1});
  }
  updateCartCount();
  showToast(`${prod.name} agregado al carrito`);
}

function updateCartCount() {
  const count = cart.reduce((a, p) => a + p.qty, 0);
  cartCount.textContent = count;
}

cartBtn.onclick = () => openCart();
function openCart() {
  cartModal.className = 'modal visible';
  cartModal.innerHTML = `
    <div class="modal-content" style="position:relative">
      <button class="close-btn" title="Cerrar">&times;</button>
      <h2 style="margin:0 0 1.2rem 0;text-align:center;">Carrito</h2>
      <div class="cart-list">
        ${cart.length === 0 ? 
          `<div style="text-align:center;color:#888;">Tu carrito está vacío</div>` :
          cart.map(item => `
          <div class="cart-item">
            <div class="prod-info">
              <span class="prod-name">${item.name}</span>
              <span class="prod-price">$${item.price} x ${item.qty}</span>
            </div>
            <button title="Quitar" onclick="removeCartItem(${item.id})">&times;</button>
          </div>`).join('')}
      </div>
      <div class="cart-total">Total: $${cart.reduce((a, p) => a + p.price * p.qty, 0)} MXN</div>
      ${cart.length > 0 ? `<button class="pay-btn" id="pay-btn">Pagar</button>` : ""}
    </div>
  `;
  cartModal.querySelector('.close-btn').onclick = closeCart;
  if (cart.length > 0) {
    cartModal.querySelector('#pay-btn').onclick = payWhatsapp;
  }
  cartModal.onclick = (e) => {
    if (e.target === cartModal) closeCart();
  }
}
function closeCart() {
  cartModal.className = 'modal hidden';
}
window.removeCartItem = (id) => {
  cart = cart.filter(item => item.id !== id);
  updateCartCount();
  openCart();
}

function payWhatsapp() {
  const text = encodeURIComponent(
    `¡Hola! Quiero realizar este pedido:\n` +
    cart.map(p => `${p.qty}x ${p.name} - $${p.price * p.qty} MXN`).join('\n') +
    `\nTotal: $${cart.reduce((a, p) => a + p.price * p.qty, 0)} MXN`
  );
  window.open(`https://wa.me/5214421682159?text=${text}`, "_blank");
}


searchBtn.onclick = () => {
  const term = prompt('¿Qué producto buscas?');
  if (term) {
    const filtered = PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(term.toLowerCase())
    );
    if (filtered.length) renderProducts(filtered);
    else alert('No se encontraron productos.'); 
  }
}


function showToast(msg) {
  let toast = document.createElement('div');
  toast.style = `
    position:fixed;bottom:40px;left:50%;transform:translateX(-50%);
    background:var(--primary);color:#fff;padding:0.8rem 1.6rem;
    border-radius:7px;box-shadow:var(--shadow);font-size:1rem;z-index:2000;
    opacity:0;transition:opacity .18s;
  `;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(()=>toast.style.opacity=1, 10);
  setTimeout(()=>{toast.style.opacity=0;setTimeout(()=>toast.remove(),310)}, 1200);
}

renderProducts(PRODUCTS);
updateCartCount();