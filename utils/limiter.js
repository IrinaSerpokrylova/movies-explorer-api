const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  max: 100,
});

module.exports = limiter;
