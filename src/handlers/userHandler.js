const { nanoid } = require('nanoid');
const firestore = require('../services/firestore');
const Jwt = require('@hapi/jwt');
const bcrypt = require('bcrypt');
const { JWT_SECRET_KEY } = require('../config');

const registerHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;

    if (!username || !password) {
      return h.response({
        status: 'fail',
        message: 'Username or password are required!'
      }).code(400);
    }

    const usersSnapshot = await firestore.collection('users').where('username', '==', username).get();
    if (!usersSnapshot.empty) {
      return h.response({
        status: 'fail',
        message: 'Username already exists!'
      }).code(409);
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

    return h.response({
      status: 'success',
      message: 'User registered successfully!',
      data: {
        userId
      }
    }).code(201);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to register user!',
      error: error.message
    }).code(500);
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

    return h.response({
      status: 'success',
      data: {
        users
      }
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to fetch users',
      error: error.message
    }).code(500);
  }
};

const loginHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;
    const usersSnapshot = await firestore.collection('users').where('username', '==', username).get();

    if (usersSnapshot.empty) {
      return h.response({
        status: 'fail',
        message: 'Username not found'
      }).code(404);
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
          key: JWT_SECRET_KEY,
          algorithm: 'HS256'
        }
      );

      return h.response({
        status: 'success',
        message: 'Login successful',
        token
      }).code(200);
    }

    return h.response({
      status: 'fail',
      message: 'Incorrect password'
    }).code(400);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to login',
      error: error.message
    }).code(500);
  }
};

const logoutHandler = async (request, h) => {
  return h.response({
    status: 'success',
    message: 'Logout successful'
  }).code(200);
};

const updateUserHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const { username, password } = request.payload;
    const updatedAt = new Date().toISOString();

    const userRef = firestore.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return h.response({
        status: 'fail',
        message: 'Failed to update user. Id not found'
      }).code(404);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userRef.update({
      username,
      password: hashedPassword,
      updatedAt
    });

    return h.response({
      status: 'success',
      message: 'User updated successfully'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to update user',
      error: error.message
    }).code(500);
  }
};

const deleteUserHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const userRef = firestore.collection('users').doc(id);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return h.response({
        status: 'fail',
        message: 'Failed to delete user. Id not found'
      }).code(404);
    }

    await userRef.delete();

    return h.response({
      status: 'success',
      message: 'User deleted successfully'
    }).code(200);
  } catch (error) {
    return h.response({
      status: 'fail',
      message: 'Failed to delete user',
      error: error.message
    }).code(500);
  }
};

module.exports = { registerHandler, getAllUsers, loginHandler, logoutHandler, updateUserHandler, deleteUserHandler };