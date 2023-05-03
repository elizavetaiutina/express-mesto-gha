class ErrorUnauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = ErrorUnauthorized;

// передан неверный логин или пароль. Также эту ошибку возвращает авторизационный middleware, если передан неверный JWT
