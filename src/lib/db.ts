import fs from 'fs/promises';
import path from 'path';
import { User, Product, TopUpRequest } from './types';

const DATA_DIR = path.join(process.cwd(), 'src/data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const TOPUPS_FILE = path.join(DATA_DIR, 'topups.json');

// Ensure data directory exists
async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

// Generic read
async function readJson<T>(filePath: string, defaultValue: T): Promise<T> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data) as T;
    } catch (error) {
        return defaultValue;
    }
}

// Generic write
async function writeJson<T>(filePath: string, data: T): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Users ---
export async function getUsers(): Promise<User[]> {
    return readJson<User[]>(USERS_FILE, []);
}

export async function saveUser(user: User): Promise<void> {
    const users = await getUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }
    await writeJson(USERS_FILE, users);
}

export async function findUserByUsername(username: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find(u => u.username === username);
}

// --- Products ---
export async function getProducts(): Promise<Product[]> {
    return readJson<Product[]>(PRODUCTS_FILE, []);
}

export async function saveProduct(product: Product): Promise<void> {
    const products = await getProducts();
    const existingIndex = products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
        products[existingIndex] = product;
    } else {
        products.push(product);
    }
    await writeJson(PRODUCTS_FILE, products);
}

export async function deleteProduct(id: string): Promise<void> {
    const products = await getProducts();
    const newProducts = products.filter(p => p.id !== id);
    await writeJson(PRODUCTS_FILE, newProducts);
}

// --- TopUp Requests ---
export async function getTopUpRequests(): Promise<TopUpRequest[]> {
    return readJson<TopUpRequest[]>(TOPUPS_FILE, []);
}

export async function saveTopUpRequest(request: TopUpRequest): Promise<void> {
    const requests = await getTopUpRequests();
    const existingIndex = requests.findIndex(r => r.id === request.id);
    if (existingIndex >= 0) {
        requests[existingIndex] = request;
    } else {
        requests.push(request);
    }
    await writeJson(TOPUPS_FILE, requests);
}

export async function findTopUpRequestById(id: string): Promise<TopUpRequest | undefined> {
    const requests = await getTopUpRequests();
    return requests.find(r => r.id === id);
}
