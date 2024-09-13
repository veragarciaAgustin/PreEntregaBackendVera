//imports relevantes
import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from "socket.io";
import path from 'path';
import __dirname from './utils.js';
//importacion de rutas
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";
//importacion del productManager
import ProductManager from './productManager.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

//Rutas
app.use('/api/products', productsRouter(io));
app.use('/api/carts', cartsRouter)


// Ruta para la página principal
app.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { 
        products, 
        style: 'home.css' });
});

// Ruta para la página de productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        style: 'realtimeproducts.css'
    });
});

// Configurar Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar la lista de productos al cliente cuando se conecte
    productManager.getProducts().then((products) => {
        socket.emit('updateProducts', products);
    });

    // Escuchar el evento de nuevo producto
    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });

    // Escuchar el evento de eliminar producto
    socket.on('deleteProduct', async (id) => {
        const success = await productManager.deleteProduct(parseInt(id));
        if (success) {
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        }
    });
});

// Iniciar el servidor
const port = 8080;
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});