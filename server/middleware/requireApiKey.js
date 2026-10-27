const crypto = require("crypto");

function requireApiKey(req, res, next) {
  const providedKey = req.get("X-API-Key");

  const validKeys = [
    {
      name: "group4",
      key: process.env.DOWNSTREAM_API_KEY,
    },
    {
      name: "team3",
      key: process.env.TEAM_TEST_API_KEY,
    },
  ].filter((consumer) => consumer.key);

  if (validKeys.length !== 2) {
    return res.status(503).json({
      message: "API key authentication is not fully configured.",
    });
  }

  if (!providedKey) {
    return res.status(401).json({
      message: "Missing or invalid API key",
    });
  }

  const matchedConsumer = validKeys.find((consumer) => {
    const providedBuffer = Buffer.from(providedKey);
    const expectedBuffer = Buffer.from(consumer.key);

    return (
      providedBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(providedBuffer, expectedBuffer)
    );
  });

  if (!matchedConsumer) {
    return res.status(401).json({
      message: "Missing or invalid API key",
    });
  }

  req.apiConsumer = matchedConsumer.name;

  next();
}

module.exports = requireApiKey;