const { nanoid } = require('nanoid');
const firestore = require('./services/firestore');
const Jwt = require('@hapi/jwt');

const registerHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;

    const userId = nanoid();

    const userData = {
      id: userId,
      username,
      password, // Todo: Hash
      createdAt: new Date().toISOString()
    };

    await firestore.collection('users').doc(userId).set(userData);

    const response = h.response({
      status: 'success',
      message: 'User registered successfully',
      data: {
        userId
      }
    }).code(201);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: error.message
    }).code(500);
    return response;
  }
};

const getAllUsers = async (request, h) => {
  try {
    const usersSnapshot = await firestore.collection('users').get();
    const users = usersSnapshot.docs.map(doc => doc.data());

    const response = h.response({
      status: 'success',
      data: {
        users
      }
    }).code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal mengambil data users'
    }).code(500);
    return response;
  }
};

const loginHandler = async (request, h) => {
  const { username, password } = request.payload;

  try {
    const usersSnapshot = await firestore.collection('users').where('username', '==', username).get();

    if (usersSnapshot.empty) {
      const response = h.response({
        status: 'fail',
        message: 'Username tidak ditemukan'
      }).code(404);
      return response;
    }

    const user = usersSnapshot.docs[0].data();

    if (user.password === password) {
      const token = Jwt.token.generate(
        {
          aud: 'urn:audience:test',
          iss: 'urn:issuer:test',
          sub: false,
          maxAgeSec: 14400, // 4 hours
          timeSkewSec: 15,
          user: {
            id: user.id,
            username: user.username
          }
        },
        {
          key: process.env.JWT_SECRET_KEY,
          algorithm: 'HS256'
        }
      );

      const response = h.response({
        status: 'success',
        message: 'Berhasil login',
        token
      }).code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Password yang Anda masukkan salah'
    }).code(400);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal login'
    }).code(500);
    return response;
  }
};

const updateUserHandler = async (request, h) => {
  const { id } = request.params;
  const { username, password } = request.payload;
  const updatedAt = new Date().toISOString();

  try {
    const userRef = firestore.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui user. Id tidak ditemukan'
      }).code(404);
      return response;
    }

    await userRef.update({
      username,
      password,
      updatedAt
    });

    const response = h.response({
      status: 'success',
      message: 'User berhasil diperbarui'
    }).code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui user'
    }).code(500);
    return response;
  }
};

const deleteUserHandler = async (request, h) => {
  const { id } = request.params;

  try {
    const userRef = firestore.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      const response = h.response({
        status: 'fail',
        message: 'User gagal dihapus. Id tidak ditemukan'
      }).code(404);
      return response;
    }

    await userRef.delete();

    const response = h.response({
      status: 'success',
      message: 'User berhasil dihapus'
    }).code(200);
    return response;
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menghapus user'
    }).code(500);
    return response;
  }
};

module.exports = { registerHandler, getAllUsers, loginHandler, updateUserHandler, deleteUserHandler };