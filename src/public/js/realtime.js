const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    
    socket.emit('newProduct', { name, price });
    
    productForm.reset();
});

socket.on('updateProducts', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.textContent = `${product.name} - $${product.price}`;
        productList.appendChild(li);
    });
});