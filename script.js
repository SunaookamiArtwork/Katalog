let products = [];

fetch("products.json")
  .then(res => res.json())
  .then(data => {

    products = data;

    products.forEach((product, index) => {
      product.id = index + 1;
    });

    renderProducts(products);

  });

const container = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const fandomSelect = document.getElementById("fandom");

let cart = [];

function renderProducts(list) {
  container.innerHTML = "";
  list.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
  <img src="${p.img}" alt="${p.name}" loading="lazy">
  <h3>${p.name}</h3>
  <p>Rp ${p.priceBuy.toLocaleString()}</p>

  <div class="btn-group">
    <button class="buy-btn">Beli</button>
  </div>
`;


    // Tombol beli
    card.querySelector(".buy-btn").addEventListener("click", () => {
  addToCart(p);
});
    container.appendChild(card);
  });
}

// Tambahkan barang ke keranjang
function addToCart(product) {

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      ...product,
      price: product.priceBuy,
      qty: 1
    });
  }

  updateCartModal();
}


// Update isi modal keranjang
function updateCartModal() {
  const list = document.getElementById("cart-items");
  const total = document.getElementById("cart-total");

  list.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const subtotal =
         item.price * item.qty;

    sum += subtotal;

    const li = document.createElement("li");
    li.classList.add("cart-row");

    li.innerHTML = `
      <span class="cart-name">
        ${item.name}
      </span>

      <div class="cart-controls">
        <button class="qty-minus">−</button>
        <span class="qty">${item.qty}</span>
        <button class="qty-plus">+</button>
      </div>

      <span class="cart-price">Rp ${subtotal.toLocaleString()}</span>

      <button class="remove-item">✖</button>
    `;

    // Tambah jumlah
    li.querySelector(".qty-plus").addEventListener("click", () => {
      item.qty++;
      updateCartModal();
    });

    // Kurangi jumlah
    li.querySelector(".qty-minus").addEventListener("click", () => {
      if (item.qty > 1) {
        item.qty--;
      } else {
        cart = cart.filter(
          x => !(x.id === item.id && x.mode === item.mode)
        );
      }
      updateCartModal();
    });

    // Hapus item
    li.querySelector(".remove-item").addEventListener("click", () => {
      cart = cart.filter(
        x => !(x.id === item.id && x.mode === item.mode)
      );
      updateCartModal();
    });

    list.appendChild(li);
  });

  // Total harga
  total.textContent = "Total: Rp " + sum.toLocaleString();

  // Badge jumlah item
  document.getElementById("cart-count").textContent = cart.reduce(
    (a, b) => a + b.qty,
    0
  );
}

// Filter produk
function filterProducts() {

  const q = searchInput.value.toLowerCase();
  const cat = categorySelect.value;
  const fandom = fandomSelect.value;

  const filtered = products.filter(p => {

    const matchesQuery =
      p.name.toLowerCase().includes(q);

    const matchesCat =
      cat === "Semua" || p.category === cat;

    const matchesFandom =
      fandom === "Semua" || p.fandom === fandom;

    return matchesQuery && matchesCat && matchesFandom;

  });

  renderProducts(filtered);
}
fandomSelect.addEventListener("change", filterProducts);
searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);

// Modal
const openCartBtn = document.getElementById("open-cart");
const cartModal = document.getElementById("cart-modal");
const closeCartBtn = document.getElementById("close-cart");

openCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

document.getElementById("wa-checkout").onclick = () => {
  let msg = "";

  cart.forEach(i => {
  msg += `${i.name} x${i.qty} - Rp ${(i.price * i.qty).toLocaleString()}\n`;
});

  msg = "*PESANAN*\n" + msg;

  window.open(
    `https://wa.me/62895806601800?text=${encodeURIComponent(msg)}`,
    "_blank"
  );
};

document.getElementById("email-checkout").onclick = () => {
  let msg = "";

  cart.forEach(i => {
  msg += `${i.name} x${i.qty} - Rp ${(i.price * i.qty).toLocaleString()}\n`;
});

  msg = "*PESANAN*\n" + msg;

  window.location.href =
    `mailto:sunaookamiartwork@gmail.com?subject=Order&body=${encodeURIComponent(msg)}`;
};

document.getElementById("ig-checkout").onclick = () => {
  window.open("https://instagram.com/sunaookamii", "_blank");
};

