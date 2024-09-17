const socket = io();

const productForm = document.getElementById('productForm');
const productList = document.getElementById('productList');

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    
    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, price, stock, category }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Producto agregado:', data);
        document.getElementById('productForm').reset();
    });
});

socket.on('updateProducts', (products) => {
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        const name = document.createElement('h3');
        name.textContent = `${product.name}`;
        productItem.appendChild(name);

        const description = document.createElement('p');
        description.textContent = `${product.description}`;
        productItem.appendChild(description);

        const price = document.createElement('li');
        price.textContent = `$${product.price}`;
        productItem.appendChild(price);

        const stock = document.createElement('li');
        stock.textContent = `${product.stock} unidades`;
        productItem.appendChild(stock);

        const category = document.createElement('li');
        category.textContent = `${product.category}`;
        productItem.appendChild(category);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            socket.emit('deleteProduct', product.id);
        });
        productItem.appendChild(deleteButton);

        productList.appendChild(productItem);


    });

    
function deleteProduct(id) {
    fetch(`/api/products/${id}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Producto eliminado con éxito');
            } else {
                console.error('Error al eliminar el producto');
            }
        });
}
});