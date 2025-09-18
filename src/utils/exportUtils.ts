import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportData {
  title: string;
  data: any[];
  headers: string[];
  filename: string;
}

export const exportToExcel = (exportData: ExportData) => {
  try {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create worksheet data with headers
    const wsData = [
      exportData.headers,
      ...exportData.data.map(row => exportData.headers.map(header => row[header] || ''))
    ];
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Set column widths
    const colWidths = exportData.headers.map(() => ({ wch: 15 }));
    ws['!cols'] = colWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, exportData.title);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${exportData.filename}_${timestamp}.xlsx`;
    
    // Write file
    XLSX.writeFile(wb, filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: 'Failed to export Excel file' };
  }
};

export const exportToPDF = (exportData: ExportData) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(exportData.title, 14, 22);
    
    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);
    
    // Prepare table data
    const tableData = exportData.data.map(row => 
      exportData.headers.map(header => row[header] || '')
    );
    
    // Add table
    autoTable(doc, {
      head: [exportData.headers],
      body: tableData,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 40 },
    });
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${exportData.filename}_${timestamp}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    return { success: true, filename };
  } catch (error) {
    console.error('PDF export error:', error);
    return { success: false, error: 'Failed to export PDF file' };
  }
};

export const prepareReportsData = (
  reportType: string,
  leaveRequests: any[],
  employees: any[],
  departments: any[]
) => {
  switch (reportType) {
    case 'overview':
      return {
        title: 'Leave Management Overview Report',
        filename: 'leave_overview_report',
        headers: ['Employee Name', 'Employee ID', 'Department', 'Leave Type', 'From Date', 'To Date', 'Days', 'Status', 'Applied Date'],
        data: leaveRequests.map(request => {
          const employee = employees.find(emp => emp.id === request.employee_id);
          const department = departments.find(dept => dept.id === employee?.department_id);
          return {
            'Employee Name': employee?.name || 'Unknown',
            'Employee ID': employee?.employee_id || 'Unknown',
            'Department': department?.name || 'Unknown',
            'Leave Type': request.leave_type.charAt(0).toUpperCase() + request.leave_type.slice(1),
            'From Date': new Date(request.from_date).toLocaleDateString(),
            'To Date': new Date(request.to_date).toLocaleDateString(),
            'Days': request.days_count,
            'Status': request.status.charAt(0).toUpperCase() + request.status.slice(1),
            'Applied Date': new Date(request.created_at).toLocaleDateString()
          };
        })
      };
      
    case 'department':
      const departmentStats = departments.map(dept => {
        const deptEmployees = employees.filter(emp => emp.department_id === dept.id);
        const deptRequests = leaveRequests.filter(req => 
          deptEmployees.some(emp => emp.id === req.employee_id)
        );
        
        return {
          'Department': dept.name,
          'Total Employees': deptEmployees.length,
          'Total Requests': deptRequests.length,
          'Approved': deptRequests.filter(req => req.status === 'approved').length,
          'Pending': deptRequests.filter(req => req.status === 'pending').length,
          'Rejected': deptRequests.filter(req => req.status === 'rejected').length,
          'Total Days Approved': deptRequests
            .filter(req => req.status === 'approved')
            .reduce((sum, req) => sum + req.days_count, 0),
          'Avg Days per Employee': deptEmployees.length > 0 
            ? (deptRequests.filter(req => req.status === 'approved')
                .reduce((sum, req) => sum + req.days_count, 0) / deptEmployees.length).toFixed(1)
            : '0'
        };
      });
      
      return {
        title: 'Department-wise Leave Report',
        filename: 'department_leave_report',
        headers: ['Department', 'Total Employees', 'Total Requests', 'Approved', 'Pending', 'Rejected', 'Total Days Approved', 'Avg Days per Employee'],
        data: departmentStats
      };
      
    case 'employee':
      const employeeStats = employees.map(emp => {
        const empRequests = leaveRequests.filter(req => req.employee_id === emp.id);
        const department = departments.find(dept => dept.id === emp.department_id);
        
        return {
          'Employee Name': emp.name,
          'Employee ID': emp.employee_id,
          'Department': department?.name || 'Unknown',
          'Position': emp.position,
          'Total Requests': empRequests.length,
          'Approved': empRequests.filter(req => req.status === 'approved').length,
          'Pending': empRequests.filter(req => req.status === 'pending').length,
          'Rejected': empRequests.filter(req => req.status === 'rejected').length,
          'Total Days Used': empRequests
            .filter(req => req.status === 'approved')
            .reduce((sum, req) => sum + req.days_count, 0),
          'Joining Date': new Date(emp.joining_date).toLocaleDateString(),
          'Status': emp.status.charAt(0).toUpperCase() + emp.status.slice(1)
        };
      });
      
      return {
        title: 'Employee-wise Leave Report',
        filename: 'employee_leave_report',
        headers: ['Employee Name', 'Employee ID', 'Department', 'Position', 'Total Requests', 'Approved', 'Pending', 'Rejected', 'Total Days Used', 'Joining Date', 'Status'],
        data: employeeStats
      };
      
    case 'leave-type':
      const leaveTypeStats = ['casual', 'sick', 'paid', 'personal', 'maternity', 'paternity'].map(type => {
        const typeRequests = leaveRequests.filter(req => req.leave_type === type);
        
        return {
          'Leave Type': type.charAt(0).toUpperCase() + type.slice(1),
          'Total Requests': typeRequests.length,
          'Approved': typeRequests.filter(req => req.status === 'approved').length,
          'Pending': typeRequests.filter(req => req.status === 'pending').length,
          'Rejected': typeRequests.filter(req => req.status === 'rejected').length,
          'Total Days': typeRequests
            .filter(req => req.status === 'approved')
            .reduce((sum, req) => sum + req.days_count, 0),
          'Avg Days per Request': typeRequests.length > 0 
            ? (typeRequests.reduce((sum, req) => sum + req.days_count, 0) / typeRequests.length).toFixed(1)
            : '0',
          'Approval Rate': typeRequests.length > 0 
            ? ((typeRequests.filter(req => req.status === 'approved').length / typeRequests.length) * 100).toFixed(1) + '%'
            : '0%'
        };
      }).filter(stat => stat['Total Requests'] > 0);
      
      return {
        title: 'Leave Type Analysis Report',
        filename: 'leave_type_report',
        headers: ['Leave Type', 'Total Requests', 'Approved', 'Pending', 'Rejected', 'Total Days', 'Avg Days per Request', 'Approval Rate'],
        data: leaveTypeStats
      };
      
    default:
      return prepareReportsData('overview', leaveRequests, employees, departments);
  }
};