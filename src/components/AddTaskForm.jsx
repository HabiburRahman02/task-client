import axios from 'axios';
import { useState } from 'react';

const AddTaskForm = () => {
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
      category
    };
    console.log(newTask);
    axios.post('https://task-server-eight-murex.vercel.app/tasks', newTask)
      .then(res => {
        console.log(res.data);
        if (res.data.insertedId) {
          alert('Task added successfully')
        }
      })
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-12">
      <h2 className="text-2xl font-bold text-center mb-4">Add New Task</h2>

      {/* Title Field */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold">Title</span>
        </label>
        <input
          type="text"
          placeholder="Task title"
          className="input input-bordered"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
          required
        />
        <label className="label">
          <span className="label-text-alt">Maximum 50 characters</span>
        </label>
      </div>

      {/* Description Field */}
      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text font-semibold">Description</span>
        </label>
        <textarea
          placeholder="Task description (optional)"
          className="textarea textarea-bordered"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={200}
        ></textarea>
        <label className="label">
          <span className="label-text-alt">Maximum 200 characters</span>
        </label>
      </div>

      {/* Category Field */}
      <div className="form-control mb-6">
        <label className="label">
          <span className="label-text font-semibold">Category</span>
        </label>
        <select
          className="select select-bordered"
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
