import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

const filePath = path.resolve("./src/json/carts.json");

// Función para leer el archivo JSON
const readCarts = async () => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
};

// Función para escribir en el archivo JSON
const writeCarts = async (carts) => {
    await fs.writeFile(filePath, JSON.stringify(carts, null, 2));
};

// Función para generar un ID único
// Función para generar un ID único
function generateUniqueId(carts) {
    let newId;
    do {
        newId = Math.floor(Math.random() * 10000);
    } while (carts.some(cart => cart.id === newId));
    return newId;
}


//GET
router.get("/", async (req, res) => {
    const carts = await readCarts();
    res.send(carts);
});

//GET por ID
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    const carts = await readCarts();
    const cart = carts.find(c => c.id === parseInt(cid));
    res.send(cart || { error: "Carrito no encontrado" });
});

//POST
router.post("/", async (req, res) => {
    const carts = await readCarts();
    const cart = { id: generateUniqueId(carts), ...req.body };
    carts.push(cart);
    await writeCarts(carts);
    res.send(cart);
});

//POST producto en carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    let { quantity } = req.body;

    if (quantity === undefined) quantity = 1;
    const carts = await readCarts();
    const cart = carts.find(c => c.id === parseInt(cid));

     if (!cart) {
        return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productExist = cart.products.find(product => product.idProduct === parseInt(pid));

    if (productExist) {
        productExist.quantity += quantity;
    } else {
        cart.products.push({ idProduct: parseInt(pid), quantity: quantity });
    }

    await writeCarts(carts);
    res.send(cart);
});

export default router;