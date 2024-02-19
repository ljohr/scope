const nameFromSlug = (slug) => {
  return slug
    .split("-hyphen-")
    .map((segment) =>
      segment
        .split("-")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    )
    .join("-");
};

export default nameFromSlug;
