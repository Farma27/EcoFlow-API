const firestore = require('../services/firestore');
const { nanoid } = require('nanoid');
const storage = require('../services/storage');
const { bucketName, MAX_FILE_SIZE } = require('../config');

const addArticleHandler = async (request, h) => {
  try {
    const { user } = request.auth.credentials;
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Action unauthorized! Please login or register!'
      }).code(401);
    }

    const { title, content } = request.payload;
    const articleId = nanoid();
    const createdAt = new Date().toISOString();

    let imageUrl = null;

    if (request.payload.image) {
      const { image } = request.payload;

      if (image._data.length > MAX_FILE_SIZE) {
        return h.response({
          status: 'fail',
          message: 'File size too large! Maximum file size is 5 MB.'
        }).code(400);
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      const mimeType = image.hapi.headers['content-type'];

      if (!allowedMimeTypes.includes(mimeType)) {
        return h.response({
          status: 'fail',
          message: 'Invalid file type! Only JPEG, PNG, JPG, and GIF are allowed.'
        }).code(400);
      }

      const bucket = storage.bucket(bucketName);
      const fileName = `${Date.now()}-${image.hapi.filename}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: mimeType
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          console.error('Error uploading file:', err);
          reject(h.response({
            status: 'fail',
            message: 'An error occurred while uploading the image!',
            error: err.message
          }).code(500));
        });

        stream.on('finish', () => {
          imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve();
        });

        image.pipe(stream);
      });
    }

    const articleData = {
      id: articleId,
      title,
      content,
      imageUrl,
      authorId: user.id,
      createdAt,
      updatedAt: createdAt
    };

    await firestore.collection('articles').doc(articleId).set(articleData);

    return h.response({
      status: 'success',
      message: 'Article added successfully!',
      data: {
        articleId
      }
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to add article!',
      error: error.message
    }).code(500);
  }
};

const editArticleHandler = async (request, h) => {
  try {
    const { user } = request.auth.credentials;
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Action unauthorized! Please login or register!'
      }).code(401);
    }

    const { id } = request.params;
    const { title, content } = request.payload;
    const updatedAt = new Date().toISOString();

    const articleRef = firestore.collection('articles').doc(id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return h.response({
        status: 'fail',
        message: 'Article not found'
      }).code(404);
    }

    let imageUrl = articleDoc.data().imageUrl;

    if (request.payload.image) {
      const { image } = request.payload;

      if (image._data.length > MAX_FILE_SIZE) {
        return h.response({
          status: 'fail',
          message: 'File size too large! Maximum file size is 5 MB.'
        }).code(400);
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      const mimeType = image.hapi.headers['content-type'];

      if (!allowedMimeTypes.includes(mimeType)) {
        return h.response({
          status: 'fail',
          message: 'Invalid file type! Only JPEG, PNG, JPG, and GIF are allowed.'
        }).code(400);
      }

      const bucket = storage.bucket(bucketName);
      const fileName = `${Date.now()}-${image.hapi.filename}`;
      const file = bucket.file(fileName);

      const stream = file.createWriteStream({
        metadata: {
          contentType: mimeType
        }
      });

      await new Promise((resolve, reject) => {
        stream.on('error', (err) => {
          console.error('Error uploading file:', err);
          reject(h.response({
            status: 'fail',
            message: 'An error occurred while uploading the image!',
            error: err.message
          }).code(500));
        });

        stream.on('finish', () => {
          imageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
          resolve();
        });

        image.pipe(stream);
      });
    }

    await articleRef.update({
      title,
      content,
      imageUrl,
      updatedAt
    });

    return h.response({
      status: 'success',
      message: 'Article updated successfully'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to update article',
      error: error.message
    }).code(500);
  }
};

const getAllArticlesHandler = async (request, h) => {
  try {
    const articlesSnapshot = await firestore.collection('articles').get();
    const articles = articlesSnapshot.docs.map(doc => doc.data());

    return h.response({
      status: 'success',
      data: {
        articles
      }
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to fetch articles',
      error: error.message
    }).code(500);
  }
};

const getArticleByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const articleRef = firestore.collection('articles').doc(id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return h.response({
        status: 'fail',
        message: 'Article not found'
      }).code(404);
    }

    const articleData = articleDoc.data();

    return h.response({
      status: 'success',
      data: {
        article: articleData
      }
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to fetch article',
      error: error.message
    }).code(500);
  }
};

const deleteArticleHandler = async (request, h) => {
  try {
    const { user } = request.auth.credentials;
    if (!user) {
      return h.response({
        status: 'fail',
        message: 'Action unauthorized! Please login or register!'
      }).code(401);
    }

    const { id } = request.params;

    const articleRef = firestore.collection('articles').doc(id);
    const articleDoc = await articleRef.get();

    if (!articleDoc.exists) {
      return h.response({
        status: 'fail',
        message: 'Failed to delete article. Id not found'
      }).code(404);
    }

    await articleRef.delete();

    return h.response({
      status: 'success',
      message: 'Article deleted successfully'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to delete article',
      error: error.message
    }).code(500);
  }
};

module.exports = {
  addArticleHandler,
  editArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
  deleteArticleHandler
};