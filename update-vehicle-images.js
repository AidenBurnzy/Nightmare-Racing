const fs = require('fs');
const path = require('path');

// Mapping for special cases
const imageMap = {
  'land-rover.html': 'landRover.jpg',
  'mercedes-benz.html': 'mercedes-benz.jpg',
  'other-makes.html': 'otherMakes.jpg'
};

const vehiclesDir = './src/pages/vehicles';
const files = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.html'));

const updates = [];

files.forEach(filename => {
  const filepath = path.join(vehiclesDir, filename);
  let content = fs.readFileSync(filepath, 'utf8');
  
  // Determine the image filename
  let imageName;
  if (imageMap[filename]) {
    imageName = imageMap[filename];
  } else {
    // Replace .html with .jpg
    imageName = filename.replace('.html', '.jpg');
  }
  
  // Check if file has the vehicle-hero header
  if (content.includes('class="vehicle-hero"')) {
    // Match the actual pattern from the file
    const oldPattern = /(<header class="vehicle-hero" style=")background: linear-gradient\(180deg, rgba\(10, 10, 10, 0\.35\) 0%, rgba\(10, 10, 10, 0\.9\) 70%\), url\('[^']+'\)(";)/;
    
    if (oldPattern.test(content)) {
      const newStyle = `$1--hero-bg: url('../../vehicleImages/${imageName}'); background: linear-gradient(180deg, rgba(10, 10, 10, 0.35) 0%, rgba(10, 10, 10, 0.9) 70%), var(--hero-bg)$2`;
      const updated = content.replace(oldPattern, newStyle);
      
      fs.writeFileSync(filepath, updated, 'utf8');
      updates.push({ filename, imageName, status: 'updated' });
    } else {
      updates.push({ filename, imageName, status: 'pattern not found' });
    }
  } else {
    updates.push({ filename, imageName, status: 'vehicle-hero not found' });
  }
});

console.log('Update Summary:');
console.log('===============');
let successCount = 0;
updates.forEach(u => {
  if (u.status === 'updated') {
    console.log(`✓ ${u.filename} → ${u.imageName}`);
    successCount++;
  } else {
    console.log(`✗ ${u.filename}: ${u.status}`);
  }
});
console.log(`\nTotal updated: ${successCount}/${updates.length}`);
