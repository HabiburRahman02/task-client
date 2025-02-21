import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../provider/AuthProvider";

const Tasks = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)

    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/tasksByEmail?email=${user?.email}`);
            return res.data;
        },
    });

    const [localTasks, setLocalTasks] = useState([]);

    useEffect(() => {
        setLocalTasks(tasks);
    }, [tasks]);

    const handleUpdate = (taskId) => {
        console.log(`Update task with ID: ${taskId}`);
        navigate(`/updateTask/${taskId}`)
    };

    const handleDelete = (taskId) => {
        console.log(`Delete task with ID: ${taskId}`);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(`http://localhost:5000/deleteTaskById/${taskId}`)
                    .then((res) => {
                        refetch();
                        if (res.data.deletedCount > 0) {
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your file has been deleted.",
                                icon: "success"
                            });
                        }
                    })
                    .catch((error) => console.error(error));
            }
        });
    };

    const onDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;

        if (source.droppableId === destination.droppableId) {

            const tasksInColumn = localTasks.filter(
                (task) => task.category === source.droppableId
            );
            const otherTasks = localTasks.filter(
                (task) => task.category !== source.droppableId
            );
            const newTasksInColumn = Array.from(tasksInColumn);
            const [movedTask] = newTasksInColumn.splice(source.index, 1);
            newTasksInColumn.splice(destination.index, 0, movedTask);
            setLocalTasks([...otherTasks, ...newTasksInColumn]);
        } else {
            const sourceTasks = localTasks.filter(
                (task) => task.category === source.droppableId
            );
            const destinationTasks = localTasks.filter(
                (task) => task.category === destination.droppableId
            );
            const otherTasks = localTasks.filter(
                (task) =>
                    task.category !== source.droppableId &&
                    task.category !== destination.droppableId
            );

            const [movedTask] = sourceTasks.splice(source.index, 1);
            movedTask.category = destination.droppableId;
            destinationTasks.splice(destination.index, 0, movedTask);

            setLocalTasks([...otherTasks, ...sourceTasks, ...destinationTasks]);

            try {
                await axios.put(`http://localhost:5000/tasks/${draggableId}`, {
                    category: destination.droppableId,
                });
                refetch();
            } catch (error) {
                console.error("Error updating task category:", error);
            }
        }
    };

    const categories = [
        { name: "To-Do", bgClass: "bg-gray-200 dark:bg-gray-950 dark:text-gray-200" },
        { name: "In Progress", bgClass: "bg-blue-200 dark:bg-gray-950 dark:text-gray-200" },
        { name: "Done", bgClass: "bg-green-200 dark:bg-gray-950 dark:text-gray-200" },
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="p-6 bg-gray-100 min-h-screen  dark:bg-gray-800">
                {/* Heading */}
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
                    📝 Task Management Board
                </h1>

                {/* Task Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {categories.map((column) => (
                        <Droppable key={column.name} droppableId={column.name}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`p-4 rounded-lg shadow-lg ${column.bgClass}`}
                                >
                                    {/* Column Title */}
                                    <h2 className="text-lg font-semibold text-center mb-4">
                                        {column.name}
                                    </h2>

                                    {/* Task List */}
                                    {localTasks
                                        .filter((task) => task.category === column.name)
                                        .map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="bg-white dark:bg-gray-800 dark:text-gray-200 p-4 my-3 rounded-lg shadow-md transition duration-300 hover:shadow-xl"
                                                    >
                                                        {/* Task Title */}
                                                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</h3>
                                                        {/* Task Description */}
                                                        <p className="text-gray-600 text-sm dark:text-gray-200">{task.description}</p>

                                                        {/* Action Buttons */}
                                                        <div className="flex justify-end space-x-2 mt-3">
                                                            <button
                                                                className="bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-1 hover:bg-blue-600"
                                                                onClick={() => handleUpdate(task._id)}
                                                            >
                                                                <FaEdit /> <span>Edit</span>
                                                            </button>
                                                            <button
                                                                className="bg-red-500 text-white px-3 py-1 rounded flex items-center space-x-1 hover:bg-red-600"
                                                                onClick={() => handleDelete(task._id)}
                                                            >
                                                                <FaTrash /> <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </div>
        </DragDropContext>
    );
};

export default Tasks;
