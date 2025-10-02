# Nightmare Racing Database Setup

## 🚀 Quick Start

Your Netlify database is ready to use! Here's how to set it up:

### 1. Deploy to Netlify First
Since the database environment variables are automatically set by Netlify:
```bash
# Commit your changes
git add .
git commit -m "Add database integration"
git push origin main
```

### 2. Test the Database Setup
Once deployed, visit your live site and test:
- Visit `your-site.netlify.app/test-database.html` for database testing
- Check the carousel and featured cars page

### 3. For Local Development (Optional)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your site
netlify link

# Run locally with Netlify environment
netlify dev
```

## 🧪 Testing Your Database

### Option 1: Live Testing (Recommended)
1. Deploy your site to Netlify
2. Visit `your-site.netlify.app/test-database.html`
3. Use the test interface to:
   - Test API connection
   - View existing cars
   - Add new cars
   - Test frontend integration

### Option 2: Manual SQL Setup
If you want to set up the database manually:
1. Go to your [Neon Dashboard](https://console.neon.tech/)
2. Find your database: `sparkling-leaf-32593943`
3. Run the SQL from `database/schema.sql`

## 📊 Database Structure

Your database has 3 main tables:

### `cars` table
- `id` - Primary key
- `name` - Car name (e.g., "Twin-Turbo Supra")
- `description` - Car description
- `main_image` - URL to main image
- `status` - COMPLETED, IN PROGRESS, FEATURED BUILD, CUSTOMER CAR
- `featured` - Boolean (shows in carousel if true)
- `date_added` - When car was added

### `car_specs` table
- Performance specs (0-60, top speed, horsepower, etc.)
- Custom spec fields for flexibility

### `car_gallery` table
- Multiple images per car
- Image ordering and captions

## 🔧 API Endpoints

### GET `/api-cars`
- Get all cars
- Query params: `?featured=true` (only featured cars)

### GET `/api-cars?name=CarName`
- Get specific car by name

### POST `/api-cars`
- Add new car
- Body: JSON car object

### PUT `/api-cars/ID`
- Update existing car
- Body: JSON with updates

### DELETE `/api-cars/ID`
- Delete car and all related data

## 📝 Adding Cars

### Via API (recommended):
```javascript
const newCar = {
    name: "Custom Build",
    description: "Amazing custom car",
    mainImage: "https://example.com/image.jpg",
    specs: {
        zeroToSixty: "3.0s",
        topSpeed: "200mph",
        horsepower: "800HP"
    },
    status: "COMPLETED",
    featured: true,
    gallery: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
    ]
};

fetch('/.netlify/functions/api-cars', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCar)
});
```

### Via Admin Panel:
1. Go to `/admin`
2. Login with Netlify Identity
3. Use the car management interface (coming soon)

## 🔄 How It Works

1. **Carousel** (`cars.js`) loads featured cars from database API
2. **Featured Cars Page** (`featured-cars.js`) loads all cars from database API
3. **Database API** (`netlify/functions/api-cars.js`) handles all CRUD operations
4. **Database Layer** (`database/database.js`) provides database utilities

## 🗄️ Database Info

- **Provider**: Neon (PostgreSQL)
- **Environment Variables**: 
  - `NETLIFY_DATABASE_URL` (automatically set)
  - `NETLIFY_DATABASE_URL_UNPOOLED` (automatically set)
- **Region**: US East (Ohio)
- **Expires**: 10/9/2025 (connect Neon account to keep active)

## ⚠️ Important Notes

1. **Claim Your Database**: Connect your Neon account before 10/9/2025 to keep it active
2. **Image Storage**: Store images on a CDN or image service (Cloudinary, etc.)
3. **Environment**: Database URLs are automatically available in Netlify Functions

## 🎯 Next Steps

1. **Test the setup**: Add a car via API and see it appear in both carousel and featured cars
2. **Connect image storage**: Set up Cloudinary or similar for image hosting
3. **Extend admin panel**: Add car management UI to admin interface
4. **Claim database**: Connect Neon account to keep database active

## 🐛 Troubleshooting

### Database connection issues:
- Check that NETLIFY_DATABASE_URL is set
- Ensure database is active in Neon dashboard
- Verify @netlify/neon package is installed

### API not working:
- Test with `netlify dev` (not just opening HTML files)
- Check browser console for CORS errors
- Verify function deployment

### Cars not showing:
- Check browser console for API errors
- Verify database has sample data
- Test API endpoint directly

## 📚 Learn More

- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Neon Database](https://neon.tech/docs)
- [Netlify DB Documentation](https://docs.netlify.com/database/overview/)