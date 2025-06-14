import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save, XCircle, AlertCircle, CheckCircle2, Loader2 as LoaderIcon } from "lucide-react";

type Task = {
  _id: string;
  taskname: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  deadline?: string;
  createdAt: string;
};

type Props = {
  task: Task;
  onCancel: () => void;
  onUpdateComplete: () => void;
};

const statusOptions = [
  {
    value: "pending" as const,
    label: "Pending",
    icon: <AlertCircle className="inline-block w-5 h-5 mr-2 text-red-600" />,
    colorClass: "text-red-600",
  },
  {
    value: "in-progress" as const,
    label: "In Progress",
    icon: <LoaderIcon className="inline-block w-5 h-5 mr-2 text-orange-600 animate-spin" />,
    colorClass: "text-orange-600",
  },
  {
    value: "completed" as const,
    label: "Completed",
    icon: <CheckCircle2 className="inline-block w-5 h-5 mr-2 text-green-600" />,
    colorClass: "text-green-600",
  },
];

const UpdateTaskList = ({ task, onCancel, onUpdateComplete }: Props) => {
  const [taskname, setTaskname] = useState(task.taskname);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState<Task["status"]>(task.status);
  const [deadline, setDeadline] = useState(task.deadline ? task.deadline.split("T")[0] : "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Confirmation dialog
    const confirmed = window.confirm("Are you sure you want to update this task?");
    if (!confirmed) return;

    setLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/update/${task._id}`, {
        taskname,
        description,
        status,
        deadline: deadline || null,
      });
      toast.success("Task updated successfully!");
      onUpdateComplete();
    } catch (err) {
      toast.error("Failed to update task.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md border border-blue-100"
    >
      <h2 className="text-3xl font-semibold text-blue-700 mb-6 text-center">Update Task</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Task Name */}
        <div className="space-y-2">
          <Label htmlFor="taskname">Task Name</Label>
          <Input
            id="taskname"
            value={taskname}
            onChange={(e) => setTaskname(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Status - Radio Buttons with Icons */}
        <div className="space-y-2">
          <Label>Status</Label>
          <div className="flex gap-6">
            {statusOptions.map(({ value, label, icon, colorClass }) => (
              <label
                key={value}
                className={`flex items-center cursor-pointer select-none ${colorClass}`}
              >
                <input
                  type="radio"
                  name="status"
                  value={value}
                  checked={status === value}
                  onChange={() => setStatus(value)}
                  className="mr-2 accent-blue-600"
                />
                <span className="flex items-center">
                  {icon}
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
            className="flex items-center"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex items-center">
            {loading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Update
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateTaskList;
