import CourseModel from "./models/Course.js";

const courseSearch = async (searchQuery, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  const results = await CourseModel.aggregate([
    {
      $search: {
        index: "course_search",
        text: {
          query: searchQuery,
          path: "courseName",
        },
      },
    },
    { $skip: skip },
    { $limit: pageSize },
  ]);

  const totalCountResult = await CourseModel.aggregate([
    {
      $search: {
        index: "course_search",
        text: {
          query: searchQuery,
          path: "courseName",
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

export default courseSearch;
