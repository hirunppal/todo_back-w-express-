const res = require("express/lib/response");

module.exports = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  throw err;
};
