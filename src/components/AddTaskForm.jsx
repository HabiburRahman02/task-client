import axios from 'axios';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from '../provider/AuthProvider';

const AddTaskForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('To-Do'); // Default category

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    setTitle('');
    setDescription('');
    setCategory('To-Do');

    const newTask = {
      title,
      description,
      timestamp: new Date().toISOString(),
      category,
      email: user?.email
    };
    console.log(newTask);
    axios.post('http://localhost:5000/tasks', newTask)
      .then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          navigate('/tasks')
          Swal.fire({
            title: "Task!",
            text: "Added Task successfully",
            icon: "success"
          });
        }
      })
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white dark:bg-gray-950 dark:text-gray-200 rounded-lg shadow-lg my-12">
      <h2 className="text-2xl font-bold text-center mb-4">Add New Task</h2>

      {/* Title Field */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold dark:text-gray-200">Title</span>
        </label>
        <input
          type="text"
          placeholder="Task title"
          className="input input-bordered dark:bg-gray-800"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          required
        />
        <label className="label">
          <span className="label-text-alt dark:text-gray-400">Maximum 50 characters</span>
        </label>
      </div>

      {/* Description Field */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold dark:text-gray-200">Description</span>
        </label>
        <textarea
          placeholder="Task description (optional)"
          className="textarea textarea-bordered dark:bg-gray-800"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        ></textarea>
        <label className="label">
          <span className="label-text-alt dark:text-gray-400">Maximum 200 characters</span>
        </label>
      </div>

      {/* Category Field */}
      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-semibold dark:text-gray-200">Category</span>
        </label>
        <select
          className="select select-bordered dark:bg-gray-800"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="To-Do">To-Do (Tasks to be done)</option>
          <option value="In Progress">In Progress (Ongoing tasks)</option>
          <option value="Done">Done (Completed tasks)</option>
        </select>
      </div>

      <button type="submit" className="btn btn-primary w-full">
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;
