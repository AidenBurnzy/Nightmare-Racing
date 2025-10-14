// api-cars.js - API endpoints for car data
// Direct database connection for Netlify Functions

const { neon } = require('@neondatabase/serverless');

let carVideosSupported = true;

const sanitizeMediaUrl = (rawUrl) => {
    if (typeof rawUrl !== 'string') return null;

    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    if (trimmed.startsWith('data:image') || trimmed.startsWith('data:video')) {
        return null;
    }

    return trimmed;
};

const parseGalleryItems = (rawGallery) => {
    if (Array.isArray(rawGallery)) return rawGallery;
    if (typeof rawGallery === 'string' && rawGallery.trim()) {
        try {
            return JSON.parse(rawGallery);
        } catch (error) {
            return [];
        }
    }
    return [];
};

const fetchCarsQuery = async (sql) => {
    if (carVideosSupported) {
        try {
            return await sql`
                SELECT
                    c.id,
                    c.year,
                    c.make,
                    c.model,
                    c.name,
                    c.description,
                    c.mechanics,
                    c.main_image,
                    c.status,
                    c.featured,
                    c.date_added,
                    COALESCE(g.gallery, '[]'::json) AS gallery,
                    COALESCE(v.videos, '[]'::json) AS videos
                FROM cars c
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'url', cg.image_url,
                            'order', cg.image_order,
                            'caption', cg.caption
                        )
                        ORDER BY cg.image_order
                    ) FILTER (WHERE cg.image_url IS NOT NULL) AS gallery
                    FROM car_gallery cg
                    WHERE cg.car_id = c.id
                ) g ON TRUE
                LEFT JOIN LATERAL (
                    SELECT json_agg(
                        json_build_object(
                            'url', cv.video_url,
                            'order', cv.video_order,
                            'caption', cv.caption
                        )
                        ORDER BY cv.video_order
                    ) FILTER (WHERE cv.video_url IS NOT NULL) AS videos
                    FROM car_videos cv
                    WHERE cv.car_id = c.id
                ) v ON TRUE
                ORDER BY c.date_added DESC
            `;
        } catch (error) {
            if (error?.code === '42P01') {
                console.warn('car_videos table missing; continuing without video support');
                carVideosSupported = false;
            } else {
                throw error;
            }
        }
    }

    return await sql`
        SELECT
            c.id,
            c.year,
            c.make,
            c.model,
            c.name,
            c.description,
            c.mechanics,
            c.main_image,
            c.status,
            c.featured,
            c.date_added,
            COALESCE(g.gallery, '[]'::json) AS gallery,
            '[]'::json AS videos
        FROM cars c
        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    'url', cg.image_url,
                    'order', cg.image_order,
                    'caption', cg.caption
                )
                ORDER BY cg.image_order
            ) FILTER (WHERE cg.image_url IS NOT NULL) AS gallery
            FROM car_gallery cg
            WHERE cg.car_id = c.id
        ) g ON TRUE
        ORDER BY c.date_added DESC
    `;
};

exports.handler = async (event) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const databaseUrl = process.env.NETLIFY_DATABASE_URL || process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

        if (!databaseUrl) {
            console.error('❌ No database URL found in environment variables');
            console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Database configuration missing',
                    message: 'NETLIFY_DATABASE_URL environment variable not set',
                    hint: 'Make sure the Neon extension is enabled in your Netlify dashboard'
                })
            };
        }

        const sql = neon(databaseUrl);

        if (event.httpMethod === 'GET') {
            const cars = await fetchCarsQuery(sql);

            const transformedCars = cars.map(car => {
                const galleryItems = parseGalleryItems(car.gallery);
                const galleryUrls = galleryItems
                    .map(item => {
                        if (!item) return null;
                        if (typeof item === 'string') return sanitizeMediaUrl(item);
                        if (typeof item.url === 'string') return sanitizeMediaUrl(item.url);
                        return null;
                    })
                    .filter(Boolean);

                const videoItems = Array.isArray(car.videos) ? car.videos : [];
                const videos = videoItems
                    .map(item => {
                        if (!item) return null;
                        if (typeof item === 'string') {
                            const url = sanitizeMediaUrl(item);
                            if (!url) return null;
                            return { url, caption: null };
                        }
                        if (typeof item.url === 'string') {
                            const url = sanitizeMediaUrl(item.url);
                            if (!url) return null;
                            return {
                                url,
                                caption: item.caption || null
                            };
                        }
                        return null;
                    })
                    .filter(Boolean);

                return {
                    id: car.id,
                    year: car.year,
                    make: car.make,
                    model: car.model,
                    name: car.name,
                    description: car.description,
                    mechanics: car.mechanics,
                    mainImage: sanitizeMediaUrl(car.main_image),
                    gallery: galleryUrls,
                    videos,
                    status: car.status,
                    featured: car.featured,
                    dateAdded: car.date_added
                };
            });

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(transformedCars)
            };
        }

        if (event.httpMethod === 'POST') {
            const carData = JSON.parse(event.body);

            const sanitizedMainImage = sanitizeMediaUrl(carData.mainImage) || null;

            const [newCar] = await sql`
                INSERT INTO cars (year, make, model, name, description, mechanics, main_image, status, featured, date_added)
                VALUES (
                    ${carData.year || null},
                    ${carData.make || null},
                    ${carData.model || null},
                    ${carData.name},
                    ${carData.description},
                    ${carData.mechanics || null},
                    ${sanitizedMainImage},
                    ${carData.status || 'COMPLETED'},
                    ${carData.featured !== false},
                    ${carData.dateAdded || new Date().toISOString()}
                )
                RETURNING id, year, make, model, name, description, mechanics, main_image, status, featured, date_added
            `;

            if (Array.isArray(carData.gallery) && carData.gallery.length > 0) {
                for (let i = 0; i < carData.gallery.length; i++) {
                    const image = carData.gallery[i];
                    if (!image) continue;
                    const imageUrl = typeof image === 'string' ? image : image.url;
                    const caption = typeof image === 'object' ? image.caption : null;
                    const sanitizedUrl = sanitizeMediaUrl(imageUrl);
                    if (!sanitizedUrl) continue;

                    await sql`
                        INSERT INTO car_gallery (car_id, image_url, image_order, caption)
                        VALUES (${newCar.id}, ${sanitizedUrl}, ${i}, ${caption})
                    `;
                }
            }

            if (carVideosSupported && Array.isArray(carData.videos) && carData.videos.length > 0) {
                try {
                    for (let i = 0; i < carData.videos.length; i++) {
                        const video = carData.videos[i];
                        if (!video) continue;
                        const videoUrl = typeof video === 'string' ? video : video.url;
                        const caption = typeof video === 'object' ? video.caption : null;
                        const sanitizedVideoUrl = sanitizeMediaUrl(videoUrl);
                        if (!sanitizedVideoUrl) continue;

                        await sql`
                            INSERT INTO car_videos (car_id, video_url, video_order, caption)
                            VALUES (${newCar.id}, ${sanitizedVideoUrl}, ${i}, ${caption})
                        `;
                    }
                } catch (insertError) {
                    if (insertError?.code === '42P01') {
                        console.warn('car_videos table missing during insert; skipping video persistence');
                        carVideosSupported = false;
                    } else {
                        throw insertError;
                    }
                }
            } else if (!carVideosSupported && Array.isArray(carData.videos) && carData.videos.length > 0) {
                console.warn('Skipping video persistence because car_videos table is unavailable');
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    id: newCar.id,
                    year: newCar.year,
                    make: newCar.make,
                    model: newCar.model,
                    name: newCar.name,
                    description: newCar.description,
                    mechanics: newCar.mechanics,
                    mainImage: newCar.main_image,
                    status: newCar.status,
                    featured: newCar.featured,
                    dateAdded: newCar.date_added
                })
            };
        }

        if (event.httpMethod === 'PUT') {
            const pathParts = event.path.split('/');
            const carId = pathParts[pathParts.length - 1];
            const carData = JSON.parse(event.body);

            await sql`
                UPDATE cars
                SET year = ${carData.year || null},
                    make = ${carData.make || null},
                    model = ${carData.model || null},
                    name = ${carData.name},
                    description = ${carData.description},
                    mechanics = ${carData.mechanics || null},
                    main_image = ${sanitizeMediaUrl(carData.mainImage)},
                    status = ${carData.status},
                    featured = ${carData.featured}
                WHERE id = ${carId}
            `;

            await sql`DELETE FROM car_gallery WHERE car_id = ${carId}`;

            if (Array.isArray(carData.gallery) && carData.gallery.length > 0) {
                for (let i = 0; i < carData.gallery.length; i++) {
                    const image = carData.gallery[i];
                    if (!image) continue;
                    const imageUrl = typeof image === 'string' ? image : image?.url;
                    const caption = typeof image === 'object' ? image.caption : null;
                    const sanitizedUrl = sanitizeMediaUrl(imageUrl);
                    if (!sanitizedUrl) continue;

                    await sql`
                        INSERT INTO car_gallery (car_id, image_url, image_order, caption)
                        VALUES (${carId}, ${sanitizedUrl}, ${i}, ${caption})
                    `;
                }
            }

            if (carVideosSupported) {
                try {
                    await sql`DELETE FROM car_videos WHERE car_id = ${carId}`;

                    if (Array.isArray(carData.videos) && carData.videos.length > 0) {
                        for (let i = 0; i < carData.videos.length; i++) {
                            const video = carData.videos[i];
                            if (!video) continue;
                            const videoUrl = typeof video === 'string' ? video : video.url;
                            const caption = typeof video === 'object' ? video.caption : null;
                            const sanitizedVideoUrl = sanitizeMediaUrl(videoUrl);
                            if (!sanitizedVideoUrl) continue;

                            await sql`
                                INSERT INTO car_videos (car_id, video_url, video_order, caption)
                                VALUES (${carId}, ${sanitizedVideoUrl}, ${i}, ${caption})
                            `;
                        }
                    }
                } catch (videoError) {
                    if (videoError?.code === '42P01') {
                        console.warn('car_videos table missing during update; skipping video persistence');
                        carVideosSupported = false;
                    } else {
                        throw videoError;
                    }
                }
            } else if (Array.isArray(carData.videos) && carData.videos.length > 0) {
                console.warn('Skipping video persistence because car_videos table is unavailable');
            }

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Car updated successfully' })
            };
        }

        if (event.httpMethod === 'DELETE') {
            const pathParts = event.path.split('/');
            const carId = pathParts[pathParts.length - 1];

            await sql`DELETE FROM cars WHERE id = ${carId}`;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Car deleted successfully' })
            };
        }

        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                error: 'Method not allowed',
                message: `${event.httpMethod} method not supported`
            })
        };
    } catch (error) {
        console.error('❌ Database error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Database connection failed',
                message: error.message,
                details: 'Check Netlify function logs for more information'
            })
        };
    }
};
