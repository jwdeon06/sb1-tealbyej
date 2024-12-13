import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        {/*         <h1 className="text-5xl font-bold text-primary-700 mb-6"> 
         Welcome to Partner in Aging
       </h1> */}
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Caring for an aging adult can be stressful and overwhelming, but you don’t have to do this alone.
 </p>

<p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Designed by aging care experts and physicians, Partner in Aging is your partner through all the events of the aging journey:
        </p>
        <ul className="list-disc text-left text-gray-600 max-w-3xl mx-auto pl-5">
          <li>Managing Health and Care Needs</li>
          <li>Aging Safely at Home</li>
          <li>Legal, Financial, and Housing Decisions</li>
          <li>End-of-Life Planning and Support</li>
          <li>Care for the Caregiver</li>
        </ul>
    
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Guide</h2>
          <p className="text-gray-600 mb-6">
            Get instant answers and personalized guidance from our AI assistant, available 24/7 to help with your caregiving questions.
          </p>
          <Link
            to="/"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Try the AI Guide <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Resource Library</h2>
          <p className="text-gray-600 mb-6">
            Access our comprehensive collection of articles, guides, and expert advice on caregiving topics.
          </p>
          <Link
            to="/library"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Explore Resources <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Care Store</h2>
          <p className="text-gray-600 mb-6">
            Find essential caregiving supplies, equipment, and professional services carefully selected for your needs.
          </p>
          <Link
            to="/store"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Visit Store <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Our Community</h2>
          <p className="text-gray-600 mb-6">
            Connect with other caregivers, share experiences, and get support from people who understand your journey.
          </p>
          <Link
            to="/connect"
            className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
          >
            Connect Now <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;