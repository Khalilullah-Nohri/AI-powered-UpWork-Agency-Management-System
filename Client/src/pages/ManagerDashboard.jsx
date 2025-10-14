import React, { useEffect, useState } from "react";
import api from "../services/api";
import Footer from "../partials/Footer";

function ManagerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState({});

  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    job_id: "",
    priority: "Medium",
    deadline: "",
    assigned_to: "",
  });

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      alert("Failed to load tasks.");
    }
  };

  // const fetchJobs = async () => {
  //   try {
  //     const res = await api.get("/jobs");
  //     setJobs(res.data.jobs || []); // always safe
  //   } catch (err) {
  //     console.error("Failed to fetch jobs", err);
  //   }
  // };

  const fetchJobs = async () => {
    try {
      // fetch all jobs for dropdown (large limit)
      const res = await api.get("/jobs?page=1&limit=1000");
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await api.get("/users?role=Member");
      setMembers(res.data);
    } catch (err) {
      alert("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchJobs();
    fetchMembers();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateTask = async () => {
    if (!form.title || !form.job_id) {
      alert("Title and Job ID are required.");
      return;
    }

    try {
      const res = await api.post("/tasks", form);
      alert("Task created!");
      setForm({
        title: "",
        description: "",
        job_id: "",
        priority: "Medium",
        deadline: "",
        assigned_to: "",
      });
      fetchTasks();
    } catch (err) {
      alert("Failed to create task");
    }
  };

  // const handleAssign = async (taskId) => {
  //   if (!form.assigned_to) {
  //     alert("Please select a member to assign");
  //     return;
  //   }

  //   try {
  //     await api.put(`/tasks/${taskId}/assign`, {
  //       assigned_to: form.assigned_to,
  //     });
  //     alert("Task assigned!");
  //     fetchTasks();
  //   } catch (err) {
  //     alert("Assignment failed");
  //   }
  // };
  const handleAssign = async (taskId) => {
    const memberId = selectedMembers[taskId];
    if (!memberId) {
      alert("Please select a member first.");
      return;
    }

    try {
      await api.put(`/tasks/${taskId}/assign`, { assigned_to: memberId });
      alert("Task assigned successfully!");
      fetchTasks();
    } catch (err) {
      alert("Failed to assign task.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex items-center justify-between mb-4">
        <h1 className="flex-1 text-2xl font-bold text-center">
          Manager Dashboard
        </h1>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/signin";
          }}
          className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      <div className="p-4 mb-6 bg-white rounded shadow">
        <h2 className="mb-3 text-lg font-semibold">Create New Task</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          {/* <select
            name="job_id"
            value={form.job_id}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select> */}
          <select
            name="job_id"
            value={form.job_id}
            onChange={handleInputChange}
            className="p-2 border rounded max-h-40 overflow-y-auto"
          >
            <option value="">Select Job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <input
            type="datetime-local"
            name="deadline"
            value={form.deadline}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleInputChange}
            className="p-2 border rounded col-span-full"
          />
          <button
            className="px-4 py-2 text-white bg-blue-600 rounded col-span-full"
            onClick={handleCreateTask}
          >
            Create Task
          </button>
        </div>
      </div>

      {/* <div className="overflow-x-auto bg-white rounded shadow"> */}
      <div className="overflow-x-auto overflow-y-auto max-h-96 bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="text-white bg-gray-800">
            <tr className="">
              <th className="p-2 sticky top-0 bg-gray-800 z-10">ID</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Title</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Status</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Priority</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Job</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Assigned</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Deadline</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Assign To</th>
              <th className="p-2 sticky top-0 bg-gray-800 z-10">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="p-2 text-center">{task.id}</td>
                <td className="p-2 text-center">{task.title}</td>
                <td className="p-2 text-center">{task.status}</td>
                <td className="p-2 text-center">{task.priority}</td>
                <td className="p-2 text-center">{task.job_id}</td>
                {/* <td className="p-2">{task.assigned_to || "Unassigned"}</td> */}
                <td className="p-2 text-center">
                  {task.assigned_to
                    ? members.find((m) => m.id === task.assigned_to)?.name ||
                      "Unknown"
                    : "Unassigned"}
                </td>

                <td className="p-2 text-center">
                  {task.deadline?.split("T")[0]}
                </td>
                <td className="p-2 text-center">
                  {/* <select
                    onChange={(e) =>
                      setForm({ ...form, assigned_to: e.target.value })
                    }
                    className="px-2 py-1 border rounded"
                  > */}
                  <select
                    value={selectedMembers[task.id] || ""}
                    onChange={(e) =>
                      setSelectedMembers((prev) => ({
                        ...prev,
                        [task.id]: e.target.value,
                      }))
                    }
                    className="px-5 py-1 border rounded"
                  >
                    <option value="">Select Member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 text-center">
                  <button
                    className="px-2 py-1 text-sm text-white bg-green-600 rounded"
                    onClick={() => handleAssign(task.id)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
}

export default ManagerDashboard;
