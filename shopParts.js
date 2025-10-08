// shopParts.js - Enhanced with collection page navigation and accurate product counts
// Shopify Storefront API Configuration
const SHOPIFY_DOMAIN = 'nightmareracing.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '01ebdb40d541cc7fda967406889dc1b4';
const STOREFRONT_API_VERSION = '2024-01';

// Collection handle to filename mapping (normalized keys)
const COLLECTION_PAGE_MAP = {
    'shop-accessories': 'collections/collection_accessories.html',
    'accessories': 'collections/collection_accessories.html',
    'bearings': 'collections/collection_bearings.html',
    'brakes': 'collection/collection-brakes.html',
    'electronics': 'collections/collection-electronics.htmll',
    'engine': 'collections/collection-engine.html',
    'exterior': 'collections/collection-exterior.html',
    'fluids': 'collections/collection-fluids.html',
    'interior': 'collections/collection-interior.html',
    'lighting': 'collections/collection-lighting.html',
    'merchandise': 'collections/collection-merchandise.html',
    'performance': 'collections/collection-performance.html',
    'suspension': 'collections/collection-suspension.html',
    'tools': 'collections/collection-tools.html',
    'wheels-tires': 'collections/collection-wheels.html'
};

// Updated GraphQL query to get product count for each collection
const COLLECTIONS_QUERY = `
{
    collections(first: 20) {
        edges {
            node {
                id
                title
                description
                handle
                image {
                    url
                    altText
                }
                products(first: 250) {
                    edges {
                        node {
                            id
                            images(first: 1) {
                                edges {
                                    node {
                                        url
                                        altText
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}`;

const PRODUCTS_QUERY = `
query GetProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
            node {
                id
                title
                description
                handle
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
                images(first: 1) {
                    edges {
                        node {
                            url
                            altText
                        }
                    }
                }
                variants(first: 1) {
                    edges {
                        node {
                            id
                            availableForSale
                        }
                    }
                }
            }
        }
    }
}`;

const SEARCH_QUERY = `
query SearchProducts($query: String!, $first: Int!) {
    products(first: $first, query: $query) {
        edges {
            node {
                id
                title
                handle
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                }
                images(first: 1) {
                    edges {
                        node {
                            url
                            altText
                        }
                    }
                }
            }
        }
    }
}`;

// API call function
async function shopifyStorefrontAPI(query, variables = {}) {
    const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN
        },
        body: JSON.stringify({ query, variables })
    });

    const data = await response.json();
    
    if (data.errors) {
        console.error('Shopify API Error:', data.errors);
        throw new Error(data.errors[0].message);
    }

    return data.data;
}

// Format price
function formatPrice(amount, currencyCode) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode
    }).format(amount);
}

// Enhanced view collection function - navigates to dedicated page
window.viewCollection = function(handle) {
    if (!handle) return;
    const h = String(handle).toLowerCase();

    // try direct and normalized forms
    if (COLLECTION_PAGE_MAP[h]) {
        window.location.href = COLLECTION_PAGE_MAP[h];
        return;
    }

    const normalizedHyphen = h.replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
    const normalizedUnderscore = h.replace(/[^a-z0-9\s_]/g, '').trim().replace(/\s+/g, '_');

    if (COLLECTION_PAGE_MAP[normalizedHyphen]) {
        window.location.href = COLLECTION_PAGE_MAP[normalizedHyphen];
        return;
    }

    if (COLLECTION_PAGE_MAP[normalizedUnderscore]) {
        window.location.href = COLLECTION_PAGE_MAP[normalizedUnderscore];
        return;
    }

    // fallback to shopify
    window.open(`https://${SHOPIFY_DOMAIN}/collections/${handle}`, '_blank');
};

// View product function
window.viewProduct = function(handle) {
    window.open(`https://${SHOPIFY_DOMAIN}/products/${handle}`, '_blank');
};

// Load collections
let collectionsData = [];

async function loadCollections() {
    try {
        const data = await shopifyStorefrontAPI(COLLECTIONS_QUERY);
        
        const excludedCollections = [
            'frontpage',
            'all'
        ];
        
        collectionsData = data.collections.edges
            .map(edge => edge.node)
            .filter(collection => !excludedCollections.includes(collection.handle));
        
        if (collectionsData.length === 0) {
            document.getElementById('collections-list-loading').innerHTML = '<p>No collections found</p>';
            return;
        }

        displayCollectionsList();
    } catch (error) {
        console.error('Error loading collections:', error);
        document.getElementById('collections-list-loading').innerHTML = 
            '<p class="error">Failed to load collections. Please try again later.</p>';
    }
}

function displayCollectionsList() {
    const list = document.getElementById('collections-list');
    const loading = document.getElementById('collections-list-loading');
    
    if (!list) return;
    
    const sortedCollections = [...collectionsData].sort((a, b) => 
        a.title.localeCompare(b.title)
    );
    
    list.innerHTML = '';
    
    sortedCollections.forEach(collection => {
        const listItem = document.createElement('li');
        const pageFile = COLLECTION_PAGE_MAP[collection.handle];
        
        if (pageFile) {
            // Link to dedicated page
            listItem.innerHTML = `
                <a href="${pageFile}">
                    ${collection.title}
                </a>
            `;
        } else {
            // Fallback to viewCollection function
            listItem.innerHTML = `
                <a href="#" onclick="viewCollection('${collection.handle}'); return false;">
                    ${collection.title}
                </a>
            `;
        }
        list.appendChild(listItem);
    });
    
    loading.classList.add('hidden');
    list.classList.remove('hidden');
}

// Load products
let productsData = [];
let productsEndCursor = null;
let hasNextPage = false;

async function loadProducts(loadMore = false) {
    try {
        const variables = {
            first: 12,
            after: loadMore ? productsEndCursor : null
        };

        const data = await shopifyStorefrontAPI(PRODUCTS_QUERY, variables);
        
        if (!loadMore) {
            productsData = [];
        }

        productsData.push(...data.products.edges.map(edge => edge.node));
        productsEndCursor = data.products.pageInfo.endCursor;
        hasNextPage = data.products.pageInfo.hasNextPage;

        displayProducts();
        
        document.getElementById('products-loading').classList.add('hidden');
        document.getElementById('products-grid').classList.remove('hidden');
        
        const loadMoreSection = document.getElementById('load-more-section');
        if (loadMoreSection) {
            if (hasNextPage) {
                loadMoreSection.classList.remove('hidden');
            } else {
                loadMoreSection.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-loading').innerHTML = 
            '<p class="error">Failed to load products. Please try again later.</p>';
    }
}

function displayProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';

    productsData.forEach(product => {
        const card = createProductCard(product);
        grid.appendChild(card);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const imageUrl = product.images.edges[0]?.node.url || 'https://via.placeholder.com/300x300/0a0a0a/e50000?text=No+Image';
    const price = formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
    );
    const isAvailable = product.variants.edges[0]?.node.availableForSale ?? true;

    card.innerHTML = `
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.title}">
            ${!isAvailable ? '<div class="sold-out-badge">Sold Out</div>' : ''}
        </div>
        <div class="product-info">
            <h3>${product.title}</h3>
            <div class="product-price">${price}</div>
            <button class="btn-view-product" onclick="viewProduct('${product.handle}')" ${!isAvailable ? 'disabled' : ''}>
                ${isAvailable ? 'View Product' : 'Out of Stock'}
            </button>
        </div>
    `;

    return card;
}

// Search functionality
let searchTimeout;
const searchInput = document.getElementById('product-search');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            if (e.target.value.trim().length >= 3) {
                performSearch(e.target.value.trim());
            } else {
                if (searchResults) searchResults.classList.add('hidden');
            }
        }, 500);
    });
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        if (searchInput) {
            const query = searchInput.value.trim();
            if (query.length >= 3) {
                performSearch(query);
            }
        }
    });
}

async function performSearch(query) {
    if (!searchResults) return;
    
    try {
        searchResults.innerHTML = '<div class="search-loading"><div class="spinner-small"></div>Searching...</div>';
        searchResults.classList.remove('hidden');

        const data = await shopifyStorefrontAPI(SEARCH_QUERY, { query, first: 10 });
        const results = data.products.edges.map(edge => edge.node);

        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            return;
        }

        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
        searchResults.innerHTML = '<div class="search-error">Search failed. Please try again.</div>';
    }
}

function displaySearchResults(results) {
    if (!searchResults) return;
    
    searchResults.innerHTML = results.map(product => {
        const imageUrl = product.images.edges[0]?.node.url || '';
        const price = formatPrice(
            product.priceRange.minVariantPrice.amount,
            product.priceRange.minVariantPrice.currencyCode
        );

        return `
            <div class="search-result-item" onclick="viewProduct('${product.handle}')">
                ${imageUrl ? `<img src="${imageUrl}" alt="${product.title}">` : ''}
                <div class="search-result-info">
                    <h4>${product.title}</h4>
                    <span class="search-result-price">${price}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Load more products
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadProducts(true);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCollections();
    loadProducts();
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (searchResults && !e.target.closest('.search-section')) {
        searchResults.classList.add('hidden');
    }
});