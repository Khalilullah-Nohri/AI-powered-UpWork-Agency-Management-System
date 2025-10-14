// AdminDashboard.jsx (Updated: scraping + runtime evaluation + proposal + filters)
import React, { useEffect, useState } from "react";
import api from "../services/api";
import Footer from "../partials/Footer";
import LoadingBar from "react-top-loading-bar";

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [filterFeasible, setFilterFeasible] = useState(null);
  const [sortByScore, setSortByScore] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10; // Jobs per page
  // const [actionLoading, setActionLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingActionId, setLoadingActionId] = useState(null); // tracks job id currently processing
  const [loadingActionType, setLoadingActionType] = useState(""); // evaluate, proposal, email

  const fetchJobs = async () => {
    try {
      //   let url = "/jobs";
      //   const params = [];
      //   if (filterFeasible !== null) params.push(`feasible=${filterFeasible}`);
      //   //   if (sortByScore) params.push(`min_score=${sortByScore}`);
      //   //   if (["asc", "desc"].includes(sortByScore)) {
      //   //     params.push(`sort=${sortByScore}`);
      //   //   } else if (sortByScore) {
      //   //     params.push(`min_score=${sortByScore}`);
      //   //   }
      //   if (sortByScore) {
      //     params.push(`sort=${sortByScore}`);
      //   }

      //   if (params.length > 0) url += `?${params.join("&")}`;

      let url = `/jobs?page=${page}&limit=${limit}`;
      const params = [];
      if (filterFeasible !== null) params.push(`feasible=${filterFeasible}`);
      if (sortByScore) params.push(`min_score=${sortByScore}`);
      if (params.length > 0) url += `&${params.join("&")}`;

      const res = await api.get(url);
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    } catch (err) {
      setMessage("Error fetching jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filterFeasible, sortByScore, page]);

  const handleScrape = async () => {
    if (!window.confirm("Are you sure you want to scrape jobs from Upwork?"))
      return;
    setMessage("Scraping jobs...");
    try {
      const res = await api.post("/jobs/scrape");
      setMessage(res.data.message);
      fetchJobs();
    } catch (err) {
      setMessage("Scraping failed");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await api.post(`/jobs/upload_resume`, formData);
      setResumeText(res.data.content);
      alert("Resume uploaded successfully!");
    } catch (err) {
      console.error("Resume upload failed:", err);
      alert("Resume upload failed.");
    }
  };

  const handleEvaluate = async (jobId) => {
    if (!resumeText) {
      alert("Please upload resume first.");
      return;
    }
    // setLoadingActionId(jobId);
    // setLoadingActionType("evaluate");
    // setProgress(30); // start progress
    setLoadingActionType("evaluate");
    const interval = startLoading();
    try {
      const res = await api.post(`/jobs/${jobId}/evaluate`, {
        resume: resumeText,
      });
      setProgress(80); // complete progress
      alert(
        `Score: ${res.data.match_score}, Feasible: ${res.data.is_feasible}`
      );
      fetchJobs();
    } catch (err) {
      alert("Evaluation failed");
    } finally {
      finishLoading(interval);
      setLoadingActionType("");
    }
  };

  const handleProposal = async (jobId) => {
    if (!resumeText) {
      alert("Please upload a resume first.");
      return;
    }
    if (!window.confirm("Generate proposal for this job?")) return;
    setLoadingActionType("proposal");
    const interval = startLoading();

    // fetchJobs(); // Refresh jobs to ensure latest data is shown
    try {
      const res = await api.post(`/jobs/${jobId}/generate-proposal`, {
        resume: resumeText,
      });
      // setProgress(80);
      alert(res.data.proposal || "Proposal generated");
    } catch (err) {
      alert(err.response?.data?.error || "Proposal generation failed");
    } finally {
      finishLoading(interval);
      setLoadingActionType("");
      // fetchJobs(); // Refresh jobs after proposal generation
    }
  };
  const handleSendEmail = async (jobId) => {
    setLoadingActionType("email");
    const interval = startLoading();

    try {
      await api.post(`/jobs/${jobId}/send-email`);
      // setProgress(80);
      alert("Email sent successfully!");
    } catch (err) {
      alert(
        "Failed to send email. Generate Proposal first or check your email settings."
      );
    } finally {
      finishLoading(interval);
      setLoadingActionType("");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  const startLoading = () => {
    setProgress(10);
    let current = 10;
    const interval = setInterval(() => {
      current += Math.random() * 10;
      if (current < 90) {
        setProgress(current);
      }
    }, 200);
    return interval;
  };

  const finishLoading = (interval) => {
    clearInterval(interval);
    setProgress(100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LoadingBar
        color="#2563eb"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />

      <main className="flex-grow px-6 py-10">
        {/* {actionLoading && (
          <div className="w-full h-1 mb-4 bg-blue-500 animate-pulse"></div>
        )} */}

        <div className="flex flex-col gap-6 mb-6 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="text-sm"
            /> */}
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleResumeUpload(e)}
              className="mb-2"
            />

            <button
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              onClick={handleScrape}
            >
              Scrape from Upwork
            </button>
            <button
              className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="mr-2 font-semibold">Feasibility:</label>
            <select
              onChange={(e) => setFilterFeasible(e.target.value || null)}
              className="py-1 pl-2 border rounded"
            >
              <option value="">All</option>
              <option value="true">Feasible</option>
              <option value="false">Not Feasible</option>
            </select>
          </div>

          <div>
            <label className="mr-2 font-semibold">Sort by Match Score:</label>
            {/* <select
              onChange={(e) => setSortByScore(e.target.value || null)}
              className="px-3 py-1 border rounded"
            >
              <option value="">None</option>
              <option value="asc">Sort: Match Score ↑</option>
              <option value="desc">Sort: Match Score ↓</option>
              <option value="30">Above 30</option>
              <option value="50">Above 50</option>
              <option value="70">Above 70</option>
            </select> */}
            <select
              onChange={(e) => setSortByScore(e.target.value || null)}
              className="pl-2.75 py-1 border rounded"
            >
              <option value="">Latest First</option>
              <option value="asc">Low to Highest ↑ </option>
              <option value="desc">Highest to Low ↓ </option>
            </select>
          </div>
        </div>

        {resumeText && (
          <div className="p-2 mb-4 text-sm text-green-700 bg-green-100 border border-green-200 rounded">
            Resume uploaded and ready for use.
          </div>
        )}

        {message && <p className="mb-4 text-blue-600">{message}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-md">
              {/* <thead className="text-white bg-blue-600">
                <tr>
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Skills</th>
                  <th className="px-4 py-2">Score</th>
                  <th className="px-4 py-2">Feasible</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead> */}
              <thead className="text-white bg-blue-600">
                <tr>
                  <th className="px-4 py-2">ID</th> {/* NEW */}
                  <th className="px-4 py-2">Title</th>
                  <th className="px-4 py-2">Skills</th>
                  <th className="px-4 py-2">Match Score</th>
                  <th className="px-4 py-2">Feasible</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b">
                    <td className="px-4 py-2 text-center">{job.id}</td>{" "}
                    {/* NEW */}
                    <td className="px-4 py-2 font-medium text-center">
                      {job.title}
                    </td>
                    <td className="px-4 py-2 text-center">{job.skills}</td>
                    <td className="px-4 py-2 text-center">
                      {job.match_score || 0}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {job.is_feasible ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-2 space-y-1">
                      <button
                        className="w-full px-2 py-1 text-sm text-white bg-yellow-500 rounded hover:bg-yellow-600 disabled:opacity-50"
                        onClick={() => handleEvaluate(job.id)}
                        disabled={!!loadingActionType}
                      >
                        {loadingActionType === "evaluate"
                          ? "Evaluating..."
                          : "Evaluate"}
                      </button>
                      <button
                        className="w-full px-2 py-1 mt-1 text-sm text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-50"
                        onClick={() => handleProposal(job.id)}
                        disabled={!!loadingActionType}
                      >
                        {loadingActionType === "proposal"
                          ? "Generating..."
                          : "Generate Proposal"}
                        {/* Generate Proposal */}
                      </button>
                      {/* <td className="p-2"> */}

                      <button
                        className="w-full px-2 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:opacity-50"
                        onClick={() => handleSendEmail(job.id)}
                        disabled={!!loadingActionType}
                      >
                        
                        {loadingActionType === "email"
                          ? "Sending..."
                          : "Send Email"}
                      </button>
                      {/* </td> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {total > limit && (
              <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Prev
                </button>

                {[...Array(Math.ceil(total / limit))].map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setPage(idx + 1)}
                    className={`px-3 py-1 rounded ${
                      page === idx + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, Math.ceil(total / limit)))
                  }
                  disabled={page === Math.ceil(total / limit)}
                  className="px-3 py-1 text-white bg-gray-500 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
