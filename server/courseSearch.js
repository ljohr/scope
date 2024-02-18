import CourseModel from "./models/Course.js";

const profSearch = async (searchQuery, page = 1, pageSize = 10) => {
  const skip = (page - 1) * pageSize;
  const result = await CourseModel.aggregate([
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

  return result;
};

export default profSearch;
