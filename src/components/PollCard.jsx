import { Link } from "react-router-dom";

export default function PollCard({ poll }) {
  const totalVotes = poll.options.reduce((acc, o) => acc + o.votes.length, 0);
  const createdAt = new Date(poll.createdAt).toLocaleDateString();

  return (
    <li className="p-5 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {poll.question}
      </h3>
      <p className="text-sm text-gray-500 mb-3">
        {totalVotes} vote{totalVotes !== 1 && "s"} • Created on {createdAt}
      </p>
      <Link
        to={`/polls/${poll.id}`}
        className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-100 px-3 py-1 rounded-lg transition"
      >
        View & Vote →
      </Link>
    </li>
  );
}
