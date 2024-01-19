import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './App.css';

Modal.setAppElement('#root');

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [availableEmployees, setAvailableEmployees] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    age: '',
  });
  
  const deleteEmployee = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (confirmDelete) {
      const updatedEmployees = employees.filter((employee) => employee.id !== id);
      setEmployees(updatedEmployees);
    }
  };
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const storedEmployees = JSON.parse(localStorage.getItem('employees')) || [];
    setEmployees(storedEmployees);
    updateDashboard(storedEmployees);
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
    updateDashboard(employees);
  }, [employees]);

  const addEmployee = () => {
    setIsModalOpen(true);
    setEditEmployeeId(null);
  };

  const editEmployee = (id) => {
    setIsModalOpen(true);
    setEditEmployeeId(id);
    const employeeToEdit = employees.find((employee) => employee.id === id);
    setNewEmployeeData({
      name: employeeToEdit.name,
      age: employeeToEdit.age.toString(),
    });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewEmployeeData({ name: '', age: '' });
    setEditEmployeeId(null);
    setValidationError('');
  };

  const updateDashboard = (employeeList) => {
    setTotalEmployees(employeeList.length);
    setAvailableEmployees(employeeList.filter((employee) => employee.available).length);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const toggleAvailability = (id) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === id ? { ...employee, available: !employee.available } : employee
    );
    setEmployees(updatedEmployees);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEmployeeData({
      ...newEmployeeData,
      [name]: value,
    });
  };

  const handleAddEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.age) {
      setValidationError('Please fill in all mandatory fields.');
      return;
    }
  
    const age = parseInt(newEmployeeData.age, 10);
    if (isNaN(age) || age < 0) {
      setValidationError('Age must be a non-negative integer.');
      return;
    }

    if (editEmployeeId !== null) {
    const updatedEmployees = employees.map((employee) =>
      employee.id === editEmployeeId
        ? { ...employee, name: newEmployeeData.name, age: age }
        : employee
    );
    setEmployees(updatedEmployees);
  } else {
    const newEmployee = {
      id: employees.length + 1,
      name: newEmployeeData.name,
      age: age,
      available: true,
    };
    setEmployees([newEmployee, ...employees]);
  }

  closeModal();
};
  

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.available &&
      employee.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="App">
      <div className="dashboard">
        <div className="overview">
          <h2>Dashboard Overview</h2>
          <div>Total Employees: {totalEmployees}</div>
          <div>Available Employees: {availableEmployees}</div>
        </div>
        <div className="employee-list">
          <h2>Employee List</h2>
          <div>
            <label>Search Available Employees:</label>
            <input type="text" value={searchText} onChange={handleSearchChange} />
          </div>
          <button onClick={addEmployee}>Add Employee</button>
          <ul>
  {filteredEmployees.map((employee) => (
    <li key={employee.id}>
      {employee.name} -{' '}
      {employee.available ? 'Available' : 'Not Available'}{' '}
      <button onClick={() => toggleAvailability(employee.id)}>
        Toggle Availability
      </button>
      <button onClick={() => editEmployee(employee.id)}>Edit</button> {}
      <button onClick={() => deleteEmployee(employee.id)}>Delete</button>
    </li>
  ))}
</ul>
        </div>
      </div>
      <Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  contentLabel={editEmployeeId !== null ? "Edit Employee Modal" : "Add/Edit Employee Modal"}
>
  <h2>{editEmployeeId !== null ? 'Edit Employee' : 'Add Employee'}</h2>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={newEmployeeData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="text"
            name="age"
            value={newEmployeeData.age}
            onChange={handleInputChange}
          />
        </div>
        {validationError && <div className="error">{validationError}</div>}
        <button onClick={handleAddEmployee}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>
    </div>
  );
};

export default App;
