import { Router } from "express";
//importacion del productManager
import path from 'path';
import __dirname from '../utils.js';
import ProductManager from '../productManager.js';

const productManager = new ProductManager(path.join(__dirname, 'data', 'products.json'));

const router = Router();

// Ruta para la página principal
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { 
        products, 
        style: 'home.css' });
});

// Ruta para la página de productos en tiempo real
router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {
        style: 'realtimeproducts.css'
    });
});

export default router