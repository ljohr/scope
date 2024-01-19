import styles from "./MajorFilter.module.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const courses = [
  { label: "ADEC - Economics (Woods College)", code: "ADEC" },
  { label: "ADEN - English (Woods College)", code: "ADEN" },
  { label: "ADET - Entrepreneurship", code: "ADET" },
  { label: "ADEX - Examined Life", code: "ADEX" },
  { label: "ADFA - Fine Arts (Woods College)", code: "ADFA" },
  { label: "ADFM - Film (Woods College)", code: "ADFM" },
  { label: "ADFN - Finance (Woods College)", code: "ADFN" },
  {
    label: "ADGR - Leadership and Administration (Woods College)",
    code: "ADGR",
  },
  { label: "ADHA - Healthcare Administration", code: "ADHA" },
  { label: "ADHS - History (Woods College)", code: "ADHS" },
  { label: "ADIT - Information Technology (Woods College)", code: "ADIT" },
  { label: "ADLA - Law (Woods College)", code: "ADLA" },
  { label: "ADMK - Marketing (Woods College)", code: "ADMK" },
  { label: "ADMT - Mathematics (Woods College)", code: "ADMT" },
  { label: "ADMU - Music (Woods College)", code: "ADMU" },
  { label: "ADPL - Philosophy (Woods College)", code: "ADPL" },
  { label: "ADPO - Political Science (Woods College)", code: "ADPO" },
  { label: "ADPS - Psychology (Woods College)", code: "ADPS" },
  { label: "ADSA - Sports Administration", code: "ADSA" },
  { label: "ADSB - Sustainability", code: "ADSB" },
  { label: "ADSO - Sociology (Woods College)", code: "ADSO" },
  { label: "ADSY - Corporate Systems (Woods College)", code: "ADSY" },
  { label: "ADTH - Theology (Woods College)", code: "ADTH" },
  {
    label: "APSY - Counseling, Developmental, and Educational Psychology",
    code: "APSY",
  },
  { label: "ARTH - Art History", code: "ARTH" },
  { label: "ARTS - Studio Art", code: "ARTS" },
  { label: "BCOM - Business Writing and Communication", code: "BCOM" },
  { label: "BIOL - Biology", code: "BIOL" },
  { label: "BSLW - Business Law", code: "BSLW" },
  { label: "BZAN - Business Analytics", code: "BZAN" },
  { label: "CHEM - Chemistry", code: "CHEM" },
  { label: "CLAS - Classics", code: "CLAS" },
  { label: "COMM - Communication", code: "COMM" },
  { label: "CSCI - Computer Science", code: "CSCI" },
  { label: "EALC - East Asian Languages and Civilizations", code: "EALC" },
  { label: "ECON - Economics", code: "ECON" },
  {
    label: "EDUC - Teacher Education and Curriculum and Instruction",
    code: "EDUC",
  },
  { label: "EESC - Earth & Environmental Sciences", code: "EESC" },
  { label: "ELHE - Educational Leadership and Higher Education", code: "ELHE" },
  { label: "ENGL - English", code: "ENGL" },
  { label: "ENGR - Engineering Human Centered", code: "ENGR" },
  { label: "ENVS - Environmental Studies", code: "ENVS" },
  { label: "ERAL - Experience, Reflection, Action: Lynch", code: "ERAL" },
  { label: "FILM - Film Studies", code: "FILM" },
  { label: "FORM - Formative Education", code: "FORM" },
  { label: "FORS - Forensics", code: "FORS" },
  { label: "FREN - French", code: "FREN" },
  { label: "GERM - German", code: "GERM" },
  { label: "GSOM - Management Elective", code: "GSOM" },
  { label: "HIST - History", code: "HIST" },
  { label: "HLTH - Palliative Care", code: "HLTH" },
  { label: "ICSP - Islamic Civilization & Societies", code: "ICSP" },
  { label: "INTL - International Studies", code: "INTL" },
  { label: "ISYS - Information Systems", code: "ISYS" },
  { label: "ITAL - Italian", code: "ITAL" },
  { label: "JESU - Jesuit Studies", code: "JESU" },
  { label: "JOUR - Journalism", code: "JOUR" },
  { label: "LAWS - Law", code: "LAWS" },
  { label: "LING - Linguistics", code: "LING" },
  { label: "LREN - Learning Engineering", code: "LREN" },
  { label: "MATH - Mathematics", code: "MATH" },
  {
    label: "MESA - Measurement, Evaluation, Statistics, and Assessment",
    code: "MESA",
  },
  { label: "MFIN - Finance", code: "MFIN" },
  { label: "MGMT - Management & Organization", code: "MGMT" },
  { label: "MKTG - Marketing", code: "MKTG" },
  { label: "MUSA - Music Academic", code: "MUSA" },
  { label: "MUSP - Music Performance", code: "MUSP" },
  { label: "NELC - Near Eastern Languages and Civilizations", code: "NELC" },
  { label: "NURS - Nursing", code: "NURS" },
  { label: "PHCG - Global Public Health and the Common Good", code: "PHCG" },
  { label: "PHIL - Philosophy", code: "PHIL" },
  { label: "PHYS - Physics", code: "PHYS" },
  { label: "POLI - Political Science", code: "POLI" },
  { label: "PRTO - Portico", code: "PRTO" },
  { label: "PSYC - Psychology", code: "PSYC" },
  { label: "RLRL - Romance Languages & Literatures", code: "RLRL" },
  { label: "ROTC - Military Science", code: "ROTC" },
  {
    label: "SCHI - Schiller Institute for Integrated Science and Society",
    code: "SCHI",
  },
  { label: "SCWK - Social Work", code: "SCWK" },
  { label: "SLAV - Slavic Studies", code: "SLAV" },
  { label: "SOCY - Sociology", code: "SOCY" },
  { label: "SPAN - Spanish", code: "SPAN" },
  { label: "THEO - Theology", code: "THEO" },
  { label: "THTR - Theatre", code: "THTR" },
  { label: "TMCE - Christian Ethics", code: "TMCE" },
  { label: "TMHC - History of Christianity", code: "TMHC" },
  { label: "TMNT - New Testament", code: "TMNT" },
  { label: "TMOT - Old Testament", code: "TMOT" },
  { label: "TMPS - Pastoral Studies", code: "TMPS" },
  { label: "TMPT - Theology and Ministry Practical Theology", code: "TMPT" },
  { label: "TMRE - Religious Education", code: "TMRE" },
  { label: "TMST - Systematic and Historical Theology", code: "TMST" },
  {
    label: "TMTM - Theology and Ministry Course Area Unspecified",
    code: "TMTM",
  },
  { label: "UGMG - Undergraduate Management", code: "UGMG" },
  { label: "UNAS - University Courses", code: "UNAS" },
  { label: "UNCP - Capstone", code: "UNCP" },
  { label: "UNCS - Cornerstone", code: "UNCS" },
  { label: "XRBC - XRBC", code: "XRBC" },
];

const MajorFilter = ({ onMajorSelect }) => {
  return (
    <div className={styles.sidebar}>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={courses}
        sx={{ width: "100%" }}
        onChange={(event, newValue) => onMajorSelect(newValue)}
        className={styles.filter}
        renderInput={(params) => (
          <TextField {...params} label="Filter By Major" />
        )}
      />
    </div>
  );
};

export default MajorFilter;
