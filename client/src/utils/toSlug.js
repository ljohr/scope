const toSlug = (name) => {
  return name.toLowerCase().split(" ").join("-");
};

export default toSlug;
