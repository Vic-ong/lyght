class Response {
  static success(result) {
    return {
      status: 200,
      body: { result },
    };
  }

  static unauthorized() {
    return {
      status: 403,
      body: { result: 'Unauthorized request!' },
    };
  }
}

module.exports = Response;
