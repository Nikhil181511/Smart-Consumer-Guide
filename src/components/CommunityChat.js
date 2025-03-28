import React, { useState, useEffect } from "react";
import { db, ref, set, onValue } from "../firebase";
import "./CommunityChat.css"; // Add your CSS

const CommunityChat = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    imageUrl: "",
    comment: ""
  });

  // Fetch reviews from the database
  useEffect(() => {
    const reviewsRef = ref(db, "reviews");
    onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val();
      const reviewsList = [];
      for (let key in data) {
        reviewsList.push({ ...data[key], id: key });
      }
      setReviews(reviewsList);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newReviewRef = ref(db, "reviews/" + new Date().getTime());
    set(newReviewRef, {
      imageUrl: newReview.imageUrl,
      comment: newReview.comment
    })
      .then(() => {
        setNewReview({ imageUrl: "", comment: "" }); // Reset form after submitting
      })
      .catch((error) => {
        console.error("Error saving review:", error);
      });
  };

  return (
    <div className="community-chat">
      <h2>Community Reviews</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newReview.imageUrl}
          onChange={(e) => setNewReview({ ...newReview, imageUrl: e.target.value })}
          placeholder="Image URL"
          required
        />
        <textarea
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          placeholder="Write a comment"
          required
        />
        <button type="submit">Submit Review</button>
      </form>

      <h3>All Reviews</h3>
      <div className="reviews-list">
        {reviews.map((review) => (
          <div className="review-item" key={review.id}>
            <img src={review.imageUrl} alt="Product" />
            <p>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityChat;
