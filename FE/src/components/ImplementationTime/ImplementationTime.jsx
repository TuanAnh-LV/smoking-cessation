import React from "react";
import "./ImplementationTime.scss";
import { MdDateRange } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ImplementationTime = ({ startDate, setStartDate, endDate }) => {
  // Hàm định dạng dd/mm/yyyy
  const formatDMY = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="implementation-time-container">
      <h2>Thời gian thực hiện</h2>
      <div className="date-inputs-container">
        <div className="date-input-group">
          <label htmlFor="startDate">Ngày bắt đầu</label>
          <div className="input-icon-container">
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              className="date-input"
            />

            <MdDateRange className="calendar-icon-2" />
          </div>
        </div>

        <div className="date-input-group">
          <label htmlFor="endDate">Ngày dự kiến hoàn thành</label>
          <div className="input-icon-container">
            <input
              id="endDate"
              value={formatDMY(endDate)}
              readOnly
              className="date-input"
              placeholder="dd/mm/yyyy"
            />
            <MdDateRange className="calendar-icon-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationTime;
