let tg = window.Telegram.WebApp;
tg.expand();

let menu = {};
const cart = [];

fetch('menu.json')
  .then(res => res.json())
  .then(data => {
    menu = data;
    renderCategories();
  });

function renderCategories() {
  const container = document.getElementById('categories');
  container.innerHTML = '';
  for (const category in menu) {
    const btn = document.createElement('button');
    btn.textContent = category;
    btn.onclick = () => renderDishes(category);
    container.appendChild(btn);
  }
}

function renderDishes(category) {
  const container = document.getElementById('dishes');
  container.innerHTML = `<h3>${category}</h3>`;
  menu[category].forEach(dish => {
    const div = document.createElement('div');
    div.className = 'dish-card';
    div.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
      <div style="display: inline-block; margin-left: 10px;">
        <strong>${dish.name}</strong><br>
        ${dish.price}₽<br>
        <button onclick="updateQty('${dish.name}', -1)">−</button>
        <span id="qty-${dish.name}">0</span>
        <button onclick="updateQty('${dish.name}', 1)">+</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function updateQty(name, delta) {
  const item = cart.find(i => i.name === name);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) {
      const index = cart.findIndex(i => i.name === name);
      cart.splice(index, 1);
    }
  } else if (delta > 0) {
    const { price, image } = findDishByName(name);
    cart.push({ name, qty: 1, price, image });
  }
  renderCart();
  const qtySpan = document.getElementById(`qty-${name}`);
  if (qtySpan) qtySpan.textContent = cart.find(i => i.name === name)?.qty || 0;
}

function findDishByName(name) {
  for (const cat in menu) {
    const dish = menu[cat].find(d => d.name === name);
    if (dish) return dish;
  }
}

function renderCart() {
  const container = document.getElementById('cart');
  container.innerHTML = `<h3>Корзина</h3>`;
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    container.innerHTML += `
      ${item.name} × ${item.qty} — ${item.price * item.qty}₽<br>
    `;
  });
  container.innerHTML += `<p><strong>Итого: ${total}₽</strong></p>`;
}

document.getElementById('send').addEventListener('click', () => {
  const name = document.getElementById('user_name').value.trim();
  const phone = document.getElementById('user_phone').value.trim();
  if (name.length < 2 || phone.length < 5) {
    alert('Введите корректные имя и телефон');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const order = {
    name,
    phone,
    order: cart,
    total
  };
  console.log(order); // проверка данных перед отправкой
  tg.sendData(JSON.stringify(order));
  tg.close();
});
