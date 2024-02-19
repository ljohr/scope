const toSlug = (name) => {
  return name.replace(/-/g, "-hyphen-").toLowerCase().split(" ").join("-");
};

export default toSlug;
