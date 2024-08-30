import { Router } from "express";
import fs from "fs/promises";
import path from "path";

const router = Router();

const filePath = path.resolve("./src/json/products.json");

// Función para leer el archivo JSON
const readProducts = async () => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
};

// Función para escribir en el archivo JSON
const writeProducts = async (products) => {
    await fs.writeFile(filePath, JSON.stringify(products, null, 2));
};

// Función para generar un ID único
function generateUniqueId(products) {
    let newId;
    do {
        newId = Math.floor(Math.random() * 10000);
    } while (products.some(product => product.id === newId));
    return newId;
}


//GET
router.get("/", async (req, res) => {
    const products = await readProducts();
    res.send(products);
});

//GET por ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await readProducts();
    const product = products.find(p => p.id === parseInt(pid));
    res.send(product || { error: "Producto no encontrado" });
});

//POST
router.post("/", async (req, res) => {
    const products = await readProducts();
    const product = { id: generateUniqueId(products), ...req.body };
    products.push(product);
    await writeProducts(products);
    res.send(product);
});

//PUT por ID
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await readProducts();
    const index = products.findIndex(p => p.id === parseInt(pid));

    if (index !== -1) {
        products[index] = { ...products[index], ...req.body };
        await writeProducts(products);
        res.send(products[index]);
    } else {
        res.send({ error: "Producto no encontrado" });
    }
});

//DELETE por ID
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    const products = await readProducts();
    const newProducts = products.filter(p => p.id !== parseInt(pid));

    if (newProducts.length !== products.length) {
        await writeProducts(newProducts);
        res.send({ status: "success" });
    } else {
        res.send({ error: "Producto no encontrado" });
    }
});


export default router;