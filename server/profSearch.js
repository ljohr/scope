import ProfessorModel from "./models/Professor.js";

const profSearch = async (searchQuery, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
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
    { $skip: skip },
    { $limit: pageSize },
  ]);

  return result;
};

export default profSearch;
