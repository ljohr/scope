import CourseModel from "../models/Course.js";

const courseSearch = async (searchQuery, page, pageSize) => {
  const skip = (page - 1) * pageSize;

  // First search attempt using courseName
  let results = await CourseModel.aggregate([
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

  // If no results found, try again using courseCode
  if (results.length === 0) {
    results = await CourseModel.aggregate([
      {
        $search: {
          index: "course_search",
          text: {
            query: searchQuery,
            path: "courseCode",
          },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);
  }

  // Determine total count based on which path yielded results
  const totalCountResult = await CourseModel.aggregate([
    {
      $search: {
        index: "course_search",
        text: {
          query: searchQuery,
          path: results.length > 0 ? "courseName" : "courseCode",
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
