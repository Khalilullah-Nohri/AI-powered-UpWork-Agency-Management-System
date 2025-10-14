import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top area */}
        <div className="grid sm:grid-cols-12 gap-8 py-8 md:py-12">
          {/* Logo & tagline */}
          <div className="sm:col-span-12 lg:col-span-3">
            <Link to="/" className="inline-block" aria-label="Project Home">
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient
                    cx="21.152%"
                    cy="86.063%"
                    fx="21.152%"
                    fy="86.063%"
                    r="79.941%"
                    id="footer-logo"
                  >
                    <stop stopColor="#4FD1C5" offset="0%" />
                    <stop stopColor="#81E6D9" offset="25.871%" />
                    <stop stopColor="#338CF5" offset="100%" />
                  </radialGradient>
                </defs>
                <rect
                  width="32"
                  height="32"
                  rx="16"
                  fill="url(#footer-logo)"
                  fillRule="nonzero"
                />
              </svg>
            </Link>
            <p className="mt-3 text-sm text-gray-600">
              AI-powered Job Scraping & Task Management System.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Built by <span className="font-semibold">Khalilullah Nohri</span> — Python & JS
              developer. GitHub & LinkedIn profiles included below.
            </p>
          </div>

          {/* Features */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Features</h6>
            <ul className="text-sm space-y-2">
              <li><span className="text-gray-600">Job Scraping</span></li>
              <li><span className="text-gray-600">Proposal Generation</span></li>
              <li><span className="text-gray-600">Email Sending</span></li>
              <li><span className="text-gray-600">Task Assignment</span></li>
              <li><span className="text-gray-600">Role-based Dashboards</span></li>
            </ul>
          </div>

          {/* Connect with Me */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Connect with Me</h6>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  href="https://github.com/Khalilullah-Nohri"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/khalilullah-dev"
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:khalilullahnohri@gmail.com"
                  className="text-gray-600 hover:text-gray-900 transition"
                >
                  Email Me
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
            <ul className="text-sm space-y-2">
              <li>
                <Link to="/docs" className="text-gray-600 hover:text-gray-900 transition">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-gray-600 hover:text-gray-900 transition">
                  Guides
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-gray-600 hover:text-gray-900 transition">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Stay Updated */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-gray-800 font-medium mb-2">Stay Updated</h6>
            <p className="text-sm text-gray-600 mb-4">
              Get product updates, new features, and improvements.
            </p>
            <form>
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <label className="block text-sm sr-only" htmlFor="newsletter">
                    Email
                  </label>
                  <div className="relative flex items-center max-w-xs">
                    <input
                      id="newsletter"
                      type="email"
                      className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm border rounded"
                      placeholder="Your email"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute inset-0 left-auto"
                      aria-label="Subscribe"
                    >
                      <svg
                        className="w-3 h-3 fill-current text-blue-600 mx-3 flex-shrink-0"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Copyright */}
          <div className="text-sm text-gray-600 mr-4">
            © {new Date().getFullYear()} Job Scraper & Task Manager. All rights reserved.
          </div>
          {/* Social links */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0 space-x-4">
            <li>
              <a
                href="https://github.com/Khalilullah-Nohri"
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/khalilullah-dev"
                target="_blank"
                rel="noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>l
    </footer>
  );
}

export default Footer;
