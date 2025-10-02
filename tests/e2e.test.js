const { test, expect } = require('@playwright/test');

// utility to avoid duplication in tests
function randomSuffix() {
    return Math.random().toString(36).slice(2, 8);
}

test.describe('E-commerce app', () => {
    test('home page renders with heading', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle(/E-commerce Application/);
        await expect(page.getByRole('heading', { name: /E-commerce Application/ })).toBeVisible();
    });

    test('can create and fetch a customer', async ({ request }) => {
        const newCustomer = {
            email: `user_${randomSuffix()}@example.com`,
            password: 'TestPassword123',
            first_name: 'Test',
            last_name: 'User',
            phone_number: '1234567890',
            shipping_address: '123 Main Street',
        };

        const res = await request.post('/api/customers/', { data: newCustomer });
        expect(res.ok()).toBeTruthy();
        expect(res.status()).toBe(201);

        const created = await res.json();
        expect(created.email).toBe(newCustomer.email);
        expect(created.first_name).toBe(newCustomer.first_name);
        expect(created.last_name).toBe(newCustomer.last_name);
        expect(created.shipping_address).toBe(newCustomer.shipping_address);
        expect(typeof created.customer_id).toBe('number');

        // fetch customers list
        const listRes = await request.get('/api/customers/');
        const customers = await listRes.json();
        expect(customers.some(c => c.customer_id === created.customer_id)).toBe(true);
    });

    test('can create and fetch a product', async ({ request }) => {
        const newProduct = {
            name: `Test Product ${randomSuffix()}`,
            description: 'A product created by tests',
            price: 49.99,
            stock_quantity: 10
        };

        const res = await request.post('/api/products/', { data: newProduct });
        expect(res.ok()).toBeTruthy();
        expect(res.status()).toBe(201);

        const created = await res.json();
        expect(created.name).toBe(newProduct.name);
        expect(created.description).toBe(newProduct.description);
        expect(created.price).toBe(newProduct.price);
        expect(created.stock_quantity).toBe(newProduct.stock_quantity);
        expect(typeof created.product_id).toBe('number');

        // fetch single product
        const getResponse = await request.get(`/api/products/${created.product_id}`);
        const fetched = await getResponse.json();
        expect(fetched.product_id).toBe(created.product_id);
        expect(fetched.name).toBe(newProduct.name);
    });

    test('can create an order (with existing customer + product)', async ({ request }) => {
        // create a customer
        const customer = {
            email: `buyer_${randomSuffix()}@example.com`,
            password: 'OrderPass123',
            first_name: 'Order',
            last_name: 'Tester',
            phone_number: '1112223333',
            shipping_address: '456 Order Street',
        };
        const custRes = await request.post('/api/customers/', { data: customer });
        const createdCustomer = await custRes.json();

        // create a product
        const product = {
            name: `Order Product ${randomSuffix()}`,
            description: 'A product for order testing',
            price: 25.50,
            stock_quantity: 20
        };
        const prodRes = await request.post('/api/products/', { data: product });
        const createdProduct = await prodRes.json();

        // place an order
        const order = {
            user_id: createdCustomer.customer_id,
            shipping_address: createdCustomer.shipping_address,
            items: [
                {
                    product_id: createdProduct.product_id,
                    quantity: 2,
                    price_at_purchase: createdProduct.price
                }
            ]
        };
        const orderRes = await request.post('/api/orders/', { data: order });
        expect(orderRes.ok()).toBeTruthy();
        expect(orderRes.status()).toBe(201);

        const createdOrder = await orderRes.json();
        expect(createdOrder.user_id).toBe(createdCustomer.customer_id);
        expect(createdOrder.items[0].product_id).toBe(createdProduct.product_id);
        expect(createdOrder.items[0].quantity).toBe(2);
        expect(createdOrder.status).toBe('pending'); 
    });

    test('can list orders', async ({ request }) => {
        const res = await request.get('/api/orders/');
        expect(res.ok()).toBeTruthy();
        const orders = await res.json();
        expect(Array.isArray(orders)).toBe(true);
    });
});