import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { BarChart3, Download, Filter, Calendar, Users, TrendingUp, PieChart } from 'lucide-react';

const Reports: React.FC = () => {
  const { leaveRequests, employees, departments } = useData();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    from: new Date().getFullYear() + '-01-01',
    to: new Date().getFullYear() + '-12-31'
  });

  // Calculate statistics
  const totalRequests = leaveRequests.length;
  const approvedRequests = leaveRequests.filter(req => req.status === 'approved').length;
  const pendingRequests = leaveRequests.filter(req => req.status === 'pending').length;
  const rejectedRequests = leaveRequests.filter(req => req.status === 'rejected').length;

  // Leave type statistics
  const leaveTypeStats = leaveRequests.reduce((acc, req) => {
    acc[req.leave_type] = (acc[req.leave_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Department statistics
  const departmentStats = departments.map(dept => {
    const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
    const deptRequests = leaveRequests.filter(req => 
      deptEmployees.some(emp => emp.id === req.employee_id)
    );
    
    return {
      name: dept.name,
      employees: deptEmployees.length,
      requests: deptRequests.length,
      approved: deptRequests.filter(req => req.status === 'approved').length,
      pending: deptRequests.filter(req => req.status === 'pending').length,
      totalDays: deptRequests.filter(req => req.status === 'approved')
        .reduce((sum, req) => sum + req.days_count, 0)
    };
  });

  const handleExport = (format: 'excel' | 'pdf') => {
    // Mock export functionality
    console.log(`Exporting ${selectedReport} report as ${format}`);
    alert(`${selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)} report exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Generate insights and reports for leave management</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-700">Filters:</span>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="overview">Overview</option>
                <option value="department">By Department</option>
                <option value="employee">By Employee</option>
                <option value="leave-type">By Leave Type</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRequests}</p>
              <p className="text-gray-600 text-sm">Total Requests</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{approvedRequests}</p>
              <p className="text-gray-600 text-sm">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{pendingRequests}</p>
              <p className="text-gray-600 text-sm">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{rejectedRequests}</p>
              <p className="text-gray-600 text-sm">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-gray-600" />
            Leave Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(leaveTypeStats).map(([type, count]) => {
              const percentage = totalRequests > 0 ? ((count / totalRequests) * 100).toFixed(1) : '0';
              return (
                <div key={type} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{type}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{percentage}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approval Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            Request Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Approved</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{approvedRequests}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Pending</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${totalRequests > 0 ? (pendingRequests / totalRequests) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{pendingRequests}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Rejected</span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-3 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${totalRequests > 0 ? (rejectedRequests / totalRequests) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{rejectedRequests}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Employees</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total Requests</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Approved</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pending</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total Days</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Avg Days/Employee</th>
              </tr>
            </thead>
            <tbody>
              {departmentStats.map((dept) => (
                <tr key={dept.name} className="border-b border-gray-100">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4 text-gray-700">{dept.employees}</td>
                  <td className="py-3 px-4 text-gray-700">{dept.requests}</td>
                  <td className="py-3 px-4 text-green-600 font-medium">{dept.approved}</td>
                  <td className="py-3 px-4 text-orange-600 font-medium">{dept.pending}</td>
                  <td className="py-3 px-4 text-gray-700">{dept.totalDays}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {dept.employees > 0 ? (dept.totalDays / dept.employees).toFixed(1) : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Activity</h3>
        <div className="space-y-3">
          {leaveRequests.slice(0, 5).map((request) => {
            const employee = employees.find(emp => emp.id === request.employee_id);
            const department = departments.find(dept => dept.id === employee?.department_id);
            
            return (
              <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                    ${request.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                    ${request.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                    ${request.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                  `}>
                    {employee?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{employee?.name}</p>
                    <p className="text-sm text-gray-600">{department?.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 capitalize">
                    {request.leave_type} - {request.days_count} days
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(request.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize
                  ${request.status === 'approved' ? 'bg-green-100 text-green-800' : ''}
                  ${request.status === 'pending' ? 'bg-orange-100 text-orange-800' : ''}
                  ${request.status === 'rejected' ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {request.status}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;