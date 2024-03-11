const convertDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();
  const formattedDate = `${month}/${day}/${year}`;
  return formattedDate;
};

export default convertDate;
