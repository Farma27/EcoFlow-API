const { nanoid } = require('nanoid');
const firestore = require('../services/firestore');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');

const registerHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;

    if (!username || !password) {
      const response = h.response({
        status: 'fail',
        message: 'Username or password are required!'
      }).code(400);
      return response;
    }

    const usersSnapshot = await firestore.collection('users').where('username', '==', username).get();
    if (!usersSnapshot.empty) {
      const response = h.response({
        status: 'fail',
        message: 'Username already exists!'
      }).code(409);
      return response;
    }

    const userId = nanoid();

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      id: userId,
      username,
      password: hashedPassword, 
      createdAt: new Date().toISOString()
    };

    await firestore.collection('users').doc(userId).set(userData);

    const response = h.response({
      status: 'success',
      message: 'User registered successfully!',
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
    const users = usersSnapshot.docs.map(doc => {
      const user = doc.data();
      delete user.password; 
      return user;
    });

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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = Jwt.token.generate(
        {
          aud: 'urn:audience:test',
          iss: 'urn:issuer:test',
          sub: false,
          maxAgeSec: 3600, // 1 hour
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

const logoutHandler = async (request, h) => {
  const response = h.response({
    status: 'success',
    message: 'Berhasil logout'
  }).code(200);
  return response;
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

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.update({
      username,
      password: hashedPassword,
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

module.exports = { registerHandler, getAllUsers, loginHandler, logoutHandler, updateUserHandler, deleteUserHandler };