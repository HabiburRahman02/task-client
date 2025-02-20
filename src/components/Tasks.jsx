import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
    const navigate = useNavigate();

    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get("https://task-server-eight-murex.vercel.app/tasks");
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

                axios.delete(`https://task-server-eight-murex.vercel.app/deleteTaskById/${taskId}`)
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
                await axios.put(`https://task-server-eight-murex.vercel.app/tasks/${draggableId}`, {
                    category: destination.droppableId,
                });
                refetch();
            } catch (error) {
                console.error("Error updating task category:", error);
            }
        }
    };

    const categories = [
        { name: "To-Do", bgClass: "bg-gray-200" },
        { name: "In Progress", bgClass: "bg-blue-200" },
        { name: "Done", bgClass: "bg-green-200" },
    ];

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {categories.map((column) => (
                    <Droppable key={column.name} droppableId={column.name}>
                        {(provided) => (
                            <div
                                className={`${column.bgClass} p-4`}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                            >
                                <h2 className="text-lg font-bold">{column.name}</h2>
                                {localTasks
                                    .filter((task) => task.category === column.name)
                                    .map((task, index) => (
                                        <Draggable
                                            key={task._id}
                                            draggableId={task._id}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-white p-2 my-2 shadow rounded"
                                                >
                                                    <h3 className="font-semibold">{task.title}</h3>
                                                    <p>{task.description}</p>
                                                    <div className="flex space-x-2">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleUpdate(task._id)}
                                                        >
                                                            Update
                                                        </button>
                                                        <button
                                                            className="btn btn-error btn-sm"
                                                            onClick={() => handleDelete(task._id)}
                                                        >
                                                            Delete
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
        </DragDropContext>
    );
};

export default Tasks;
