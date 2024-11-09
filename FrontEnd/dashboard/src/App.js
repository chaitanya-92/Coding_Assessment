import React from 'react'
import TransactionsTableView from './components/TransactionsTableView';
import MonthlyStatisticsBox from './components/MonthlyStatisticsBox';
import BarChart from './components/PriceRangeBarChart'
const App = () => {
  return (
    <div>
             <h1>Transactions Dashboard</h1>

        
              {/* Table View */}
              <TransactionsTableView />
              {/* Stats */}
              <MonthlyStatisticsBox />
              {/* BarChart  */}
              <BarChart />
    </div>
  )
}

export default App