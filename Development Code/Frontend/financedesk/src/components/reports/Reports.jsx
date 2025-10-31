import React, { useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [reportType, setReportType] = useState('monthly');
  const [reportPeriod, setReportPeriod] = useState('q3-2025');
  const [reportFormat, setReportFormat] = useState('pdf');

  const recentReports = [
    {
      name: 'Monthly Expense Report - August 2025',
      generatedOn: '2025-09-01',
      period: 'Aug 2025',
      format: 'PDF'
    },
    {
      name: 'Policy Compliance Report - Q3 2025',
      generatedOn: '2025-09-05',
      period: 'Q3 2025',
      format: 'Excel'
    }
  ];

  const handleGenerateReport = () => {
    console.log('Generating report:', {
      type: reportType,
      period: reportPeriod,
      format: reportFormat
    });
  };

  const handleDownloadReport = (reportName) => {
    console.log('Downloading:', reportName);
  };

  return (
    <div className="reports">
      <h2 className="section-title">Financial Reports</h2>
      
      <div className="reports-container">
        {/* Report Generator Card */}
        <div className="report-card">
          <div className="card-header">
            <h3>Report Generator</h3>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label htmlFor="reportType">Report Type</label>
              <select 
                id="reportType"
                className="form-control"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="monthly">Monthly Expense Report</option>
                <option value="quarterly">Quarterly Budget Report</option>
                <option value="department">Department-wise Spending</option>
                <option value="policy">Policy Compliance Report</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="reportPeriod">Period</label>
              <select 
                id="reportPeriod"
                className="form-control"
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
              >
                <option value="q3-2025">Q3 2025 (Jul-Sep)</option>
                <option value="q2-2025">Q2 2025 (Apr-Jun)</option>
                <option value="q1-2025">Q1 2025 (Jan-Mar)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="reportFormat">Format</label>
              <select 
                id="reportFormat"
                className="form-control"
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <button 
              className="generate-btn"
              onClick={handleGenerateReport}
            >
              <i className="fas fa-download"></i>
              Generate Report
            </button>
          </div>
        </div>

        {/* Recent Reports Card */}
        <div className="report-card">
          <div className="card-header">
            <h3>Recent Reports</h3>
          </div>
          <div className="card-body">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Generated On</th>
                    <th>Period</th>
                    <th>Format</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report, index) => (
                    <tr key={index}>
                      <td>{report.name}</td>
                      <td>{report.generatedOn}</td>
                      <td>{report.period}</td>
                      <td>{report.format}</td>
                      <td className="action-buttons">
                        <button 
                          className="icon-btn"
                          onClick={() => handleDownloadReport(report.name)}
                          title="Download"
                        >
                          ✅
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;