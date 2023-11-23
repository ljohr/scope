import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";

const StarRating = ({ rating, setRating }) => {
  const handleChange = (event, newValue) => {
    if (newValue == null) {
      newValue = 1;
    }
    setRating(newValue);
  };

  return (
    <div className="course-stars">
      <span>{rating.toFixed(1)}</span>
      <Rating
        name="half-rating"
        defaultValue={1.0}
        value={rating}
        precision={0.5}
        onChange={handleChange}
      />
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  setRating: PropTypes.func.isRequired,
};

export default StarRating;
