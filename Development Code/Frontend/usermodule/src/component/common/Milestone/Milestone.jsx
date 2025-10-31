import React from 'react';
import styles from './Milestone.module.css'

const Milestone = ({ milestones = [] }) => {
  return (
    <div className="milestone-container">
      <h2>Project Milestones</h2>
      <div className="milestone-timeline">
        {milestones.map((milestone, index) => (
          <div key={milestone.id || index} className="milestone-item">
            <div className="milestone-icon">
              <div className="milestone-circle"></div>
              {index < milestones.length - 1 && <div className="milestone-line"></div>}
            </div>
            <div className="milestone-content">
              <h3 className="milestone-title">{milestone.title}</h3>
              <p className="milestone-description">{milestone.description}</p>
              <span className="milestone-date">{milestone.date}</span>
              {milestone.status && (
                <span className={`milestone-status milestone-status-${milestone.status}`}>
                  {milestone.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Milestone;