import PropTypes from "prop-types";

const TagSelection = ({
  workload,
  lecturerStyle,
  grading,
  selectedTags,
  setWorkload,
  setLecturerStyle,
  setGrading,
  setSelectedTags,
}) => {
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
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
        <div>
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${
              selectedTags.includes("followsTextbook") ? "active" : ""
            }`}
            onClick={() => toggleTag("followsTextbook")}
            value="followsTextbook"
          >
            Follows Textbook
          </button>
          <button
            className={`btn-pill ${
              selectedTags.includes("participationHeavy") ? "active" : ""
            }`}
            onClick={() => toggleTag("participationHeavy")}
            value="participationHeavy"
          >
            Participation Heavy
          </button>
          <button
            className={`btn-pill ${
              selectedTags.includes("discussionBased") ? "active" : ""
            }`}
            onClick={() => toggleTag("discussionBased")}
            value="discussionBased"
          >
            Discussion Based
          </button>
          <button
            className={`btn-pill ${
              selectedTags.includes("noFinalProject") ? "active" : ""
            }`}
            onClick={() => toggleTag("noFinalProject")}
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
            onClick={() => setLecturerStyle("greatLecturer")}
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
            className={`btn-pill ${grading === "toughGrader" ? "active" : ""}`}
            onClick={() => setGrading("toughGrader")}
          >
            Tough Grader
          </button>
          <button
            className={`btn-pill ${grading === "fairGrader" ? "active" : ""}`}
            onClick={() => setGrading("fairGrader")}
          >
            Fair Grader
          </button>
          <button
            className={`btn-pill ${
              grading === "lenientGrader" ? "active" : ""
            }`}
            onClick={() => setGrading("lenientGrader")}
          >
            Lenient Grader
          </button>
        </div>
        <div>
          <p>Other Tags (Optional)</p>
          <button
            className={`btn-pill ${
              selectedTags.includes("approachable") ? "active" : ""
            }`}
            onClick={() => toggleTag("approachable")}
            value="approachable"
          >
            Approachable
          </button>
          <button
            className={`btn-pill ${
              selectedTags.includes("willingToHelp") ? "active" : ""
            }`}
            onClick={() => toggleTag("willingToHelp")}
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
  grading: PropTypes.string.isRequired,
  selectedTags: PropTypes.array.isRequired,
  setWorkload: PropTypes.func.isRequired,
  setLecturerStyle: PropTypes.func.isRequired,
  setGrading: PropTypes.func.isRequired,
  setSelectedTags: PropTypes.func.isRequired,
};

export default TagSelection;
