import admin from "firebase-admin";

const verifyIdToken = async (idToken) => {
  return admin.auth().verifyIdToken(idToken);
};

const createSessionCookie = async (idToken, expiresIn) => {
  return admin.auth().createSessionCookie(idToken, { expiresIn });
};

export { verifyIdToken, createSessionCookie };
