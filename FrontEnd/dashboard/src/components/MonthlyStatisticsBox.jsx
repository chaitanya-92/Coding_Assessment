import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './stylestat.css';  

const MonthlyStatisticsBox = () => {
  const [selectedMonth, setSelectedMonth] = useState('03');  // Default to March
  const [selectedYear, setSelectedYear] = useState('2022');  // Default to 2022
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // List of months and years for the dropdown
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => 2021 + i);

  // Date format for the API request
  const selectedDate = `${selectedYear}-${selectedMonth}-01`;

  // Fetch statistics when the month or year changes
  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('http://localhost:4000/api/statistics', {
          params: {
            month: selectedDate,  // Send the selected date as the parameter
          },
        });

        setStatistics(response.data); // Set statistics from the response
      } catch (err) {
        setError(`Failed to fetch statistics. Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [selectedDate]);  // Refetch data when the selected date changes

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (loading) {
    return <p className="loading-message">Loading statistics...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="statistics-box">
      <h3 className="statistics-header">
        Statistics for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
      </h3>

      {/* Month Selector */}
      <div className="form-group">
        <label className="month-label" htmlFor="month">
          Select Month:
        </label>
        <select
          className="month-select"
          id="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        >
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Year Selector */}
      <div className="form-group">
        <label className="year-label" htmlFor="year">
          Select Year:
        </label>
        <select
          className="year-select"
          id="year"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Display Statistics */}
      <div className="statistics-display">
        <p><strong>Total Sales Amount:</strong> ${statistics?.totalSaleAmount || 0}</p>
        <p><strong>Total Sold Items:</strong> {statistics?.totalSoldItems || 0}</p>
        <p><strong>Total Unsold Items:</strong> {statistics?.totalUnsoldItems || 0}</p>
      </div>
    </div>
  );
};

export default MonthlyStatisticsBox;
