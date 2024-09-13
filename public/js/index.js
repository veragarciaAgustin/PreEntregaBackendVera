const socket = io();
//

// Maneja la lista de productos
socket.on('productList', (products) => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = ''; // Limpia la lista
  products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.title} - $${product.price} - ${product.description} - ${product.code} - ${product.stock} - ${product.category}`;
      productList.appendChild(li);
  });
});

// Maneja el formulario para agregar un producto
document.getElementById('product-form').addEventListener('submit', (e) => {

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const code = document.getElementById('code').value;
  const stock = document.getElementById('stock').value;
  const category = document.getElementById('category').value
  const price = document.getElementById('price').value;

  if (title && description && code && stock && category && price) {
      // Enviarlo al servidor
      const newProduct = { title, price: parseFloat(price), description, code, stock: parseInt(stock), category };

      socket.emit('addProduct', newProduct);

      // Limpiar formulario
      document.getElementById('title').value = '';
      document.getElementById('description').value = '';
      document.getElementById('code').value = '';
      document.getElementById('stock').value = '';
      document.getElementById('category').value = '';
      document.getElementById('price').value = '';
  }
});