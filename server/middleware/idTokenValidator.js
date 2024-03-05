import admin from "firebase-admin";

const idTokenValidator = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.decodedToken = decodedToken;
    req.idToken = idToken;
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).send("Authentication failed");
  }
};

export default idTokenValidator;
