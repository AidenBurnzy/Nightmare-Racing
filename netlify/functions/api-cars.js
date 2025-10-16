// api-cars.js - API endpoints for vehicle data without featured flag
// Direct database connection for Netlify Functions

const { neon } = require('@neondatabase/serverless');

const sanitizeMediaUrl = (rawUrl) => {
    if (typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('data:image') || trimmed.startsWith('data:video')) {
        return null;
    }
    return trimmed;
};

const parseJsonArray = (value, fallback = []) => {
    if (Array.isArray(value)) {
        return value;
    }
    if (value && typeof value === 'object') {
        return Array.isArray(value) ? value : fallback;
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }
    return fallback;
};

const parseJsonObject = (value, fallback = {}) => {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        return value;
    }
    if (typeof value === 'string' && value.trim()) {
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }
    return fallback;
};

const sanitizeGalleryInput = (gallery) => {
    const items = parseJsonArray(gallery);
    return items
        .map((item) => {
            if (!item) return null;
            if (typeof item === 'string') {
                const url = sanitizeMediaUrl(item);
                return url ? { url, caption: null } : null;
            }
            if (typeof item === 'object') {
                const url = sanitizeMediaUrl(item.url || item.image);
                if (!url) {
                    return null;
                }
                const caption = typeof item.caption === 'string' && item.caption.trim() ? item.caption.trim() : null;
                return { url, caption };
            }
            return null;
        })
        .filter(Boolean);
};

const sanitizeVideosInput = (videos) => {
    const items = parseJsonArray(videos);
    return items
        .map((item) => {
            if (!item) return null;
            if (typeof item === 'string') {
                const url = sanitizeMediaUrl(item);
                return url ? { url, caption: null } : null;
            }
            if (typeof item === 'object') {
                const url = sanitizeMediaUrl(item.url || item.video);
                if (!url) {
                    return null;
                }
                const caption = typeof item.caption === 'string' && item.caption.trim() ? item.caption.trim() : null;
                return { url, caption };
            }
            return null;
        })
        .filter(Boolean);
};

const normalizeGalleryForResponse = (gallery) => {
    return sanitizeGalleryInput(gallery).map((item) => {
        if (item.caption) {
            return item;
        }
        return item.url;
    });
};

const normalizeVideosForResponse = (videos) => sanitizeVideosInput(videos);

const sanitizeSpecsInput = (specs) => parseJsonObject(specs, {});

const serializeVehicleRow = (row) => {
    return {
        id: row.id,
        year: row.year,
        make: row.make,
        model: row.model,
        name: row.name,
        description: row.description,
        mechanics: row.mechanics,
        mainImage: sanitizeMediaUrl(row.main_image),
        gallery: normalizeGalleryForResponse(row.gallery),
        videos: normalizeVideosForResponse(row.videos),
        specs: parseJsonObject(row.specs, {}),
        status: row.status,
        dateAdded: row.date_added
    };
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
            const vehicles = await sql`
                SELECT
                    id,
                    year,
                    make,
                    model,
                    name,
                    description,
                    mechanics,
                    main_image,
                    status,
                    date_added,
                    gallery,
                    videos,
                    specs
                FROM vehicle_information
                ORDER BY date_added DESC, id DESC
            `;

            const payload = vehicles.map(serializeVehicleRow);

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(payload)
            };
        }

        if (event.httpMethod === 'POST') {
            const carData = JSON.parse(event.body || '{}');

            if (!carData.name || !carData.description) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Validation error',
                        message: 'Name and description are required'
                    })
                };
            }

            const sanitizedMainImage = sanitizeMediaUrl(carData.mainImage);
            const galleryPayload = sanitizeGalleryInput(carData.gallery);
            const videosPayload = sanitizeVideosInput(carData.videos);
            const specsPayload = sanitizeSpecsInput(carData.specs);

            const [newVehicle] = await sql`
                INSERT INTO vehicle_information (
                    year,
                    make,
                    model,
                    name,
                    description,
                    mechanics,
                    main_image,
                    status,
                    gallery,
                    videos,
                    specs
                ) VALUES (
                    ${carData.year || null},
                    ${carData.make || null},
                    ${carData.model || null},
                    ${carData.name},
                    ${carData.description},
                    ${carData.mechanics || null},
                    ${sanitizedMainImage},
                    ${carData.status || 'COMPLETED'},
                    ${JSON.stringify(galleryPayload)}::jsonb,
                    ${JSON.stringify(videosPayload)}::jsonb,
                    ${JSON.stringify(specsPayload)}::jsonb
                )
                RETURNING id, year, make, model, name, description, mechanics, main_image, status, date_added, gallery, videos, specs
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify(serializeVehicleRow(newVehicle))
            };
        }

        if (event.httpMethod === 'PUT') {
            const pathParts = event.path.split('/');
            const rawId = pathParts[pathParts.length - 1];
            const vehicleId = Number.parseInt(rawId, 10);

            if (!Number.isFinite(vehicleId)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Invalid vehicle ID',
                        message: 'A numeric ID is required for updates'
                    })
                };
            }

            const carData = JSON.parse(event.body || '{}');

            if (!carData.name || !carData.description) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Validation error',
                        message: 'Name and description are required'
                    })
                };
            }

            const sanitizedMainImage = sanitizeMediaUrl(carData.mainImage);
            const galleryPayload = sanitizeGalleryInput(carData.gallery);
            const videosPayload = sanitizeVideosInput(carData.videos);
            const specsPayload = sanitizeSpecsInput(carData.specs);

            await sql`
                UPDATE vehicle_information
                SET
                    year = ${carData.year || null},
                    make = ${carData.make || null},
                    model = ${carData.model || null},
                    name = ${carData.name},
                    description = ${carData.description},
                    mechanics = ${carData.mechanics || null},
                    main_image = ${sanitizedMainImage},
                    status = ${carData.status || 'COMPLETED'},
                    gallery = ${JSON.stringify(galleryPayload)}::jsonb,
                    videos = ${JSON.stringify(videosPayload)}::jsonb,
                    specs = ${JSON.stringify(specsPayload)}::jsonb,
                    updated_at = NOW()
                WHERE id = ${vehicleId}
            `;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Vehicle updated successfully' })
            };
        }

        if (event.httpMethod === 'DELETE') {
            const pathParts = event.path.split('/');
            const rawId = pathParts[pathParts.length - 1];
            const vehicleId = Number.parseInt(rawId, 10);

            if (!Number.isFinite(vehicleId)) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        error: 'Invalid vehicle ID',
                        message: 'A numeric ID is required for deletion'
                    })
                };
            }

            await sql`DELETE FROM vehicle_information WHERE id = ${vehicleId}`;

            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ success: true, message: 'Vehicle deleted successfully' })
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
