const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  res.status(statusCode).json(response);
};

const sendError = (res, message, statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};

const sendPaginated = (res, message, data, pagination) => {
  res.status(200).json({ success: true, message, data, pagination });
};

module.exports = { sendSuccess, sendError, sendPaginated };
