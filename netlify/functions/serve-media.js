// serve-media.js - Streams stored blob images back to the client
const { connectLambda, getStore } = require('@netlify/blobs');

const resolveBlobStore = (event) => {
  const storeName = process.env.BLOB_STORE_NAME || 'car-images';

  let environmentConfigured = false;
  if (event?.blobs) {
    try {
      connectLambda(event);
      environmentConfigured = true;
    } catch (blobError) {
      console.warn('serve-media connectLambda warning', blobError);
    }
  }

  if (environmentConfigured || process.env.NETLIFY_BLOBS_CONTEXT) {
    return getStore(storeName);
  }

  const explicitSiteId = process.env.BLOB_STORE_SITE_ID || process.env.NETLIFY_BLOBS_SITE_ID;
  const explicitToken = process.env.BLOB_STORE_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
  const explicitEdgeUrl = process.env.BLOB_STORE_EDGE_URL || process.env.NETLIFY_BLOBS_EDGE_URL;
  const explicitApiUrl = process.env.BLOB_STORE_API_URL || process.env.NETLIFY_BLOBS_API_URL;

  if (explicitSiteId && explicitToken) {
    return getStore({
      name: storeName,
      siteID: explicitSiteId,
      token: explicitToken,
      edgeURL: explicitEdgeUrl,
      apiURL: explicitApiUrl
    });
  }

  const configurationError = new Error('BLOB_STORE_NOT_CONFIGURED');
  configurationError.code = 'BLOB_STORE_NOT_CONFIGURED';
  throw configurationError;
};

const sanitizeFilename = (name = '') => {
  if (typeof name !== 'string') {
    return 'file';
  }
  return name.replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 120) || 'file';
};

exports.handler = async (event) => {
  const method = event.httpMethod || 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    return {
      statusCode: 405,
      headers: {
        'Allow': 'GET, HEAD',
        'Content-Type': 'text/plain; charset=utf-8'
      },
      body: ''
    };
  }

  const keyParam = event.queryStringParameters?.key;
  if (!keyParam) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Missing key parameter'
    };
  }

  const key = decodeURIComponent(keyParam);

  try {
    const store = resolveBlobStore(event);
    const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });

    if (!result) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'Not found'
      };
    }

    const buffer = Buffer.from(result.data);
    const contentType = typeof result.metadata?.contentType === 'string'
      ? result.metadata.contentType
      : 'application/octet-stream';

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    };

    if (result.metadata?.originalName) {
      headers['Content-Disposition'] = `inline; filename="${sanitizeFilename(result.metadata.originalName)}"`;
    }

    if (method === 'HEAD') {
      return {
        statusCode: 200,
        headers,
        body: ''
      };
    }

    return {
      statusCode: 200,
      headers,
      body: buffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('serve-media error', error);
    if (error?.code === 'BLOB_STORE_NOT_CONFIGURED' || error?.name === 'MissingBlobsEnvironmentError') {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'Image storage is not configured. Please enable Netlify Blobs or set BLOB_STORE_* environment variables.'
      };
    }
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Failed to load media'
    };
  }
};
