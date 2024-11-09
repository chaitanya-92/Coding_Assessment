import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './TransactionsTableView.css';
import './styletable.css';

// Month options
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

// Year options 
const years = Array.from({ length: 5 }, (_, i) => 2021 + i);

// Pagination settings
const perPage = 10;  

const TransactionsTableView = () => {
  const [transactions, setTransactions] = useState([]); // To store all fetched transactions
  const [displayedTransactions, setDisplayedTransactions] = useState([]); // To store filtered transactions for display
  const [page, setPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("03");  // Default March
  const [selectedYear, setSelectedYear] = useState("2022");  // Default year
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch transactions from API
  const fetchTransactions = useCallback(async (month, year, page) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:4000/api/transactions`, {
        params: {
          month: `${year}-${month}`,
          page,
          perPage,
        },
      });

      setTransactions(response.data.transactions || []);
      setTotalTransactions(response.data.total || 0);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setPage(1);  
  };

  // Handle year change
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setPage(1);  
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setPage(1);  
  };

  // Filter transactions based on search query
  const filterTransactions = useCallback(() => {
    const query = searchQuery.toLowerCase();
    const filteredTransactions = transactions.filter((transaction) => {
      return (
        transaction.title.toLowerCase().includes(query) ||
        (transaction.description && transaction.description.toLowerCase().includes(query)) ||
        transaction.price.toString().includes(query)
      );
    });

    setDisplayedTransactions(filteredTransactions);
    setTotalTransactions(filteredTransactions.length); 
  }, [searchQuery, transactions]);

  // Handle page navigation
  const handleNextPage = () => {
    if (page * perPage < totalTransactions) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  // Fetch data when component mounts or when page, selectedMonth, selectedYear, or search query changes
  useEffect(() => {
    fetchTransactions(selectedMonth, selectedYear, page);
  }, [selectedMonth, selectedYear, page, fetchTransactions]);

  // Apply search filter whenever the search query changes
  useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  // Get the transactions to display based on pagination
  const currentTransactions = displayedTransactions.slice((page - 1) * perPage, page * perPage);

  return (
    <div>
      <h2>Transaction List</h2>

      {/* Month, Year and Search Filters */}
      <div className="filters">
        <label>
          Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Year:
          <select value={selectedYear} onChange={handleYearChange}>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {/* Search Box */}
        <label>
          Search:
          <input
            type="text"
            placeholder="Search by title, description, or price"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {loading ? (
        <p>Loading transactions...</p>
      ) : (
        <>
          {/* Transactions Table */}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Date of Sale</th>
                <th>Sold Status</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction._id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description || 'N/A'}</td>
                  <td>${transaction.price}</td>
                  <td>{transaction.category || 'N/A'}</td>
                  <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                  <td>{transaction.isSold ? 'Sold' : 'Not Sold'}</td>
                  <td>
                    {transaction.image ? (
                      <img src={transaction.image} alt={transaction.title} style={{ width: '50px', height: '50px' }} />
                    ) : (
                      'No Image'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={handleNextPage}
              disabled={page * perPage >= totalTransactions}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionsTableView;
