const { nanoid } = require('nanoid');
const users = require('./users');

const registerHandler = (request, h) => {
  const { username, password } = request.payload;

  if (!username) {
    const response = h.response({
      status: 'fail',
      message: 'Username sudah terdaftar!'
    }).code(400);
    return response;
  }

  if (!password) {
    const response = h.response({
      status: 'fail',
      message: 'Password tidak boleh kosong!'
    }).code(400);
    return response;
  }

  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newUser = {
    id,
    username,
    password,
    createdAt,
    updatedAt
  };

  users.push(newUser);

  const isSuccess = users.filter((user) => user.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'User berhasil ditambahkan',
      data: {
        userId: id
      }
    }).code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal menambahkan user'
  }).code(500);
  return response;
};

const getAllUsers = (request, h) => {
  const response = h.response({
    status: 'success',
    data: {
      users: users.map((user) => ({
        id: user.id,
        username: user.username,
        password: user.password
      }))
    }
  }).code(200);
  return response;
}

const loginHandler = (request, h) => {
  const { username, password } = request.payload;

  const user = users.filter((n) => n.username === username)[0];

  if (user) {
    if (user.password === password) {
      const response = h.response({
        status: 'success',
        message: 'Berhasil login'
      }).code(200);
      return response;
    }

    const response = h.response({
      status: 'fail',
      message: 'Password yang Anda masukkan salah'
    }).code(400);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Username tidak ditemukan'
  }).code(404);
  return response;
}

module.exports = { registerHandler, getAllUsers, loginHandler };