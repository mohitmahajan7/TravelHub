// components/employees/EmployeeDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { useEmployees } from '../../hooks/useEmployees';
import { LoadingSpinner } from '../common/LoadingSpinner';

const EmployeeDetail = ({ onEdit, onBack }) => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const { getEmployeeById, loading, error } = useEmployees();

  const [employee, setEmployee] = useState(null);
  const [detailLoading, setDetailLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      if (employeeId) {
        try {
          setDetailLoading(true);
          const employeeData = await getEmployeeById(employeeId);
          setEmployee(employeeData);
        } catch (err) {
          console.error('Error fetching employee:', err);
        } finally {
          setDetailLoading(false);
        }
      }
    };

    fetchEmployee();
  }, [employeeId, getEmployeeById]);

  const handleEdit = () => {
    if (employee) {
      console.log('🔍 Employee data for editing:', employee);
      
      if (onEdit) {
        // Pass the employee data to parent component
        onEdit(employee);
      } else {
        // Fallback to navigation
        const empId = employee.user_id || employee.id;
        if (empId) {
          navigate(`/employees/${empId}/edit`);
        }
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/employees');
    }
  };

  if (detailLoading) {
    return (
      <div className="content">
        <LoadingSpinner text="Loading employee details..." />
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="content">
        <div className="errorMessage">
          <i className="fas fa-exclamation-circle"></i>
          {error || 'Employee not found'}
        </div>
        <button onClick={handleBack} className="btn btnSecondary">
          Back to List
        </button>
      </div>
    );
  }

  const originalData = employee._original || {};

  return (
    <div className="content">
      <div className="detailHeader">
        <h2>Employee Details</h2>
      </div>

      <div className="card">
        <div className="cardHeaderFlex">
          <div>
            <h3>{employee.first_name} {employee.last_name}</h3>
            <p>Employee ID: {employee.employee_code}</p>
            <p>Department: {employee.department}</p>
          </div>
          <div>
            <Badge variant={employee.status}>
              {employee.status ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1) : 'Unknown'}
            </Badge>
          </div>
        </div>

        <div className="cardBodyGrid">
          <div>
            <h4>Personal Information</h4>
            <div className="detailList">
              <div className="detailItem">
                <span>Full Name:</span>
                <span>{originalData.fullName || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <span>Email:</span>
                <span>{employee.email}</span>
              </div>
              <div className="detailItem">
                <span>Phone:</span>
                <span>{originalData.phoneNumber || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <span>Manager Name:</span>
                <span>{originalData.managerName || 'N/A'}</span>
              </div>
            </div>
          </div>
          <div>
            <h4>Employment Details</h4>
            <div className="detailList">
              <div className="detailItem">
                <span>Department:</span>
                <span>{employee.department || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <span>Level:</span>
                <span>{originalData.level || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <span>Employee Code:</span>
                <span>{employee.employee_code || 'N/A'}</span>
              </div>
              <div className="detailItem">
                <span>Status:</span>
                <span>{originalData.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="detailItem">
                <span>Project IDs:</span>
                <span>
                  {originalData.projectIds && originalData.projectIds.length > 0 
                    ? originalData.projectIds.join(', ') 
                    : 'N/A'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="formActions">
        <button onClick={handleBack} className="btn btnSecondary">
          Back to List
        </button>
        <button
          onClick={handleEdit}
          className="btn btnPrimary"
          disabled={!employee.user_id}
        >
          <i className="fas fa-edit"></i> Edit Employee
        </button>
      </div>
    </div>
  );
};

export { EmployeeDetail };
export default EmployeeDetail;