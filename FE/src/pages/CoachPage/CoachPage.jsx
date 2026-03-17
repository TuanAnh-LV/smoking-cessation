import React from 'react'
import './CoachPage.scss'

const CoachPage = () => {
  return (
    <div className="coach-page-container">
      <h1 className="coaching-team-title">Coaching Team</h1>
      <div className="search-container">
        <input type="text" placeholder="Tìm kiếm" className="search-input"/>
        <button className="search-button">➔</button>
      </div>
      <h2 className="coach-heading">Coach</h2>
      <div className="coach-cards-grid">
        {/* Sample Coach Card - You will likely fetch and map over real coach data here */}
        <div className="coach-card">
          
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
        {/* Repeat the coach-card block for more coaches */}
        <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://cdn2.tuoitre.vn/zoom/700_525/471584752817336320/2025/4/17/phim-john-wick-1-1744902786784973111479-16-195-431-987-crop-174490420766814534277.jpg" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
         <div className="coach-card">
          <img src="https://via.placeholder.com/200" alt="Coach" className="coach-image"/> {/* Placeholder image */}
          <h3 className="coach-name">TS. Nguyễn Danh Nam</h3>
          <p className="coach-title">Master's in Tobacco Research and Tobacco Behavior...</p>
          <div className="coach-rating">
            <span>★☆☆☆☆</span> <span>1/5</span>
          </div>
        </div>
      </div>
      <button className="more-button">More</button>
    </div>
  )
}

export default CoachPage