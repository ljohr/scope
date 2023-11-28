import admin from "firebase-admin";
import UserModel from "../models/User.js";

const validateAuthHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No Bearer Token");
  }
  return authHeader.split("Bearer ")[1];
};

const getTokenCookie = async (idToken, expiresIn) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const sessionCookie = await admin
    .auth()
    .createSessionCookie(idToken, { expiresIn });

  return { decodedToken, sessionCookie };
};

const findOrCreateUser = async (fbUserId, email) => {
  let user = await UserModel.findOne({ fbUserId });

  if (!user) {
    user = await UserModel.create({
      email,
      fbUserId,
    });
    await user.save();
  }
  return user;
};

const loginController = async (req, res, next) => {
  try {
    const idToken = validateAuthHeader(req.headers.authorization);

    // 5 Days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const { decodedToken, sessionCookie } = await getTokenCookie(
      idToken,
      expiresIn
    );
    const user = await findOrCreateUser(decodedToken.uid, decodedToken.email);

    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    res.cookie("userSession", sessionCookie, options);
    res.json({ message: "Registration successful", user });
  } catch (error) {
    next(error);
  }
};

export { loginController };
