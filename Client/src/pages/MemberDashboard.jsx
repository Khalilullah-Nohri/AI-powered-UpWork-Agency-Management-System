// src/pages/MemberDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Footer from "../partials/Footer";

function MemberDashboard() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedJob, setSelectedJob] = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      // Ensure it's always an array
      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        setTasks([]); // e.g., when backend returns { message: "No tasks found" }
      }
    } catch (err) {
      alert("Failed to load tasks.");
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      alert("Status updated!");
      fetchTasks();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Member Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
        <div className="flex items-center mb-4">
          <label className="mr-2 font-semibold">Filter by Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {tasks.length === 0 ? (
          <p>No tasks assigned.</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full table-auto text-center">
              <thead className="text-white bg-green-600">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Task Title</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Priority</th>
                  <th className="p-2">Deadline</th>
                  <th className="p-2">Job Title</th>
                  <th className="p-2">Job Description</th>
                  <th className="p-2">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks
                  .filter(
                    (task) =>
                      filterStatus === "All" || task.status === filterStatus
                  )
                  .map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="p-2">{task.id}</td>
                      <td className="p-2 font-medium">{task.title}</td>
                      <td className="p-2">{task.status}</td>
                      <td className="p-2">{task.priority}</td>
                      <td className="p-2">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleString()
                          : "—"}
                      </td>
                      {/* <td className="p-2">{task.job_title || "N/A"}</td> */}
                      <td className="px-4 py-2 max-w-xs">
                        <button
                          title="Click to see complete details"
                          className="block w-full overflow-hidden truncate whitespace-nowrap text-blue-600 underline hover:text-blue-800 cursor-pointer text-left"
                          onClick={() =>
                            setSelectedJob({
                              title: task.job_title,
                              description: task.job_description,
                            })
                          }
                        >
                          {task.job_title || "N/A"}
                        </button>
                      </td>

                      <td className="px-4 py-2 max-w-sm">
                        <button
                          title="Click to see complete details"
                          className="block w-full overflow-hidden truncate whitespace-nowrap text-gray-700 underline hover:text-gray-900 cursor-pointer text-left"
                          onClick={() =>
                            setSelectedJob({
                              title: task.job_title,
                              description: task.job_description,
                            })
                          }
                        >
                          {task.job_description || "No description"}
                        </button>
                      </td>

                      {/* <td className="p-2 max-w-xs truncate">
                        {task.job_description || "—"}
                      </td> */}
                      <td className="p-2">
                        <select
                          value={task.status}
                          onChange={(e) =>
                            handleStatusChange(task.id, e.target.value)
                          }
                          className="px-2 py-1 border rounded"
                        >
                          <option value="To Do">To Do</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Review">Review</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {selectedJob && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full relative">
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setSelectedJob(null)}
                  >
                    ✕
                  </button>
                  <h2 className="text-xl font-bold mb-4">
                    {selectedJob.title}
                  </h2>
                  <p className="mb-4 text-gray-700 whitespace-pre-line">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MemberDashboard;
