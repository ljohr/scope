const currentYear = new Date().getFullYear();
const startYear = 2013;

const GetYears = () => {
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(
      <option key={year} value={year}>
        {year}
      </option>
    );
  }
  return years;
};

export { GetYears };
