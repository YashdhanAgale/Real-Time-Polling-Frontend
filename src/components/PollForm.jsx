// import { useState } from "react";
// import api from "../services/api";

// export default function PollForm({ onPollCreated }) {
//   const [question, setQuestion] = useState("");
//   const [options, setOptions] = useState([""]);
//   const [error, setError] = useState(null);

//   const handleAddOption = () => {
//     if (options.length >= 5) {
//       setError("You can add a maximum of 5 options.");
//       return;
//     }
//     setOptions([...options, ""]);
//   };

//   const handleOptionChange = (i, val) => {
//     const newOptions = [...options];
//     newOptions[i] = val;
//     setOptions(newOptions);
//   };

//   const handleCreatePoll = async (e) => {
//     e.preventDefault();

//     // Validation
//     const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);
//     if (!question.trim()) {
//       setError("Poll question is required.");
//       return;
//     }
//     if (trimmedOptions.length < 4 || trimmedOptions.length > 5) {
//       setError("Poll must have between 4 and 5 valid options.");
//       return;
//     }

//     try {
//       setError(null);
//       await api.post("/poll/create", { question, options: trimmedOptions });
//       setQuestion("");
//       setOptions([""]);
//       onPollCreated?.(); // notify Dashboard to refresh
//     } catch (err) {
//       setError(err.response?.data?.error || "Failed to create poll.");
//     }
//   };

//   return (
//     <div className="bg-white shadow rounded-lg p-6 mb-6">
//       <h2 className="text-xl font-semibold mb-4">Create a Poll</h2>

//       {error && (
//         <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg">
//           {error}
//         </div>
//       )}

//       <form onSubmit={handleCreatePoll} className="space-y-4">
//         <input
//           type="text"
//           placeholder="Poll Question"
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           className="w-full border px-4 py-2 rounded-lg"
//         />

//         {options.map((opt, i) => (
//           <input
//             key={i}
//             type="text"
//             placeholder={`Option ${i + 1}`}
//             value={opt}
//             onChange={(e) => handleOptionChange(i, e.target.value)}
//             className="w-full border px-4 py-2 rounded-lg mt-2"
//           />
//         ))}

//         <button
//           type="button"
//           onClick={handleAddOption}
//           className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
//         >
//           + Add Option
//         </button>

//         <button
//           type="submit"
//           className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
//         >
//           Create Poll
//         </button>
//       </form>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../services/api";

export default function PollForm({ onPollCreated }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([""]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddOption = () => {
    if (options.length >= 5) {
      setError("You can add a maximum of 5 options.");
      return;
    }
    setOptions([...options, ""]);
  };

  const handleOptionChange = (i, val) => {
    const newOptions = [...options];
    newOptions[i] = val;
    setOptions(newOptions);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();

    // Validation
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);
    if (!question.trim()) {
      setError("Poll question is required.");
      return;
    }
    if (trimmedOptions.length < 4 || trimmedOptions.length > 5) {
      setError("Poll must have between 4 and 5 valid options.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.post("/poll/create", { question, options: trimmedOptions });
      setQuestion("");
      setOptions([""]);
      onPollCreated?.(); // notify Dashboard to refresh
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create poll.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Create a Poll</h2>

      {error && (
        <div className="mb-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleCreatePoll} className="space-y-4">
        <input
          type="text"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full border px-4 py-2 rounded-lg"
        />

        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="w-full border px-4 py-2 rounded-lg mt-2"
          />
        ))}

        <button
          type="button"
          onClick={handleAddOption}
          disabled={options.length >= 5}
          className="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300 disabled:opacity-50"
        >
          + Add Option
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Creating Poll..." : "Create Poll"}
        </button>
      </form>
    </div>
  );
}
