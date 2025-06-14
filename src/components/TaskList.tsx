import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, CheckCircle2, Hourglass } from "lucide-react";
import { FiList, FiTrash2, FiEdit } from "react-icons/fi";
import UpdateTaskList from "./UpdateTaskList";

type Task = {
  _id: string;
  taskname: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  deadline?: string;
  createdAt: string;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [fetchingEditTask, setFetchingEditTask] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + "/");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      setDeletingIds((prev) => [...prev, id]);
      await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      alert("Failed to delete task.");
      console.error(err);
    } finally {
      setDeletingIds((prev) => prev.filter((taskId) => taskId !== id));
    }
  };

  const handleEdit = async (id: string) => {
    setFetchingEditTask(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/view/${id}`);
      setEditingTask(res.data);
    } catch (err) {
      alert("Failed to fetch task for editing.");
      console.error(err);
    } finally {
      setFetchingEditTask(false);
    }
  };

  const onUpdateComplete = () => {
    setEditingTask(null);
    fetchTasks();
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-green-600 w-4 h-4 mr-1" />;
      case "in-progress":
        return <Hourglass className="text-yellow-500 w-4 h-4 mr-1" />;
      default:
        return <Clock className="text-gray-400 w-4 h-4 mr-1" />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="text-center mb-10">
        {/* <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-blue-800 flex items-center justify-center gap-2"
        >
          <FiList className="text-blue-700" />
          Task Manager
        </motion.h1>
        <p className="text-sm text-gray-600">All your tasks in one place</p> */}
      </div>

      {/* Edit Form */}
      {editingTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-2xl mx-auto mb-10"
        >
          <UpdateTaskList
            task={editingTask}
            onCancel={() => setEditingTask(null)}
            onUpdateComplete={onUpdateComplete}
          />
        </motion.div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-700" />
        </div>
      ) : tasks.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500"
        >
          No tasks found.
        </motion.p>
      ) : (
        <>
          {!editingTask && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold text-blue-700 mb-4"
            >
              Task List
            </motion.h2>
          )}
          <motion.div
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {tasks.map((task) => (
              <motion.div
                key={task._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <Card className="shadow-md hover:shadow-xl transition-shadow border border-blue-100 rounded-xl">
                  <CardContent className="p-5 space-y-3">
                    <h2 className="text-xl font-semibold text-blue-900 flex items-center gap-2">
                      {statusIcon(task.status)}
                      {task.taskname}
                    </h2>
                    <p className="text-sm text-gray-700">
                      {task.description || "No description."}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge
                        className={
                          task.status === "completed"
                            ? "bg-green-600"
                            : task.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }
                      >
                        {task.status}
                      </Badge>
                      {task.deadline ? (
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No deadline</span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4 mt-4">
                      <button
                        onClick={() => handleEdit(task._id)}
                        disabled={fetchingEditTask}
                        className="text-blue-600 hover:text-blue-800 transition-transform hover:scale-110 disabled:opacity-50"
                        title="Edit Task"
                      >
                        <FiEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        disabled={deletingIds.includes(task._id)}
                        className="text-red-600 hover:text-red-800 transition-transform hover:scale-110 disabled:opacity-50"
                        title="Delete Task"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default TaskList;
