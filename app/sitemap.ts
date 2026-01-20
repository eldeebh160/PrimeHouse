import { MetadataRoute } from 'next';
import db from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://primehousetrading.com'; // Change this to your actual domain

    // Static routes
    const routes: MetadataRoute.Sitemap = [
        '',
        '/shop',
        '/appointments',
        '/services/booking',
        '/about',
        '/privacy',
        '/terms',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic products
    const productsResult = await db.execute('SELECT id, created_at FROM products');
    const products = productsResult.rows as any[];
    const productRoutes = products.map((product) => ({
        url: `${baseUrl}/shop/${product.id}`,
        lastModified: new Date(), // Ideally use product.updated_at if available
        changeFrequency: 'daily' as const,
        priority: 0.9,
    }));

    // Dynamic categories
    const categoriesResult = await db.execute('SELECT id FROM categories');
    const categories = categoriesResult.rows as any[];
    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/shop?category=${cat.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...productRoutes, ...categoryRoutes];
}
