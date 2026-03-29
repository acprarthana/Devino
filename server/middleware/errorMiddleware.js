module.exports = (err, req, res, next) => {
  console.error('Server error:', err);
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined,
  };
  res.status(statusCode).json(response);
};