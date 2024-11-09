import React, { useEffect, useState } from 'react';
import './new.css'

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/all-transactions');
        
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        setTransactions(data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="transaction-table">
      <h2>Transaction List</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction._id}</td>
              <td>{transaction.title}</td>
              <td>{transaction.description || 'N/A'}</td>
              <td>{transaction.price}</td>
              <td>{transaction.category || 'N/A'}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
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
    </div>
  );
};

export default TransactionsTable;
