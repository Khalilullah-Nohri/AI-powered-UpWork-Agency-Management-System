import React, { useState } from "react";
import HeroImage from "../images/hero-image.png";

function HeroHome() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="relative bg-gray-50">
      {/* Background illustration */}
      <div
        className="absolute bottom-0 transform -translate-x-1/2 pointer-events-none left-1/2"
        aria-hidden="true"
      >
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl px-4 mx-auto sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          <div className="pb-12 text-center md:pb-16">
            <h1
              className="mb-4 text-5xl font-extrabold tracking-tighter md:text-6xl leading-tighter"
              data-aos="zoom-y-out"
            >
              Automate Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
                Freelancing Workflow
              </span>
            </h1>
            <div className="max-w-3xl mx-auto">
              <p
                className="mb-8 text-xl text-gray-600"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                An AI-powered platform to scrape jobs, generate proposals,
                assign tasks, and streamline your Upwork success — all in one
                dashboard.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <a
                    className="w-full mb-4 text-white bg-blue-600 btn hover:bg-blue-700 sm:w-auto sm:mb-0"
                    href="/signin"
                  >
                    Get Started
                  </a>
                </div>
                <div>
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full text-white bg-gray-900 btn hover:bg-gray-800 sm:w-auto sm:ml-4"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div
            className="relative flex justify-center mb-8"
            data-aos="zoom-y-out"
            data-aos-delay="450"
          >
            <div className="flex flex-col justify-center">
              <img
                className="mx-auto"
                src={HeroImage}
                width="768"
                height="432"
                alt="Dashboard Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-lg">
            {/* Close button */}
            <button
              className="absolute text-gray-500 top-3 right-3 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="mb-4 text-2xl font-bold">
              About This Project
            </h2>

            <p className="mb-3 text-gray-700">
              This system automates freelancing workflows with integrated job scraping,
              proposal generation, email sending, and task assignment features.
            </p>

            <h3 className="mt-4 mb-2 text-lg font-semibold">Tech Stack</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>Frontend: React, Tailwind CSS</li>
              <li>Backend: Flask (Python), REST APIs</li>
              <li>Database: SQLAlchemy with SQLite/MySQL</li>
              <li>Job Scraping: Selenium + undetected-chromedriver</li>
              <li>AI & Matching: Custom Feasibility Engine</li>
            </ul>

            <h3 className="mt-4 mb-2 text-lg font-semibold">Authentication</h3>
            <p className="text-gray-700">
              Role-based authentication (Admin, Manager, Member) using JWT tokens.
              Each role has access to dedicated dashboards and features.
            </p>

            <h3 className="mt-4 mb-2 text-lg font-semibold">Key Features</h3>
            <ul className="space-y-1 text-gray-700 list-disc list-inside">
              <li>🔍 AI-powered job scraping from Upwork</li>
              <li>📝 Automated proposal generation</li>
              <li>📧 Email sending for proposals</li>
              <li>📊 Manager dashboard for task creation & assignment</li>
              <li>✅ Member dashboard for task updates</li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroHome;
