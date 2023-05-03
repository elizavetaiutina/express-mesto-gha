class ErrorConflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = ErrorConflict;

// при регистрации указан email, который уже существует на сервере
