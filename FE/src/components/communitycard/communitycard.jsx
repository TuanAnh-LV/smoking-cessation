import React, { useEffect, useState } from "react";
import "./communitycard.scss"; // Import the SCSS file
import { FaQuoteLeft } from "react-icons/fa";
import apiClient from "../../services/api";

// Sample data (replace with API call later)
// Removed sample data as we are fetching from API

const CommunityCardSection = () => {
  // State to store testimonials fetched from API
  const [testimonials, setTestimonials] = useState([]);
  // State to track the number of testimonials to display
  const [displayCount, setDisplayCount] = useState(6); // Initially display 6

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiClient.get("/community");
        setTestimonials(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu testimonials:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  // Function to load more testimonials
  const loadMore = () => {
    setDisplayCount((prevCount) => prevCount + 6); // Increase display count by 6 (or any number you prefer)
  };

  // Determine if there are more testimonials to load
  const hasMore = testimonials.length > displayCount;

  return (
    <div className="community-section">
      <div className="container">
        <h2>Sharing Community for Members</h2>
        <div className="cards-grid">
          {testimonials.slice(0, displayCount).map(
            (
              card,
              index // Slice the array to display only up to displayCount
            ) => (
              <div key={index} className="community-card">
                <div className="quote-icon">
                  <FaQuoteLeft />
                </div>
                <p className="quote-text">{card.quote}</p>
                <div className="card-footer">
                  <img src={card.image} alt={card.name} className="avatar" />
                  <div className="author-info">
                    <p className="author-name">{card.name}</p>
                    <p className="author-title">{card.title}</p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
        {hasMore && ( // Conditionally render the button
          <button className="view-more-button" onClick={loadMore}>
            More
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityCardSection;
