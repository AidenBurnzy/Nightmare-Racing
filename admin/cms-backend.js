// cms-backend.js - Custom backend for Netlify CMS to save cars to database
// This allows the admin panel to save directly to your Neon database

import { addCar, updateCar, deleteCar, getAllCars } from '../database/database.js';

class DatabaseBackend {
    constructor(config, options = {}) {
        this.config = config;
        this.options = options;
    }

    async getEntry(collection, slug) {
        try {
            const cars = await getAllCars();
            const car = cars.find(c => this.generateSlug(c) === slug);
            
            if (!car) {
                throw new Error(`Car not found: ${slug}`);
            }

            return {
                file: { path: `${slug}.json` },
                data: this.formatCarForCMS(car)
            };
        } catch (error) {
            console.error('Error getting entry:', error);
            throw error;
        }
    }

    async getMedia() {
        // Return empty array - images handled by Netlify's media library
        return [];
    }

    async entriesByCollection(collection) {
        try {
            const cars = await getAllCars();
            
            return cars.map(car => ({
                file: { path: `${this.generateSlug(car)}.json` },
                data: this.formatCarForCMS(car)
            }));
        } catch (error) {
            console.error('Error getting entries:', error);
            return [];
        }
    }

    async persistEntry(config, collection, entryDraft, MediaFiles, options) {
        try {
            const carData = this.formatCarForDatabase(entryDraft.getData());
            
            if (options.mode === 'create') {
                const newCar = await addCar(carData);
                return {
                    file: { path: `${this.generateSlug(newCar)}.json` },
                    data: this.formatCarForCMS(newCar)
                };
            } else {
                // Update existing car
                const slug = entryDraft.get('slug');
                const cars = await getAllCars();
                const existingCar = cars.find(c => this.generateSlug(c) === slug);
                
                if (existingCar) {
                    const updatedCar = await updateCar(existingCar.id, carData);
                    return {
                        file: { path: `${slug}.json` },
                        data: this.formatCarForCMS(updatedCar)
                    };
                }
            }
        } catch (error) {
            console.error('Error persisting entry:', error);
            throw error;
        }
    }

    async deleteEntry(collection, slug) {
        try {
            const cars = await getAllCars();
            const car = cars.find(c => this.generateSlug(c) === slug);
            
            if (car) {
                await deleteCar(car.id);
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    }

    // Helper methods
    generateSlug(car) {
        return car.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    formatCarForCMS(car) {
        return {
            basic_info: {
                name: car.name,
                description: car.description,
                status: car.status,
                featured: car.featured
            },
            photos: {
                mainImage: car.mainImage,
                gallery: car.gallery || []
            },
            specs: car.specs || {},
            dateAdded: car.dateAdded
        };
    }

    formatCarForDatabase(cmsData) {
        const sanitizeImageValue = (value) => {
            if (typeof value !== 'string') {
                return value;
            }

            const trimmed = value.trim();
            if (!trimmed) {
                return null;
            }

            if (trimmed.startsWith('data:image')) {
                console.warn('Image data URL detected in CMS entry; skipping to avoid oversized database payloads. Please upload images to the media library or provide a hosted URL.');
                return null;
            }

            return trimmed;
        };

        const sanitizeGallery = (gallery) => {
            if (!Array.isArray(gallery)) {
                return [];
            }

            return gallery
                .map((item) => {
                    if (!item) return null;

                    if (typeof item === 'string') {
                        const sanitized = sanitizeImageValue(item);
                        return sanitized ? sanitized : null;
                    }

                    if (typeof item === 'object') {
                        const sanitizedUrl = sanitizeImageValue(item.url || item.image);
                        if (!sanitizedUrl) {
                            return null;
                        }

                        return {
                            ...item,
                            url: sanitizedUrl,
                            image: undefined
                        };
                    }

                    return null;
                })
                .filter(Boolean);
        };

        return {
            name: cmsData.basic_info?.name || '',
            description: cmsData.basic_info?.description || '',
            mainImage: sanitizeImageValue(cmsData.photos?.mainImage) || null,
            gallery: sanitizeGallery(cmsData.photos?.gallery),
            specs: cmsData.specs || {},
            status: cmsData.basic_info?.status || 'COMPLETED',
            featured: cmsData.basic_info?.featured || true
        };
    }
}

// Register the backend
if (typeof window !== 'undefined' && window.CMS) {
    window.CMS.registerBackend('database', DatabaseBackend);
}