import React from "react";
import DatePicker from "react-datepicker";
import { MdDateRange } from "react-icons/md";
import "react-datepicker/dist/react-datepicker.css";
import "./ImplementationTime.scss";

const formatDMY = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${day}/${month}/${year}`;
};

const ImplementationTime = ({ startDate, setStartDate, endDate, isLoading = false }) => {
  return (
    <section className="implementation-time">
      <div className="implementation-time__header">
        <h2>Timeline</h2>
        <p>Choose when you want to start and review the expected completion date.</p>
      </div>

      {isLoading ? (
        <div className="implementation-time__grid implementation-time__grid--skeleton">
          <div className="implementation-time__skeleton-field"></div>
          <div className="implementation-time__skeleton-field"></div>
        </div>
      ) : (
        <div className="implementation-time__grid">
          <div className="implementation-time__field">
            <label htmlFor="startDate">Start date</label>
            <div className="implementation-time__input">
              <DatePicker
                id="startDate"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                className="implementation-time__control"
              />
              <MdDateRange className="implementation-time__icon" />
            </div>
          </div>

          <div className="implementation-time__field">
            <label htmlFor="endDate">Estimated completion</label>
            <div className="implementation-time__input">
              <input
                id="endDate"
                value={formatDMY(endDate)}
                readOnly
                className="implementation-time__control"
                placeholder="DD/MM/YYYY"
              />
              <MdDateRange className="implementation-time__icon" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ImplementationTime;
