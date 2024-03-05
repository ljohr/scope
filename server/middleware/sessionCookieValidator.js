import admin from "firebase-admin";

const sessionCookieValidator = async (req, res, next) => {
  const sessionCookie = req.cookies.userSession || "";

  try {
    await admin.auth().verifySessionCookie(sessionCookie, true);
    next();
  } catch (error) {
    if (
      error.code === "auth/argument-error" ||
      error.code === "auth/session-cookie-expired" ||
      error.code === "auth/session-cookie-revoked"
    ) {
      res.status(401).json({
        isAuthenticated: false,
        message: "Session is invalid or expired.",
      });
    } else {
      next(error);
    }
  }
};

export default sessionCookieValidator;
