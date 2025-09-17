import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

export default function VotePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);
  const [loadingPoll, setLoadingPoll] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoadingPoll(true);
      const res = await api.get(`/poll/${id}`);
      setPoll(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load poll");
    } finally {
      setLoadingPoll(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;
    try {
      setSubmitting(true);
      await api.post(`/poll/${id}/vote`, { optionId: selectedOption });
      setSelectedOption(null);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    socket.emit("join_poll", Number(id));

    socket.on("poll_update", (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.emit("leave_poll", Number(id));
      socket.off("poll_update");
    };
  }, [id]);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  if (loadingPoll) return <p className="p-6">Loading poll...</p>;

  if (error && !poll) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!poll) return null;

  const totalVotes = poll.options.reduce((acc, o) => acc + o.votes.length, 0);

  const alreadyVoted = poll.options.some((opt) =>
    opt.votes.some((vote) => vote.userId === user?.id)
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{poll.question}</h1>

        {error && (
          <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {poll.options.map((opt) => {
            const votes = opt.votes.length;
            const percent = totalVotes
              ? Math.round((votes / totalVotes) * 100)
              : 0;

            return (
              <div
                key={opt.id}
                className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
              >
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="pollOption"
                    value={opt.id}
                    checked={selectedOption === opt.id}
                    onChange={() => setSelectedOption(opt.id)}
                    className="h-4 w-4 text-indigo-600"
                    disabled={alreadyVoted}
                  />
                  <span className="flex-1">{opt.text}</span>
                  <span className="text-sm text-gray-500">{votes} votes</span>
                </label>

                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{percent}%</p>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleVote}
          disabled={!selectedOption || submitting || alreadyVoted}
          className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {alreadyVoted
            ? "You already voted"
            : submitting
            ? "Submitting..."
            : "Submit Vote"}
        </button>

        <p className="text-sm text-gray-500 mt-4">Total votes: {totalVotes}</p>
      </div>
    </div>
  );
}
