import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface TaskFormData {
  taskname: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
  deadline?: string;
}

const statusStyles = {
  pending: {
    color: "text-red-700",
    bgColor: "bg-red-200",
    icon: <AlertCircle className="inline-block w-5 h-5 mr-2 align-text-bottom" />,
    label: "Pending",
  },
  "in-progress": {
    color: "text-orange-700",
    bgColor: "bg-orange-200",
    icon: <Loader2 className="inline-block w-5 h-5 mr-2 align-text-bottom animate-spin" />,
    label: "In Progress",
  },
  completed: {
    color: "text-green-700",
    bgColor: "bg-green-200",
    icon: <CheckCircle2 className="inline-block w-5 h-5 mr-2 align-text-bottom" />,
    label: "Completed",
  },
};

const AddNew: React.FC = () => {
  const [formData, setFormData] = useState<TaskFormData>({
    taskname: "",
    description: "",
    status: "pending",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as TaskFormData["status"],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/create`, {
        taskname: formData.taskname,
        description: formData.description,
        status: formData.status,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      });

      toast.success(`Task "${res.data.taskname}" created successfully`);

      setFormData({
        taskname: "",
        description: "",
        status: "pending",
        deadline: "",
      });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto mt-10 p-10 bg-white border border-blue-300 rounded-3xl shadow-md space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-3xl font-bold text-center text-blue-900 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        Create New Task
      </motion.h2>

      {/* Task Name */}
      <div className="space-y-1">
        <Label htmlFor="taskname" className="text-blue-800 font-semibold">
          Task Name *
        </Label>
        <Input
          id="taskname"
          name="taskname"
          required
          value={formData.taskname}
          onChange={handleChange}
          placeholder="Enter task name"
          className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition"
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Label htmlFor="description" className="text-blue-800 font-semibold">
          Description
        </Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-lg border border-blue-300 bg-blue-50 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder="Optional description"
        />
      </div>

      {/* Status - RADIO BUTTONS */}
      <div className="space-y-1">
        <Label className="text-blue-800 font-semibold">Status</Label>
        <div className="flex gap-6">
          {(Object.keys(statusStyles) as (keyof typeof statusStyles)[]).map(
            (key) => {
              const status = statusStyles[key];
              return (
                <label
                  key={key}
                  className={`flex items-center cursor-pointer rounded-lg px-4 py-2 border 
                    ${
                      formData.status === key
                        ? `border-blue-600 bg-blue-100 ${status.color}`
                        : "border-gray-300 bg-white text-gray-700"
                    } transition`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={key}
                    checked={formData.status === key}
                    onChange={handleStatusChange}
                    className="hidden"
                  />
                  <span>{status.icon}</span>
                  <span className="font-semibold">{status.label}</span>
                </label>
              );
            }
          )}
        </div>
      </div>

      {/* Deadline */}
      <div className="space-y-1">
        <Label htmlFor="deadline" className="text-blue-800 font-semibold">
          Deadline
        </Label>
        <Input
          id="deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          className="bg-blue-50 border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg transition"
        />
      </div>

      {/* Submit Button wrapped in motion.div for hover scale */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        style={{ display: "inline-block", width: "100%" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-transform active:scale-95"
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default AddNew;
