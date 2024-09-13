import fs from 'fs/promises';

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async addProduct(product) {
        const products = await this.getProducts();
        const newProduct = {
            id: products.length + 1,
            ...product
        };
        products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async deleteProduct(id) {
        let products = await this.getProducts();
        const initialLength = products.length;
        products = products.filter(product => product.id !== id);
        
        if (products.length < initialLength) {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2));
            return true;  // Producto eliminado con éxito
        }
        return false;  // Producto no encontrado
    }
}

export default ProductManager;