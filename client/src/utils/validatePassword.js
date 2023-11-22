const checkMismatch = (password, confirm) => {
  return password === confirm;
};

const validatePassword = (password) => {
  const specialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/;
  if (password.length < 8) {
    return "tooShort";
  } else if (password.length >= 30) {
    return "tooLong";
  } else if (password == password.toLowerCase()) {
    return "onlyLower";
  } else if (password == password.toUpperCase()) {
    return "onlyUpper";
  } else if (!specialChars.test(password)) {
    return "noSpecialChar";
  } else {
    return "passedCheck";
  }
};

export { validatePassword, checkMismatch };
