#!/usr/bin/env node
/**
 * migrate-base64-images.js
 *
 * Extracts any base64-encoded car images from the database, saves them to
 * `assets/cars/`, and updates the car records to reference the new static
 * asset paths.
 */

const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

const OUTPUT_DIR = path.resolve(__dirname, '..', 'assets', 'cars');

function ensureOutputDir() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'car';
}

function isDataUrl(value) {
    return typeof value === 'string' && value.trim().startsWith('data:image');
}

function decodeDataUrl(dataUrl) {
    const match = /^data:image\/(png|jpeg|jpg);base64,(.+)$/i.exec(dataUrl.trim());
    if (!match) {
        throw new Error('Unsupported data URL format');
    }

    const [, mimeExt, base64] = match;
    const extension = mimeExt.toLowerCase() === 'jpeg' ? 'jpg' : mimeExt.toLowerCase();
    const buffer = Buffer.from(base64, 'base64');
    return { extension, buffer };
}

async function migrate() {
    const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
    if (!databaseUrl) {
        console.error('❌ NETLIFY_DATABASE_URL (or DATABASE_URL) is not set.');
        process.exit(1);
    }

    const sql = neon(databaseUrl);
    ensureOutputDir();

    console.log('📡 Fetching cars...');
    const cars = await sql`
        SELECT id, name, main_image as main_image
        FROM cars
        ORDER BY id ASC
    `;

    let updatedMain = 0;
    let updatedGallery = 0;

    for (const car of cars) {
        const carSlug = slugify(car.name || `car-${car.id}`);
        const baseFileName = `${carSlug}-${car.id}`;

        // Process main image
        if (isDataUrl(car.main_image)) {
            try {
                const { buffer, extension } = decodeDataUrl(car.main_image);
                const fileName = `${baseFileName}-main.${extension}`;
                const filePath = path.join(OUTPUT_DIR, fileName);
                fs.writeFileSync(filePath, buffer);
                const relativePath = path.posix.join('/assets/cars', fileName);
                await sql`UPDATE cars SET main_image = ${relativePath} WHERE id = ${car.id}`;
                updatedMain += 1;
                console.log(`✅ Saved main image for "${car.name}" -> ${relativePath}`);
            } catch (error) {
                console.error(`❌ Failed to decode main image for "${car.name}":`, error.message);
            }
        }

        // Process gallery images
        const gallery = await sql`
            SELECT id, image_url, image_order
            FROM car_gallery
            WHERE car_id = ${car.id}
            ORDER BY image_order ASC, id ASC
        `;

        for (const galleryImage of gallery) {
            if (!isDataUrl(galleryImage.image_url)) {
                continue;
            }

            try {
                const { buffer, extension } = decodeDataUrl(galleryImage.image_url);
                const fileName = `${baseFileName}-gallery-${galleryImage.image_order ?? galleryImage.id}.${extension}`;
                const filePath = path.join(OUTPUT_DIR, fileName);
                fs.writeFileSync(filePath, buffer);
                const relativePath = path.posix.join('/assets/cars', fileName);
                await sql`UPDATE car_gallery SET image_url = ${relativePath} WHERE id = ${galleryImage.id}`;
                updatedGallery += 1;
                console.log(`✅ Saved gallery image ${galleryImage.image_order} for "${car.name}" -> ${relativePath}`);
            } catch (error) {
                console.error(`❌ Failed to decode gallery image ${galleryImage.id} for "${car.name}":`, error.message);
            }
        }
    }

    console.log('✨ Migration complete.');
    console.log(`   ◦ Updated main images: ${updatedMain}`);
    console.log(`   ◦ Updated gallery images: ${updatedGallery}`);
    console.log('   ◦ New image files saved in assets/cars/.');
}

migrate().catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
});
