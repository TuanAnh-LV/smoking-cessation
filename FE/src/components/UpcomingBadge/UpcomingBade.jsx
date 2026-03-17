import React from 'react'

const UpcomingBade = ({ icon, title, description, rarity }) => {
  return (
    <div className="badge-card">
      <div className="badge-icon">
        {icon}
      </div>
      <div >
        <h3 className="badge-title">{title}</h3>
        <p className="badge-description">{description}</p>
        <p className={`badge-rarity rarity-${rarity.toLowerCase()}`}>{rarity}</p>
        <p className="badge-status">Not yet achieved</p>
      </div>
    </div>
  )
}

export default UpcomingBade