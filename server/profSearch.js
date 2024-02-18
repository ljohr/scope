import ProfessorModel from "./models/Professor.js";

const profSearch = async (searchQuery) => {
  const result = await ProfessorModel.aggregate([
    {
      $search: {
        index: "prof_search",
        text: {
          query: searchQuery,
          path: "professorName",
        },
      },
    },
  ]);

  return result;
};

export default profSearch;
