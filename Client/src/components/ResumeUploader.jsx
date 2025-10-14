// src/components/ResumeUploader.jsx
import React, { useState } from 'react';
import api from '../services/api';

function ResumeUploader({ jobId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!file) return setMessage('Please select a PDF file');
    if (file.type !== 'application/pdf') return setMessage('Only PDF files are allowed');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post(`/jobs/${jobId}/upload_resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage('Uploaded successfully!');
      onUploaded && onUploaded(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Upload failed');
    }
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
      >
        Upload Resume
      </button>
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  );
}

export default ResumeUploader;
