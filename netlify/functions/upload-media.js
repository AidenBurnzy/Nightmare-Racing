// upload-media.js - Handles multipart image uploads and stores them in Netlify Blobs
const { connectLambda, getStore } = require('@netlify/blobs');
const Busboy = require('busboy');
const { randomUUID } = require('crypto');
const path = require('path');

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB per image

const parseMultipartForm = (eventBody, contentType, isBase64Encoded) => {
  return new Promise((resolve, reject) => {
    const files = [];
    const busboy = Busboy({
      headers: { 'content-type': contentType },
      limits: { fileSize: MAX_FILE_SIZE_BYTES }
    });

    busboy.on('file', (fieldname, fileStream, info) => {
      const { filename, mimeType } = info || {};
      const buffers = [];
      let fileTooLarge = false;

      fileStream.on('limit', () => {
        fileTooLarge = true;
        fileStream.resume();
      });

      fileStream.on('data', (data) => {
        if (!fileTooLarge) {
          buffers.push(data);
        }
      });

      fileStream.on('end', () => {
        if (fileTooLarge) {
          reject(new Error(`File "${filename}" exceeds the 15MB upload limit.`));
          return;
        }

        if (buffers.length === 0) {
          return;
        }

        files.push({
          fieldname,
          filename,
          mimeType,
          data: Buffer.concat(buffers)
        });
      });
    });

    busboy.on('error', reject);
    busboy.on('finish', () => resolve(files));

    const bodyBuffer = isBase64Encoded
      ? Buffer.from(eventBody, 'base64')
      : Buffer.from(eventBody);

    busboy.end(bodyBuffer);
  });
};

const sanitizeFileExtension = (filename = '') => {
  const ext = path.extname(filename).toLowerCase();
  if (!ext) {
    return '';
  }

  const safeExtension = ext.replace(/[^a-z0-9.]/g, '');
  return safeExtension || '';
};

const resolveBlobStore = (event) => {
  const storeName = process.env.BLOB_STORE_NAME || 'car-images';

  let environmentConfigured = false;
  if (event?.blobs) {
    try {
      connectLambda(event);
      environmentConfigured = true;
    } catch (blobError) {
      console.warn('upload-media connectLambda warning', blobError);
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

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'];
  if (!contentType || !contentType.includes('multipart/form-data')) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Content-Type must be multipart/form-data' })
    };
  }

  try {
    const files = await parseMultipartForm(event.body, contentType, event.isBase64Encoded);

    if (!Array.isArray(files) || files.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'No files uploaded' })
      };
    }

    const store = resolveBlobStore(event);
    const uploads = [];

    for (const file of files) {
      const extension = sanitizeFileExtension(file.filename);
      const fileKey = `${new Date().toISOString().split('T')[0]}/${randomUUID()}${extension}`;

      await store.set(fileKey, file.data, {
        metadata: {
          contentType: file.mimeType || 'application/octet-stream',
          originalName: file.filename || null
        }
      });

      const serveUrl = `/.netlify/functions/serve-media?key=${encodeURIComponent(fileKey)}`;

      uploads.push({
        url: serveUrl,
        key: fileKey,
        name: file.filename || fileKey,
        contentType: file.mimeType || 'application/octet-stream'
      });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploads })
    };
  } catch (error) {
    console.error('upload-media error', error);
    let statusCode = 500;
    let message = error?.message || 'Image upload failed';

    if (error?.code === 'BLOB_STORE_NOT_CONFIGURED' || error?.name === 'MissingBlobsEnvironmentError') {
      statusCode = 503;
      message = 'Image storage is not configured. Please enable Netlify Blobs or set BLOB_STORE_* environment variables.';
    } else if (message.toLowerCase().includes('exceeds')) {
      statusCode = 413;
    }

    return {
      statusCode,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message })
    };
  }
};
