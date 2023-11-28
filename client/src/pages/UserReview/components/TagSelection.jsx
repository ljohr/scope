import PropTypes from "prop-types";

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
  const toggleProf = (tag) => {
    setProfTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };
  const toggleCourse = (tag) => {
    setCourseTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <>
      <div className="course-tags">
        <h4>Course Tags</h4>
        <div className="workload-tags">
          <p>Workload (Required)</p>
          <button
            className={`btn-pill ${
              workload === "lightWorkload" ? "active" : ""
            }`}
            onClick={() => setWorkload("lightWorkload")}
          >
            Light Workload
          </button>

          <button
            className={`btn-pill ${
              workload === "fairWorkload" ? "active" : ""
            }`}
            onClick={() => setWorkload("fairWorkload")}
          >
            Fair Workload
          </button>
          <button
            className={`btn-pill ${
              workload === "heavyWorkload" ? "active" : ""
            }`}
            onClick={() => setWorkload("heavyWorkload")}
          >
            Heavy Workload
          </button>
        </div>
        <div className="other-tags">
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${
              courseTags.includes("followsTextbook") ? "active" : ""
            }`}
            onClick={() => toggleCourse("followsTextbook")}
            value="followsTextbook"
          >
            Follows Textbook
          </button>
          <button
            className={`btn-pill ${
              courseTags.includes("participationHeavy") ? "active" : ""
            }`}
            onClick={() => toggleCourse("participationHeavy")}
            value="participationHeavy"
          >
            Participation Heavy
          </button>
          <button
            className={`btn-pill ${
              courseTags.includes("discussionBased") ? "active" : ""
            }`}
            onClick={() => toggleCourse("discussionBased")}
            value="discussionBased"
          >
            Discussion Based
          </button>
          <button
            className={`btn-pill ${
              courseTags.includes("noFinalProject") ? "active" : ""
            }`}
            onClick={() => toggleCourse("noFinalProject")}
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
              lecturerStyle === "greatLecturer" ? "active" : ""
            }`}
            onClick={() => {
              setLecturerStyle("greatLecturer");
            }}
          >
            Great Lecturer
          </button>
          <button
            className={`btn-pill ${
              lecturerStyle === "fairLecturer" ? "active" : ""
            }`}
            onClick={() => setLecturerStyle("fairLecturer")}
          >
            Fair Lecturer
          </button>
          <button
            className={`btn-pill ${
              lecturerStyle === "confusingLecturer" ? "active" : ""
            }`}
            onClick={() => setLecturerStyle("confusingLecturer")}
          >
            Confusing Lecturer
          </button>
        </div>

        <div className="grading-tags">
          <p>Grading Style (Required)</p>
          <button
            className={`btn-pill ${
              gradingStyle === "lenientGrader" ? "active" : ""
            }`}
            onClick={() => setGradingStyle("lenientGrader")}
          >
            Lenient Grader
          </button>
          <button
            className={`btn-pill ${
              gradingStyle === "fairGrader" ? "active" : ""
            }`}
            onClick={() => setGradingStyle("fairGrader")}
          >
            Fair Grader
          </button>
          <button
            className={`btn-pill ${
              gradingStyle === "toughGrader" ? "active" : ""
            }`}
            onClick={() => setGradingStyle("toughGrader")}
          >
            Tough Grader
          </button>
        </div>
        <div className="other-tags">
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${
              profTags.includes("approachable") ? "active" : ""
            }`}
            onClick={() => toggleProf("approachable")}
            value="approachable"
          >
            Approachable
          </button>
          <button
            className={`btn-pill ${
              profTags.includes("willingToHelp") ? "active" : ""
            }`}
            onClick={() => toggleProf("willingToHelp")}
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
  workload: PropTypes.string.isRequired,
  lecturerStyle: PropTypes.string.isRequired,
  gradingStyle: PropTypes.string.isRequired,
  profTags: PropTypes.array.isRequired,
  courseTags: PropTypes.array.isRequired,
  setWorkload: PropTypes.func.isRequired,
  setLecturerStyle: PropTypes.func.isRequired,
  setGradingStyle: PropTypes.func.isRequired,
  setCourseTags: PropTypes.func.isRequired,
  setProfTags: PropTypes.func.isRequired,
};

export default TagSelection;
