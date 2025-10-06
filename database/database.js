// database.js - Database integration for Nightmare Racing
// Uses Netlify Neon database for car data storage and retrieval

import { neon } from '@neondatabase/serverless';

// Initialize database connection using Netlify environment variables
const sql = neon(process.env.DATABASE_URL || process.env.NEON_DATABASE_URL);

// Database utility functions for car data management

/**
 * Get all featured cars for carousel and featured cars page
 * @param {boolean} featuredOnly - If true, only return featured cars
 * @returns {Array} Array of car objects with specs and gallery
 */
export async function getAllCars(featuredOnly = false) {
    try {
        const query = featuredOnly 
            ? `SELECT * FROM cars WHERE featured = true ORDER BY date_added DESC`
            : `SELECT * FROM cars ORDER BY date_added DESC`;
            
        const cars = await sql(query);
        
        // Get specs and gallery for each car
        const carsWithDetails = await Promise.all(
            cars.map(async (car) => {
                const [specs] = await sql`SELECT * FROM car_specs WHERE car_id = ${car.id}`;
                const gallery = await sql`SELECT * FROM car_gallery WHERE car_id = ${car.id} ORDER BY image_order`;
                
                return {
                    id: car.id,
                    name: car.name,
                    description: car.description,
                    mainImage: car.main_image,
                    gallery: gallery.map(img => img.image_url),
                    specs: specs ? {
                        zeroToSixty: specs.zero_to_sixty,
                        topSpeed: specs.top_speed,
                        horsepower: specs.horsepower,
                        engine: specs.engine,
                        weight: specs.weight,
                        custom1: specs.custom1,
                        custom2: specs.custom2
                    } : {},
                    status: car.status,
                    featured: car.featured,
                    dateAdded: car.date_added,
                    createdAt: car.created_at,
                    updatedAt: car.updated_at
                };
            })
        );
        
        return carsWithDetails;
    } catch (error) {
        console.error('Error fetching cars:', error);
        throw error;
    }
}

/**
 * Get a single car by ID or name
 * @param {number|string} identifier - Car ID or name
 * @returns {Object|null} Car object with specs and gallery
 */
export async function getCarById(identifier) {
    try {
        let car;
        
        if (typeof identifier === 'number') {
            [car] = await sql`SELECT * FROM cars WHERE id = ${identifier}`;
        } else {
            [car] = await sql`SELECT * FROM cars WHERE name = ${identifier}`;
        }
        
        if (!car) return null;
        
        const [specs] = await sql`SELECT * FROM car_specs WHERE car_id = ${car.id}`;
        const gallery = await sql`SELECT * FROM car_gallery WHERE car_id = ${car.id} ORDER BY image_order`;
        
        return {
            id: car.id,
            name: car.name,
            description: car.description,
            mainImage: car.main_image,
            gallery: gallery.map(img => ({
                url: img.image_url,
                caption: img.caption,
                order: img.image_order
            })),
            specs: specs ? {
                zeroToSixty: specs.zero_to_sixty,
                topSpeed: specs.top_speed,
                horsepower: specs.horsepower,
                engine: specs.engine,
                weight: specs.weight,
                custom1: specs.custom1,
                custom2: specs.custom2
            } : {},
            status: car.status,
            featured: car.featured,
            dateAdded: car.date_added,
            createdAt: car.created_at,
            updatedAt: car.updated_at
        };
    } catch (error) {
        console.error('Error fetching car:', error);
        throw error;
    }
}

/**
 * Add a new car to the database
 * @param {Object} carData - Car data object
 * @returns {Object} Created car object
 */
export async function addCar(carData) {
    try {
        // Insert car
        const [car] = await sql`
            INSERT INTO cars (name, description, main_image, status, featured, date_added)
            VALUES (${carData.name}, ${carData.description}, ${carData.mainImage || null}, 
                    ${carData.status || 'COMPLETED'}, ${carData.featured !== false}, 
                    ${carData.dateAdded || new Date().toISOString()})
            RETURNING *
        `;
        
        // Insert specs if provided
        if (carData.specs) {
            await sql`
                INSERT INTO car_specs (car_id, zero_to_sixty, top_speed, horsepower, engine, weight, custom1, custom2)
                VALUES (${car.id}, ${carData.specs.zeroToSixty || null}, ${carData.specs.topSpeed || null},
                        ${carData.specs.horsepower || null}, ${carData.specs.engine || null},
                        ${carData.specs.weight || null}, ${carData.specs.custom1 || null},
                        ${carData.specs.custom2 || null})
            `;
        }
        
        // Insert gallery images if provided
        if (carData.gallery && Array.isArray(carData.gallery)) {
            for (let i = 0; i < carData.gallery.length; i++) {
                const image = carData.gallery[i];
                await sql`
                    INSERT INTO car_gallery (car_id, image_url, image_order, caption)
                    VALUES (${car.id}, ${image.url || image}, ${i}, ${image.caption || null})
                `;
            }
        }
        
        return await getCarById(car.id);
    } catch (error) {
        console.error('Error adding car:', error);
        throw error;
    }
}

/**
 * Update an existing car
 * @param {number} carId - Car ID
 * @param {Object} carData - Updated car data
 * @returns {Object} Updated car object
 */
export async function updateCar(carId, carData) {
    try {
        // Update car basic info
        await sql`
            UPDATE cars 
            SET name = ${carData.name}, description = ${carData.description},
                main_image = ${carData.mainImage}, status = ${carData.status},
                featured = ${carData.featured}, updated_at = NOW()
            WHERE id = ${carId}
        `;
        
        // Update specs
        if (carData.specs) {
            await sql`
                UPDATE car_specs 
                SET zero_to_sixty = ${carData.specs.zeroToSixty || null},
                    top_speed = ${carData.specs.topSpeed || null},
                    horsepower = ${carData.specs.horsepower || null},
                    engine = ${carData.specs.engine || null},
                    weight = ${carData.specs.weight || null},
                    custom1 = ${carData.specs.custom1 || null},
                    custom2 = ${carData.specs.custom2 || null}
                WHERE car_id = ${carId}
            `;
        }
        
        // Update gallery if provided
        if (carData.gallery) {
            // Remove existing gallery
            await sql`DELETE FROM car_gallery WHERE car_id = ${carId}`;
            
            // Insert new gallery
            for (let i = 0; i < carData.gallery.length; i++) {
                const image = carData.gallery[i];
                await sql`
                    INSERT INTO car_gallery (car_id, image_url, image_order, caption)
                    VALUES (${carId}, ${image.url || image}, ${i}, ${image.caption || null})
                `;
            }
        }
        
        return await getCarById(carId);
    } catch (error) {
        console.error('Error updating car:', error);
        throw error;
    }
}

/**
 * Delete a car and all related data
 * @param {number} carId - Car ID
 * @returns {boolean} Success status
 */
export async function deleteCar(carId) {
    try {
        // Delete car (cascade will handle specs and gallery)
        await sql`DELETE FROM cars WHERE id = ${carId}`;
        return true;
    } catch (error) {
        console.error('Error deleting car:', error);
        throw error;
    }
}

/**
 * Initialize database tables (run once)
 * @returns {boolean} Success status
 */
export async function initializeDatabase() {
    try {
        // This would typically be run via SQL file or migration
        console.log('Database initialization should be run via schema.sql file');
        return true;
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}