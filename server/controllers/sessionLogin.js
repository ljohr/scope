import admin from "firebase-admin";
import UserModel from "./models/User.js";

const sessionLogin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];

  // 5 Days
  const expiresIn = 60 * 60 * 24 * 5 * 1000;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn });
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };
    const email = decodedToken.email;
    const fbUserId = decodedToken.uid;
    let user = await UserModel.findOne({ fbUserId });

    if (!user) {
      user = await UserModel.create({
        email,
        fbUserId,
      });
      await user.save();
    }

    res.cookie("userSession", sessionCookie, options);
    res.json({ message: "Registration successful", user });
  } catch (error) {
    console.log(error);
    if (error.code && error.code.startsWith("auth/")) {
      res.status(401).send(error.message);
    } else {
      next(error);
    }
  }
};

export default sessionLogin;
