import axios from 'axios';
import { useState, useEffect } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const UpdateTaskForm = () => {
    const data = useLoaderData();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('To-Do'); // Default category

    useEffect(() => {
        if (data) {
            setTitle(data.title || '');
            setDescription(data.description || '');
            setCategory(data.category || 'To-Do');
        }
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title) return;

        const updatedTask = {
            title,
            description,
            timestamp: new Date().toISOString(),
            category
        };
        console.log(updatedTask);

        // API call for updating task
        axios.patch(`https://task-server-eight-murex.vercel.app/taskUpdateById/${data._id}`, updatedTask)
            .then(res => {
                if (res.data.modifiedCount > 0) {
                    Swal.fire({
                        title: "Updated!",
                        text: "This task updated successfully",
                        icon: "success"
                    });
                    navigate('/tasks')
                }
            })
            .catch(err => {
                console.log(err);
            })
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg my-12">
            <h2 className="text-2xl font-bold text-center mb-4">Update Task</h2>

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
                Update Task
            </button>
        </form>
    );
};

export default UpdateTaskForm;
