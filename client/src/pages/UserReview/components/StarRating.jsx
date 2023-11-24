import { useState } from "react";
import PropTypes from "prop-types";
import Rating from "@mui/material/Rating";

const StarRating = ({ rating, setRating }) => {
  const [ratingText, setRatingText] = useState(null);

  const handleChange = (event, newValue) => {
    if (newValue == null) {
      newValue = 0.0;
    }
    setRating(newValue);
    setRatingText(labels[newValue]);
  };

  const labels = {
    0.5: "Very Bad",
    1: "Bad",
    1.5: "Very Poor",
    2: "Poor",
    2.5: "Okay",
    3: "Good",
    3.5: "Very Good",
    4: "Great",
    4.5: "Excellent",
    5: "Amazing",
  };

  const customIcons = {
    0.5: "😞",
    1: "😒",
    1.5: "🙁",
    2: "😐",
    2.5: "😐",
    3: "🙂",
    3.5: "😊",
    4: "😄",
    4.5: "🌟",
    5: "🔥",
  };

  return (
    <div className="course-stars">
      <Rating
        name="half-rating"
        defaultValue={0.0}
        value={rating}
        precision={0.5}
        onChange={handleChange}
      />
      {rating !== null && (
        <>
          <span>{rating.toFixed(1)}</span>
        </>
      )}
      <div className="rating-info-btn">
        <span className="rating-text">{ratingText || "Select Rating"}</span>
        {rating !== null && (
          <>
            <span>{customIcons[rating]}</span>
          </>
        )}
      </div>
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number,
  setRating: PropTypes.func.isRequired,
};

export default StarRating;
