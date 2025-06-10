import React from 'react';
import { MessageCircle, Book, Mail, Phone } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
      </div>

      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="flex items-center mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">Live Chat Support</h2>
              </div>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">Knowledge Base</h2>
              </div>
              <p className="text-gray-600 mb-4">Browse our help articles and tutorials</p>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                View Articles
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Email Support</h3>
                  <p className="text-sm text-gray-500">support@homesoldier.com</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <Phone className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-gray-800">Phone Support</h3>
                  <p className="text-sm text-gray-500">Mon-Fri, 9am-5pm EST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                {
                  question: "How do I add a new family member?",
                  answer: "Navigate to the Family page and click the 'Add Family Member' button."
                },
                {
                  question: "How are points calculated?",
                  answer: "Points are earned by completing chores. Each chore has a specific point value."
                },
                {
                  question: "Can I customize rewards?",
                  answer: "Yes, you can create and customize rewards in the Rewards section."
                }
              ].map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bolt.new Badge */}
      <a
        href="https://bolt.new"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
      >
        <span>Built with</span>
        <span className="font-semibold">Bolt.new</span>
      </a>
    </div>
  );
};

export default Support;