const logoutController = async (req, res, next) => {
  try {
    res.clearCookie("userSession");
    res.status(200).send("Successful Logout");
  } catch (error) {
    next(error);
  }
};

export { logoutController };
