const validateAuthHeader = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Unauthorized: No Bearer Token");
  }
  return authHeader.split("Bearer ")[1];
};

export default validateAuthHeader;
