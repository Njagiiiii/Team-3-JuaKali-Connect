const { rateLimit } = require("express-rate-limit");

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,

  limit: Number(process.env.RATE_LIMIT_MAX) || 100,

  keyGenerator: (req) => req.apiConsumer,

  standardHeaders: "draft-7",
  legacyHeaders: false,

  handler: (req, res, next, options) => {
    const retryAfter = Math.max(
      1,
      Math.ceil((req.rateLimit.resetTime - new Date()) / 1000),
    );

    res.set("Retry-After", String(retryAfter));

    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  },
});

module.exports = rateLimiter;
