import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDispatch } from "react-redux";
import { leetCode } from "../store/Slices/AuthSlice";

const LeetCodeStats = () => {
  const [username, setUsername] = useState("");
  const [showStats, setShowStats] = useState(false);
  const dispatch = useDispatch()
  const [leetCodeData,setLeetcodeData] = useState({})
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim()) {
      try {
        const response = await dispatch(leetCode(username))
        setLeetcodeData(response.payload)
        console.log("THis is payload",response.payload);
        setShowStats(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleReset = () => {
    setUsername("");
    setShowStats(false);
  };

  const COLORS = {
    easy: '#00b8a3',     // Green
    medium: '#ffc01e',   // Yellow
    hard: '#ef4743',     // Red
  };

  const getPieData = () => {
    if (!leetCodeData) return [];
    return [
      { name: 'Easy', value: leetCodeData.easySolved, total: leetCodeData.totalEasy },
      { name: 'Medium', value: leetCodeData.mediumSolved, total: leetCodeData.totalMedium },
      { name: 'Hard', value: leetCodeData.hardSolved, total: leetCodeData.totalHard }
    ];
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">LeetCode Profile Stats</h1>
        
        {!showStats ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 w-full border rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Enter LeetCode Username"
              
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-colors duration-200"
              
            >
              Get Stats
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Stats for {username}</h2>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Remove Profile
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Problems Solved</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        animationBegin={0}
                        animationDuration={1500}
                      >
                        {getPieData().map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            fill={Object.values(COLORS)[index]}
                            className="transition-all duration-300 hover:opacity-80"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ payload }) => {
                          if (payload && payload[0]) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-white p-2 shadow-lg rounded-md">
                                <p className="font-semibold">{data.name}</p>
                                <p>Solved: {data.value}/{data.total}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                  {Object.entries(COLORS).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="capitalize">{key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Total Solved</p>
                      <p className="text-xl font-semibold">
                        {leetCodeData.totalSolved}/{leetCodeData.totalQuestions}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Ranking</p>
                      <p className="text-xl font-semibold">{leetCodeData.ranking}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contribution Points</p>
                      <p className="text-xl font-semibold">{leetCodeData.contributionPoint}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Reputation</p>
                      <p className="text-xl font-semibold">{leetCodeData.reputation}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {[
                    { label: 'Easy', solved: leetCodeData.easySolved, total: leetCodeData.totalEasy, color: COLORS.easy },
                    { label: 'Medium', solved: leetCodeData.mediumSolved, total: leetCodeData.totalMedium, color: COLORS.medium },
                    { label: 'Hard', solved: leetCodeData.hardSolved, total: leetCodeData.totalHard, color: COLORS.hard }
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{item.label}</span>
                        <span>{item.solved}/{item.total}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${(item.solved / item.total) * 100}%`,
                            backgroundColor: item.color
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeetCodeStats;