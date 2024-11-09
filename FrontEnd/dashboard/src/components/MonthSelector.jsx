// src/components/MonthSelector.js
import React from 'react';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthSelector = ({ selectedMonth, onChange }) => {
  return (
    <select
      value={parseInt(selectedMonth, 10)}  // Set the selected month
      onChange={(e) => {
        const newMonth = e.target.value;
        onChange(newMonth);  // Notify parent component of the month change
      }}
    >
      {months.map((month, index) => (
        <option key={index} value={(index + 1).toString().padStart(2, '0')}>
          {month}
        </option>
      ))}
    </select>
  );
};

export default MonthSelector;
