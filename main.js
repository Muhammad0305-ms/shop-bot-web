let tg = window.Telegram.WebApp;
tg.expand();

const menu = {
    "Первые блюда": [
      { name: "Лагман", price: 350, image: "img/lagman.jpg" },
      { name: "Шурпа", price: 300, image: "img/shurpa.jpg" }
    ],
    "Вторые блюда": [
      { name: "Плов", price: 450, image: "img/plov.jpg" }
    ],
    "Десерты": [
      { name: "Чак-чак", price: 150, image: "img/chakchak.jpg" }
    ],
    "Напитки": [
      { name: "Чай", price: 80, image: "img/tea.jpg" },
      { name: "Айран", price: 100, image: "img/ayran.jpg" }
    ]
  };

const cart = [];

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
    div.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}" style="width: 80px; height: 80px; border-radius: 8px; object-fit: cover;">
      ${dish.name} — ${dish.price}₽ <button onclick="addToCart('${dish.name}', ${dish.price})">Добавить</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart');
  container.innerHTML = `<h3>Корзина</h3>`;
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price * item.qty;
    container.innerHTML += `
      ${item.name} × ${item.qty} — ${item.price * item.qty}₽ 
      <button onclick="removeItem(${index})">Удалить</button><br>
    `;
  });
  container.innerHTML += `<p>Итого: ${total}₽</p>`;
}

function removeItem(index) {
  cart.splice(index, 1);
  renderCart();
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
  tg.sendData(JSON.stringify(order));
  tg.close();
});

renderCategories();
