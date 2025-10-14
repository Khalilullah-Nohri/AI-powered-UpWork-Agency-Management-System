// pages/SignIn.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../partials/Header';
import api from '../services/api';
import { getRole, isAuthenticated } from '../utils/auth';
import { useEffect } from 'react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate(`/${getRole().toLowerCase()}`);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      navigate(`/${user.role.toLowerCase()}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl px-4 mx-auto sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              <div className="max-w-3xl pb-12 mx-auto text-center md:pb-20">
                <h1 className="h1">Welcome back.</h1>
              </div>

              <div className="max-w-sm mx-auto">
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium" htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="w-full form-input"
                      placeholder="Email"
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
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 btn hover:bg-blue-700"
                  >
                    Sign In
                  </button>
                </form>

                <div className="mt-6 text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignIn;
