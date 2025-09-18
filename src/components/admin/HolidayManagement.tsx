import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Calendar, Plus, Edit, Trash2, Upload, FileSpreadsheet, FileText, ChevronDown, X } from 'lucide-react';

const HolidayManagement: React.FC = () => {
  const { holidays, addHoliday, updateHoliday, deleteHoliday } = useData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportOptions, setShowImportOptions] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'excel' | 'pdf' | null>(null);
  const [editingHoliday, setEditingHoliday] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHoliday) {
      updateHoliday(editingHoliday, formData);
      setEditingHoliday(null);
    } else {
      addHoliday(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      date: '',
      description: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (holiday: any) => {
    setFormData({
      name: holiday.name,
      date: holiday.date,
      description: holiday.description || ''
    });
    setEditingHoliday(holiday.id);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      deleteHoliday(id);
    }
  };

  const handleImportClick = (type: 'excel' | 'pdf') => {
    setImportType(type);
    setShowImportOptions(false);
    setShowImportModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Mock file processing - in real app, this would parse the file
    console.log(`Processing ${importType} file:`, file.name);
    
    // Show success message
    setTimeout(() => {
      const event = new CustomEvent('showToast', {
        detail: {
          type: 'success',
          title: 'Import Successful',
          message: `Holidays imported successfully from ${file.name}`
        }
      });
      window.dispatchEvent(event);
    }, 100);

    setShowImportModal(false);
    setImportType(null);
  };

  const closeImportModal = () => {
    setShowImportModal(false);
    setImportType(null);
  };

  const sortedHolidays = [...holidays].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="w-8 h-8 text-orange-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Holiday Management</h1>
            <p className="text-gray-600">Manage company holidays and special events</p>
          </div>
        </div>
        <div className="flex gap-3">
          {/* Add Holidays Import Button */}
          <div className="relative">
            <button
              onClick={() => setShowImportOptions(!showImportOptions)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              aria-label="Import holidays from file"
            >
              <Upload className="w-4 h-4" />
              Add Holidays
              <ChevronDown className={`w-4 h-4 transition-transform ${showImportOptions ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Import Options Dropdown */}
            {showImportOptions && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 px-3 py-2 uppercase tracking-wide">
                    Import Options
                  </div>
                  
                  <button
                    onClick={() => handleImportClick('excel')}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <FileSpreadsheet className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Import from Excel Sheet</div>
                      <div className="text-sm text-gray-500">Upload .xlsx or .xls files</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => handleImportClick('pdf')}
                    className="w-full flex items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <FileText className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Import from PDF</div>
                      <div className="text-sm text-gray-500">Upload .pdf files</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Manual Add Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Manually
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingHoliday ? 'Edit Holiday' : 'Add New Holiday'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holiday Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
                placeholder="e.g., New Year's Day"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description or significance of the holiday..."
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                {editingHoliday ? 'Update Holiday' : 'Add Holiday'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Holidays List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Company Holidays</h3>
          <p className="text-gray-600 text-sm mt-1">{holidays.length} holidays configured</p>
        </div>

        {sortedHolidays.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Holidays Added</h3>
            <p className="text-gray-600 mb-4">Start by adding your first company holiday.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Holiday
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Holiday Name</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Day</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedHolidays.map((holiday) => {
                  const date = new Date(holiday.date);
                  const today = new Date();
                  const isPast = date < today;
                  const isToday = date.toDateString() === today.toDateString();
                  
                  return (
                    <tr key={holiday.id} className={`border-b border-gray-100 hover:bg-gray-50 ${
                      isToday ? 'bg-orange-50' : isPast ? 'opacity-60' : ''
                    }`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isToday ? 'bg-orange-200' : 'bg-orange-100'
                          }`}>
                            <Calendar className={`w-5 h-5 ${
                              isToday ? 'text-orange-700' : 'text-orange-600'
                            }`} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{holiday.name}</div>
                            {isToday && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-900">
                        {date.toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {date.toLocaleDateString('en-US', { weekday: 'long' })}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        {holiday.description || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(holiday)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(holiday.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{holidays.length}</p>
              <p className="text-sm text-gray-600">Total Holidays</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {holidays.filter(h => new Date(h.date) > new Date()).length}
              </p>
              <p className="text-sm text-gray-600">Upcoming</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {new Date().getFullYear()}
              </p>
              <p className="text-sm text-gray-600">Current Year</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  importType === 'excel' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {importType === 'excel' ? (
                    <FileSpreadsheet className={`w-5 h-5 ${importType === 'excel' ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <FileText className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Import from {importType === 'excel' ? 'Excel Sheet' : 'PDF'}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select a {importType === 'excel' ? '.xlsx or .xls' : '.pdf'} file to upload
                  </p>
                </div>
              </div>
              <button
                onClick={closeImportModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close import dialog"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                  importType === 'excel' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {importType === 'excel' ? (
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  ) : (
                    <FileText className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Choose {importType === 'excel' ? 'Excel' : 'PDF'} File
                </h3>
                <p className="text-gray-600 mb-4">
                  {importType === 'excel' 
                    ? 'Upload an Excel file containing holiday data with columns for name, date, and description.'
                    : 'Upload a PDF file containing holiday information that will be processed and extracted.'
                  }
                </p>
                
                <label className="inline-block">
                  <input
                    type="file"
                    accept={importType === 'excel' ? '.xlsx,.xls' : '.pdf'}
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label={`Select ${importType} file for import`}
                  />
                  <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors ${
                    importType === 'excel' 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}>
                    <Upload className="w-4 h-4" />
                    Select {importType === 'excel' ? 'Excel' : 'PDF'} File
                  </span>
                </label>
              </div>
              
              {/* File Format Guidelines */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">File Format Guidelines:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {importType === 'excel' ? (
                    <>
                      <li>• Column A: Holiday Name (required)</li>
                      <li>• Column B: Date (YYYY-MM-DD format)</li>
                      <li>• Column C: Description (optional)</li>
                      <li>• First row should contain headers</li>
                      <li>• Maximum file size: 10MB</li>
                    </>
                  ) : (
                    <>
                      <li>• PDF should contain holiday names and dates</li>
                      <li>• Text should be selectable (not scanned images)</li>
                      <li>• Dates should be in recognizable format</li>
                      <li>• Maximum file size: 10MB</li>
                      <li>• Processing may take a few moments</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeImportModal}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside handler for dropdown */}
      {showImportOptions && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowImportOptions(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default HolidayManagement;