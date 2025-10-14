// pages/SignUp.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import api from '../services/api';

function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', { name, email, password, role });
      navigate('/SignIn');
    } 
    catch (err) {
  console.log("Registration error:", err);
  setError(err.response?.data?.error || 'Registration failed');
}

    // catch (err) {
    //   setError(err.response?.data?.error || 'Registration failed');
    // }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl px-4 mx-auto sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              <div className="max-w-3xl pb-12 mx-auto text-center md:pb-20">
                <h1 className="h1">Create your account</h1>
              </div>

              <div className="max-w-sm mx-auto">
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <form onSubmit={handleRegister}>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium" htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="w-full form-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium" htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="w-full form-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium" htmlFor="password">Password</label>
                    <input
                      type="password"
                      className="w-full form-input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium">Role</label>
                    <select
                      className="w-full form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Manager">Manager</option>
                      <option value="Member">Member</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 btn hover:bg-blue-700"
                  >
                    Sign Up
                  </button>
                </form>

                <div className="mt-6 text-center text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:underline">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
