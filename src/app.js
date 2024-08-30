import express from "express";
import productsRouter from "./routes/products.js";
import cartsRouter from "./routes/carts.js";

//Configuracion basica
const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//Archivos estaticos
app.use('/static', express.static('public'));

//Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter)


app.get('/', (req, res) => {
    res.send('Hola mundo');
});

const server = app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});