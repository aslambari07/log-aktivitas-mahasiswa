export function notFound(_req, res) {
  res.status(404).json({
    message: "Endpoint tidak ditemukan.",
  });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;

  res.status(status).json({
    message: error.message || "Terjadi kesalahan pada server.",
  });
}
