import { ListTodo, Plus } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <TooltipProvider>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 w-full z-50 px-8 py-3 flex items-center justify-between
          bg-gray-900 border-b border-gray-700 shadow-sm"
      >
        {/* Left - Logo */}
        <motion.div className="flex items-center space-x-3" whileHover={{ scale: 1.05 }}>
          <Link
            to="/"
            className="text-3xl font-extrabold text-indigo-400 select-none cursor-pointer"
            aria-label="Home"
          >
            ToDo List App
          </Link>
        </motion.div>

        {/* Center - Tagline */}
        <div className="hidden sm:block text-center flex-1">
          <p className="text-gray-300 font-medium italic select-none">
            Organize your tasks, simplify your day.
          </p>
        </div>

        {/* Right - Action Icons */}
        <div className="flex items-center gap-5">
          {/* ToDo's */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/" aria-label="ToDo's">
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group p-2 rounded-md bg-indigo-800 text-indigo-300 hover:bg-indigo-700 transition"
                >
                  <ListTodo className="w-6 h-6" />
                </motion.button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>ToDo's</TooltipContent>
          </Tooltip>

          {/* Add New */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/add-new" aria-label="Add New">
                <motion.button
                  whileHover={{ scale: 1.15, rotate: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group p-2 rounded-md bg-green-800 text-green-300 hover:bg-green-700 transition"
                >
                  <Plus className="w-6 h-6" />
                </motion.button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Add New</TooltipContent>
          </Tooltip>
        </div>
      </motion.nav>
    </TooltipProvider>
  );
}
