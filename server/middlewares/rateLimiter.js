// middlewares/rateLimiter.js
import arcjet, { tokenBucket } from "@arcjet/node";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Track by IP address
  rules: [
    tokenBucket({
      mode: "DRY_RUN", // Always use DRY_RUN in development
      refillRate: 1000, // Very high refill rate for development
      interval: 1, // 1 second interval
      capacity: 1000, // Very high capacity for development
    }),
  ],
});

const rateLimiter = (tokens = 1) => {
  return async (req, res, next) => {
    // Skip rate limiting completely if ARCJET_KEY is not set (development mode)
    if (!process.env.ARCJET_KEY) {
      console.warn("ARCJET_KEY not set, skipping rate limiting entirely");
      return next();
    }

    // Also skip if JWT_SECRET is not set (indicates development)
    if (!process.env.JWT_SECRET) {
      console.warn("JWT_SECRET not set, skipping rate limiting entirely");
      return next();
    }

    console.log("Rate limiter active, tokens requested:", tokens);

    try {
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

      const decision = await aj.protect(req, {
        ip,
        requested: tokens,
      });

      console.log("Arcjet decision", decision);

      if (decision.isDenied()) {
        return res.status(429).json({
          error: "Too Many Requests",
          reason: decision.reason,
        });
      }

      next();
    } catch (err) {
      console.error("Rate limiter error:", err);
      res.status(500).json({ error: "Rate limit check failed" });
    }
  };
};

export default rateLimiter;
