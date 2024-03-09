import PropTypes from "prop-types";

const handleSelectionChange = (setState, selectedKey) => {
  setState((currentState) => ({
    ...Object.keys(currentState).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {}),
    [selectedKey]: true,
  }));
};

const multiSelectChange = (setState, selectedKey) => {
  setState((currentState) => ({
    ...currentState,
    [selectedKey]: !currentState[selectedKey],
  }));
};

const TagSelection = ({
  workload,
  lecturerStyle,
  gradingStyle,
  profTags,
  courseTags,
  setWorkload,
  setLecturerStyle,
  setGradingStyle,
  setProfTags,
  setCourseTags,
}) => {
  console.log(
    "workload",
    workload,
    lecturerStyle,
    gradingStyle,
    profTags,
    courseTags
  );
  return (
    <>
      <div className="course-tags">
        <h4>Course Tags</h4>
        <div className="workload-tags">
          <p>Workload (Required)</p>
          <button
            className={`btn-pill ${workload["lightWorkload"] ? "active" : ""}`}
            onClick={() => handleSelectionChange(setWorkload, "lightWorkload")}
          >
            Light Workload
          </button>

          <button
            className={`btn-pill ${workload["fairWorkload"] ? "active" : ""}`}
            onClick={() => handleSelectionChange(setWorkload, "fairWorkload")}
          >
            Fair Workload
          </button>
          <button
            className={`btn-pill ${workload["heavyWorkload"] ? "active" : ""}`}
            onClick={() => handleSelectionChange(setWorkload, "heavyWorkload")}
          >
            Heavy Workload
          </button>
        </div>
        <div className="other-tags">
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${
              courseTags["followsTextbook"] ? "active" : ""
            }`}
            onClick={() => multiSelectChange(setCourseTags, "followsTextbook")}
            value="followsTextbook"
          >
            Follows Textbook
          </button>
          <button
            className={`btn-pill ${
              courseTags["participationHeavy"] ? "active" : ""
            }`}
            onClick={() =>
              multiSelectChange(setCourseTags, "participationHeavy")
            }
            value="participationHeavy"
          >
            Participation Heavy
          </button>
          <button
            className={`btn-pill ${
              courseTags["discussionBased"] ? "active" : ""
            }`}
            onClick={() => multiSelectChange(setCourseTags, "discussionBased")}
            value="discussionBased"
          >
            Discussion Based
          </button>
          <button
            className={`btn-pill ${
              courseTags["noFinalProject"] ? "active" : ""
            }`}
            onClick={() => multiSelectChange(setCourseTags, "noFinalProject")}
            value="noFinalProject"
          >
            Final Project Instead of Exam
          </button>
        </div>
      </div>
      <div className="prof-tags">
        <h4>Professor Tags</h4>
        <div className="lecturer-quality-tags">
          <p>Lecture Style (Required)</p>
          <button
            className={`btn-pill ${
              lecturerStyle["greatLecturer"] ? "active" : ""
            }`}
            onClick={() => {
              handleSelectionChange(setLecturerStyle, "greatLecturer");
            }}
          >
            Great Lecturer
          </button>
          <button
            className={`btn-pill ${
              lecturerStyle["fairLecturer"] ? "active" : ""
            }`}
            onClick={() =>
              handleSelectionChange(setLecturerStyle, "fairLecturer")
            }
          >
            Fair Lecturer
          </button>
          <button
            className={`btn-pill ${
              lecturerStyle["confusingLecturer"] ? "active" : ""
            }`}
            onClick={() =>
              handleSelectionChange(setLecturerStyle, "confusingLecturer")
            }
          >
            Confusing Lecturer
          </button>
        </div>

        <div className="grading-tags">
          <p>Grading Style (Required)</p>
          <button
            className={`btn-pill ${
              gradingStyle["lenientGrader"] ? "active" : ""
            }`}
            onClick={() =>
              handleSelectionChange(setGradingStyle, "lenientGrader")
            }
          >
            Lenient Grader
          </button>
          <button
            className={`btn-pill ${gradingStyle["fairGrader"] ? "active" : ""}`}
            onClick={() => handleSelectionChange(setGradingStyle, "fairGrader")}
          >
            Fair Grader
          </button>
          <button
            className={`btn-pill ${
              gradingStyle["toughGrader"] ? "active" : ""
            }`}
            onClick={() =>
              handleSelectionChange(setGradingStyle, "toughGrader")
            }
          >
            Tough Grader
          </button>
        </div>
        <div className="other-tags">
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${profTags["approachable"] ? "active" : ""}`}
            onClick={() => multiSelectChange(setProfTags, "approachable")}
            value="approachable"
          >
            Approachable
          </button>
          <button
            className={`btn-pill ${profTags["willingToHelp"] ? "active" : ""}`}
            onClick={() => multiSelectChange(setProfTags, "willingToHelp")}
            value="willingToHelp"
          >
            Willing To Help
          </button>
        </div>
      </div>
    </>
  );
};

TagSelection.propTypes = {
  workload: PropTypes.object.isRequired,
  lecturerStyle: PropTypes.object.isRequired,
  gradingStyle: PropTypes.object.isRequired,
  profTags: PropTypes.object.isRequired,
  courseTags: PropTypes.object.isRequired,
  setWorkload: PropTypes.func.isRequired,
  setLecturerStyle: PropTypes.func.isRequired,
  setGradingStyle: PropTypes.func.isRequired,
  setCourseTags: PropTypes.func.isRequired,
  setProfTags: PropTypes.func.isRequired,
};

export default TagSelection;
