-- Nightmare Racing Database Schema
-- Creates tables for storing car data that will be used by both carousel and featured cars page

-- Cars table - main table for all car data
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    main_image TEXT, -- URL to main image
    status VARCHAR(50) DEFAULT 'COMPLETED', -- COMPLETED, IN PROGRESS, FEATURED BUILD, CUSTOMER CAR
    featured BOOLEAN DEFAULT true,
    date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car specs table - stores performance specifications
CREATE TABLE IF NOT EXISTS car_specs (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    zero_to_sixty VARCHAR(20), -- e.g., "2.8s"
    top_speed VARCHAR(20), -- e.g., "220mph"
    horsepower VARCHAR(20), -- e.g., "1200HP"
    engine TEXT,
    weight VARCHAR(20),
    custom1 VARCHAR(100), -- flexible custom spec
    custom2 VARCHAR(100), -- flexible custom spec
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Car gallery table - stores multiple images per car
CREATE TABLE IF NOT EXISTS car_gallery (
    id SERIAL PRIMARY KEY,
    car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_order INTEGER DEFAULT 0, -- for ordering images
    caption TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for demonstration
INSERT INTO cars (name, description, main_image, status, featured, date_added) VALUES
('Twin-Turbo Supra', '1200HP Beast • Custom Build', NULL, 'COMPLETED', true, '2025-01-15T00:00:00Z'),
('Widebody GTR', 'Track Weapon • Full Build', NULL, 'COMPLETED', true, '2025-01-10T00:00:00Z'),
('Project Nightfall', 'Stealth Build • Coming Soon', NULL, 'IN PROGRESS', true, '2025-01-05T00:00:00Z'),
('Turbo Mustang', 'American Muscle • 900HP', NULL, 'COMPLETED', true, '2025-01-01T00:00:00Z'),
('Drift Special', 'Sideways Master • Competition Ready', NULL, 'FEATURED BUILD', true, '2024-12-25T00:00:00Z');

-- Insert sample specs
INSERT INTO car_specs (car_id, zero_to_sixty, top_speed, horsepower) VALUES
(1, '2.8s', '220mph', '1200HP'),
(2, '2.5s', NULL, '1000HP'),
(3, NULL, NULL, NULL),
(4, '3.2s', '200mph', '900HP'),
(5, NULL, NULL, '600HP');

-- Update car_specs for Project Nightfall and Drift Special with custom specs
UPDATE car_specs SET custom1 = 'Classified', custom2 = 'Top Secret' WHERE car_id = 3;
UPDATE car_specs SET custom1 = 'Drift Ready', custom2 = 'Competition' WHERE car_id = 5;
UPDATE car_specs SET custom1 = 'Track Tested' WHERE car_id = 2;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured);
CREATE INDEX IF NOT EXISTS idx_cars_date_added ON cars(date_added DESC);
CREATE INDEX IF NOT EXISTS idx_car_gallery_car_id ON car_gallery(car_id);
CREATE INDEX IF NOT EXISTS idx_car_gallery_order ON car_gallery(car_id, image_order);