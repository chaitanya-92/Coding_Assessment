import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PriceRangeBarChart = () => {
  const [selectedMonth, setSelectedMonth] = useState('03'); // Default March
  const [selectedYear, setSelectedYear] = useState('2022'); // Default 2022
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // List of months for the dropdown
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

  // List of years for the dropdown
  const years = Array.from({ length: 5 }, (_, i) => 2021 + i);

  // Price ranges to categorize the data
  const priceRanges = [
    { label: '0-100', min: 0, max: 100 },
    { label: '101-200', min: 101, max: 200 },
    { label: '201-300', min: 201, max: 300 },
    { label: '301-400', min: 301, max: 400 },
    { label: '401-500', min: 401, max: 500 },
    { label: '501-600', min: 501, max: 600 },
    { label: '601-700', min: 601, max: 700 },
    { label: '701-800', min: 701, max: 800 },
    { label: '801-900', min: 801, max: 900 },
    { label: '901-above', min: 901, max: Infinity },  
  ];

  // Fetch bar chart data from the API
  useEffect(() => {
    const fetchBarChartData = async () => {
      setLoading(true);
      setError(null);

      const fullMonth = `${selectedYear}-${selectedMonth}`;  // Format as YYYY-MM

      try {
        const response = await axios.get('http://localhost:4000/api/bar-chart', {
          params: {
            month: fullMonth,
          }
        });

        const data = response.data;

        // Initialize counts for each price range
        const counts = priceRanges.map(() => 0);

        // Categorize data into price ranges
        data.forEach(item => {
          const price = item._id;
          const count = item.count;

          // Find the appropriate range for each price
          priceRanges.forEach((range, index) => {
            if (price >= range.min && price <= range.max) {
              counts[index] += count;  // Add the count to the right range
            }
          });
        });

        setChartData({
          labels: priceRanges.map(range => range.label),
          datasets: [
            {
              label: 'Number of Items',
              data: counts,
              backgroundColor: '#ffcc00',
              borderColor: '#f5a623',
              borderWidth: 1
            }
          ]
        });
      } catch (err) {
        setError('Failed to load chart data.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedMonth && selectedYear) {
      fetchBarChartData();
    }
  }, [selectedMonth, selectedYear]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  if (loading) {
    return <p>Loading chart...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="chart-container">
      <h3>Price Range Bar Chart for {months.find(m => m.value === selectedMonth)?.label} {selectedYear}</h3>

      {/* Month Selector */}
      <label>
        Select Month:
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </label>

      {/* Year Selector */}
      <label>
        Select Year:
        <select value={selectedYear} onChange={handleYearChange}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </label>

      {/* Bar Chart */}
      <Bar data={chartData} />
    </div>
  );
};

export default PriceRangeBarChart;
