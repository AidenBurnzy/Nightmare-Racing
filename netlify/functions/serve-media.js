// serve-media.js - Streams stored blob images back to the client
const { connectLambda, getStore } = require('@netlify/blobs');

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
    try {
      connectLambda(event);
    } catch (blobError) {
      console.warn('serve-media connectLambda warning', blobError);
    }
    const store = getStore('car-images');
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
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: 'Failed to load media'
    };
  }
};
