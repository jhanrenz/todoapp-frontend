import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import TaskList from "./components/TaskList";
import AddNew from "./components/AddNew";
import { Toaster } from "sonner"; // ✅ Import Toaster

function App() {
  return (
    <BrowserRouter>
      {/* Toaster placed globally for all routes */}
      <Toaster richColors position="top-center" />

      <div>
        <Navbar />
        <main className="pt-16 px-4">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/add-new" element={<AddNew />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
