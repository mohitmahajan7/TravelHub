import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import './BudgetTracking.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const BudgetTracking = () => {
  const budgetData = {
    monthly: { budget: 500000, utilized: 420000 },
    quarterly: { budget: 1500000, utilized: 1250000 },
    categories: [
      { name: 'Flights', budget: 200000, utilized: 180000 },
      { name: 'Hotels', budget: 150000, utilized: 120000 },
      { name: 'Meals', budget: 80000, utilized: 70000 },
      { name: 'Transport', budget: 50000, utilized: 40000 },
      { name: 'Other', budget: 20000, utilized: 10000 }
    ]
  };

  const formatCurrency = (amount) => {
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  const calculateUtilization = (utilized, budget) => {
    return ((utilized / budget) * 100).toFixed(1);
  };

  const calculateRemaining = (budget, utilized) => {
    return budget - utilized;
  };

  // Chart data
  const chartData = {
    labels: budgetData.categories.map(cat => cat.name),
    datasets: [
      {
        data: budgetData.categories.map(cat => cat.utilized),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ₹${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="budget-tracking">
      <h2 className="section-title">Budget Tracking</h2>
      
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon blue">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(budgetData.monthly.utilized)}</h3>
            <p>Monthly Utilization</p>
            <small>Budget: {formatCurrency(budgetData.monthly.budget)}</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <i className="fas fa-chart-pie"></i>
          </div>
          <div className="stat-info">
            <h3>{calculateUtilization(budgetData.monthly.utilized, budgetData.monthly.budget)}%</h3>
            <p>Utilization Rate</p>
            <small>Monthly</small>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon purple">
            <i className="fas fa-project-diagram"></i>
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(budgetData.quarterly.utilized)}</h3>
            <p>Quarterly Utilization</p>
            <small>Budget: {formatCurrency(budgetData.quarterly.budget)}</small>
          </div>
        </div>
      </div>

      {/* Budget Chart */}
      <div className="budget-card">
        <div className="card-header">
          <h3>Budget by Category - Q3 2025</h3>
        </div>
        <div className="card-body">
          <div className="chart-container">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Budget Utilization Details */}
      <div className="budget-card">
        <div className="card-header">
          <h3>Budget Utilization Details</h3>
        </div>
        <div className="card-body">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Budget (₹)</th>
                  <th>Utilized (₹)</th>
                  <th>Remaining (₹)</th>
                  <th>Utilization %</th>
                </tr>
              </thead>
              <tbody>
                {budgetData.categories.map(category => {
                  const remaining = calculateRemaining(category.budget, category.utilized);
                  const utilization = calculateUtilization(category.utilized, category.budget);
                  
                  return (
                    <tr key={category.name}>
                      <td>{category.name}</td>
                      <td>₹{category.budget.toLocaleString()}</td>
                      <td>₹{category.utilized.toLocaleString()}</td>
                      <td>₹{remaining.toLocaleString()}</td>
                      <td>{utilization}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracking;