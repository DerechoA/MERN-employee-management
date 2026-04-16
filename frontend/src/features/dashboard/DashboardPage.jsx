import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Users,
  LogOut,
  Pencil,
  Trash2,
  X,
  ChevronRight,
  Plus,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import {
  getFormDefinition,
  getEmployees,
  getDeletedEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  undeleteEmployee,
  permanentDeleteEmployee
} from '../../services/employeeService';
import { validateField, validateForm } from '../../utils/validation';

export default function DashboardPage() {
  const { token, userEmail, logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [deletedEmployees, setDeletedEmployees] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showDeleted, setShowDeleted] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchFormDefinition();
    fetchEmployees();
  }, [token]);

  useEffect(() => {
    if (showDeleted && token) {
      fetchDeletedEmployees();
    }
  }, [showDeleted, token]);

  const buildEmptyFormData = (fields) =>
    fields.reduce((acc, field) => {
      if (field.hidden) return acc;
      return { ...acc, [field.name]: field.default ?? '' };
    }, {});

  const fetchFormDefinition = async () => {
    try {
      const res = await getFormDefinition(token);
      const fields = res.data.fields || [];
      setFormFields(fields);
      setFormData(buildEmptyFormData(fields));
    } catch (err) {
      console.error('Error fetching form definition', err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees(token);
      setEmployees(res.data);
    } catch (err) {
      console.error('Error fetching employees', err);
    }
  };

  const fetchDeletedEmployees = async () => {
    try {
      const res = await getDeletedEmployees(token);
      setDeletedEmployees(res.data);
    } catch (err) {
      console.error('Error fetching deleted employees', err);
      setDeletedEmployees([]);
    }
  };

  const handleLogout = () => {
    logout();
    setEmployees([]);
    setDeletedEmployees([]);
  };

  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const validation = validateForm(formFields, formData);
    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError('Please fix the validation errors below');
      return;
    }

    const payload = {};
    formFields.forEach((field) => {
      if (field.hidden) return;
      let value = formData[field.name] ?? '';
      if (field.inputType === 'number') {
        value = value === '' ? null : Number(value);
      }
      payload[field.name] = value;
    });

    try {
      if (editingEmployee) {
        await updateEmployee(token, editingEmployee._id, payload);
      } else {
        await createEmployee(token, payload);
      }
      setShowAddForm(false);
      setEditingEmployee(null);
      setFormData(buildEmptyFormData(formFields));
      fetchEmployees();
    } catch (err) {
      console.error('Error saving', err);
      if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors.map((errorItem) => errorItem.msg).join(', ');
        setError(validationErrors);
      } else {
        setError(err.response?.data?.message || 'Unable to save item');
      }
    }
  };

  const handleInputChange = (fieldName, value) => {
    setFormData({ ...formData, [fieldName]: value });
    const field = formFields.find((f) => f.name === fieldName);
    if (field) {
      const error = validateField(fieldName, value, field);
      setFieldErrors({ ...fieldErrors, [fieldName]: error });
    }
  };

  const handleUndelete = async (id) => {
    if (!window.confirm('Are you sure you want to restore this employee?')) return;

    try {
      await undeleteEmployee(token, id);
      fetchEmployees();
      if (showDeleted) {
        fetchDeletedEmployees();
      }
    } catch (err) {
      console.error('Error restoring employee', err);
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    const values = {};
    formFields.forEach((field) => {
      if (field.hidden) return;
      const rawValue = employee[field.name];
      values[field.name] = rawValue != null ? String(rawValue) : '';
    });
    setFormData(values);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    try {
      await deleteEmployee(token, id);
      fetchEmployees();
      if (showDeleted) {
        fetchDeletedEmployees();
      }
    } catch (err) {
      console.error('Error deleting employee', err);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this employee? This action cannot be undone.')) return;

    try {
      await permanentDeleteEmployee(token, id);
      if (showDeleted) {
        fetchDeletedEmployees();
      }
    } catch (err) {
      console.error('Error permanently deleting employee', err);
    }
  };

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans">
      <nav className="bg-white border-b border-black/5 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[#5A5A40] p-2 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A1A] tracking-tight">Employee Management</h1>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm text-[#5A5A40]/60 hidden md:block">
              Logged in as <span className="font-medium text-[#1A1A1A]">{userEmail}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-2 font-serif">Employee List</h2>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className="self-start inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
            >
              {showDeleted ? 'Hide Deleted' : 'Show Deleted'}
            </button>
            <button
              onClick={() => {
                setEditingEmployee(null);
                setFormData(buildEmptyFormData(formFields));
                setShowAddForm(!showAddForm);
              }}
              className="self-start inline-flex items-center gap-2 px-6 py-3 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              {showAddForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showAddForm ? 'Hide Form' : 'Add Employee'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-sm border border-black/5 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F5F5F0]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Position</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Salary (PHP)</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#5A5A40]/60 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-t border-black/5">
                  <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.position}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.department}</td>
                  <td className="px-6 py-4 text-sm text-[#5A5A40]/70">{emp.email}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1A1A1A]">{Number(emp.salary).toLocaleString()} PHP</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="p-2 text-[#5A5A40] hover:bg-[#F5F5F0] rounded-xl transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(emp._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Employee Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 bg-white rounded-[32px] shadow-sm border border-black/5 p-8 overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-bold text-[#1A1A1A] font-serif">
                  {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-[#F5F5F0] rounded-full transition-all"
                >
                  <X className="w-6 h-6 text-[#5A5A40]" />
                </button>
              </div>

              <form onSubmit={handleSubmitEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {error && (
                  <div className="md:col-span-2 text-red-500 text-sm bg-red-50 p-3 rounded-2xl">{error}</div>
                )}

                {formFields.map((field) => {
                  if (field.hidden) return null;
                  return (
                    <div key={field.name} className={`space-y-2 ${field.gridClass || ''}`}>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#5A5A40]/60 ml-1">
                        {field.label}
                      </label>
                      <input
                        type={field.inputType || 'text'}
                        required={field.required}
                        className={`w-full px-5 py-3 bg-[#F5F5F0] border-none rounded-2xl focus:ring-2 focus:ring-[#5A5A40] transition-all ${fieldErrors[field.name] ? 'ring-2 ring-red-500' : ''}`}
                        value={formData[field.name] ?? ''}
                        onChange={(e) => handleInputChange(field.name, e.target.value)}
                      />
                      {fieldErrors[field.name] && (
                        <p className="text-red-500 text-xs">{fieldErrors[field.name]}</p>
                      )}
                    </div>
                  );
                })}

                <div className="md:col-span-2 pt-6 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-[#5A5A40] text-white rounded-full font-medium hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
                  >
                    {editingEmployee ? 'Update Employee' : 'Create Employee'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-6 py-4 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {showDeleted && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-[#1A1A1A] mb-6 font-serif">Deleted Employees</h3>
            <div className="bg-white rounded-[32px] shadow-sm border border-red-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Deletion Info</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-red-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedEmployees.map((emp) => (
                    <tr key={emp._id} className="border-t border-red-100">
                      <td className="px-6 py-4 text-sm font-medium text-red-800">{emp.firstName} {emp.lastName}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{emp.position}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{emp.department}</td>
                      <td className="px-6 py-4 text-sm text-red-600">{emp.email}</td>
                      <td className="px-6 py-4 text-sm text-red-600">
                        {emp.deletedAt ? `Deleted on ${new Date(emp.deletedAt).toLocaleDateString()} by ${emp.deletedBy?.email || 'Unknown'}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUndelete(emp._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            title="Restore employee"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handlePermanentDelete(emp._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="Permanently delete employee"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {deletedEmployees.length === 0 && (
                <div className="px-6 py-8 text-center text-red-500">No deleted employees found</div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
