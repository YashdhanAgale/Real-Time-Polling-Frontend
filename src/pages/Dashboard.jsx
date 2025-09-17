import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import PollForm from "../components/PollForm";
import PollCard from "../components/PollCard";
import usePolls from "../hooks/usePolls";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const { polls, loading, error } = usePolls(activeTab);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Welcome, {user?.firstName} 👋</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Create Poll */}
      <PollForm onPollCreated={() => setActiveTab("me")} />

      {/* Poll Tabs */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Polls
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "me"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setActiveTab("me")}
          >
            My Polls
          </button>
        </div>

        {/* Poll List */}
        {loading ? (
          <p className="text-gray-500">Loading polls...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : polls.length === 0 ? (
          <p className="text-gray-500">No polls found.</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
