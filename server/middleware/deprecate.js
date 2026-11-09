function deprecate(req, res, next) {
  res.setHeader("Deprecation", "true");
  res.setHeader("Sunset", "Tue, 24 Nov 2026 00:00:00 GMT");
  res.setHeader("Link", '</api/v2/artisans>; rel="successor-version"');

  next();
}

module.exports = deprecate;
