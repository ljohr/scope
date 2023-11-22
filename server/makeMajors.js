import connectDB from "./config/connectDB.js";
import ProfessorModel from "./models/Professor.js";
import MajorModel from "./models/Majors.js";

connectDB();

async function createAndLinkMajors() {
  try {
    // Extract unique department names from Professor documents
    const professorDocs = await ProfessorModel.find().distinct("department");
    const uniqueDepartments = new Set(professorDocs);

    console.log(uniqueDepartments);
    // Create Major documents for each unique department
    // const result = await ProfessorModel.updateMany(
    //   {}, // This empty object means "match all documents"
    //   { $set: { major: [] } } // Set 'major' to null (or some default value)
    // );
    // console.log(result);
    // Assuming the rest of your script is unchanged...
    for (const departmentName of uniqueDepartments) {
      let major = await MajorModel.findOne({ name: departmentName });
      if (!major) {
        major = new MajorModel({ name: departmentName });
        await major.save();
      }

      console.log(
        `Updating professors in department: ${departmentName} with major ID: ${major._id}`
      );

      try {
        // Note the change here from `major` to `majors`
        const updateResult = await ProfessorModel.updateMany(
          { department: "AADS" },
          { $unset: { majors: 1 } } // Using $addToSet to add the major ID to the array
        );
        console.log("updateResult", updateResult);
      } catch (error) {
        console.error(
          `Error updating professors for department ${departmentName}:`,
          error
        );
      }
    }

    console.log("Majors have been created and linked to Professors.");
  } catch (error) {
    console.error("Error in createAndLinkMajors:", error);
  }
}

createAndLinkMajors();
