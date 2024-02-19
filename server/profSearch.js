import ProfessorModel from "./models/Professor.js";

const profSearch = async (searchQuery, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  const results = await ProfessorModel.aggregate([
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

  const totalCountResult = await ProfessorModel.aggregate([
    {
      $search: {
        index: "prof_search",
        text: {
          query: searchQuery,
          path: "professorName",
        },
      },
    },
    {
      $count: "total",
    },
  ]);

  const totalDocs = totalCountResult.length > 0 ? totalCountResult[0].total : 0;

  return {
    results,
    totalPages: Math.ceil(totalDocs / pageSize),
  };
};

export default profSearch;
