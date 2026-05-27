import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

import { useTheme } from '../context/ThemeContext';

import { motion } from 'framer-motion';

import {
  ShieldCheck,
  MessageSquare,
  Users,
  Cpu,
  Briefcase,
  Trophy,
  Code2,
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';


// =============================================================================
// MOCK ANALYTICS CHART DATA
// =============================================================================

const atsHistoryData = [
  { month: 'Jan', score: 45 },
  { month: 'Feb', score: 58 },
  { month: 'Mar', score: 62 },
  { month: 'Apr', score: 78 },
  { month: 'May', score: 88 },
];

const mockInterviewScores = [
  { attempt: 'Mock 1', score: 60 },
  { attempt: 'Mock 2', score: 72 },
  { attempt: 'Mock 3', score: 68 },
  { attempt: 'Mock 4', score: 85 },
  { attempt: 'Mock 5', score: 92 },
];

const skillMetricsData = [
  { subject: 'Python', A: 85, fullMark: 100 },
  { subject: 'React.js', A: 75, fullMark: 100 },
  { subject: 'PostgreSQL', A: 60, fullMark: 100 },
  { subject: 'Algorithms', A: 90, fullMark: 100 },
  { subject: 'System Design', A: 40, fullMark: 100 },
];


// =============================================================================
// ANIMATION CONFIG
// =============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
};


// =============================================================================
// DASHBOARD COMPONENT
// =============================================================================

const Dashboard = () => {

  const { darkMode } = useTheme();

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchAnalytics = async () => {

      const token = localStorage.getItem('access_token');

      try {

        const response = await axios.get(
          'http://localhost:8000/api/interview/analytics/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setData(response.data);

      } catch (err) {

        console.error('Dashboard fetch failed', err);

      } finally {

        setLoading(false);
      }
    };

    fetchAnalytics();

  }, []);


  // =============================================================================
  // THEME COLORS
  // =============================================================================

  const gridColor = darkMode ? '#27272a' : '#e4e4e7';

  const labelColor = darkMode ? '#a1a1aa' : '#71717a';

  const tooltipBg = darkMode ? '#09090b' : '#ffffff';

  const tooltipBorder = darkMode ? '#27272a' : '#e4e4e7';


  // =============================================================================
  // LOADING SCREEN
  // =============================================================================

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-900 font-mono text-xs text-gray-400">
        LOADING_HIREAI_DASHBOARD_METRICS...
      </div>
    );
  }


  // =============================================================================
  // MAIN RENDER
  // =============================================================================

  return (

    <PageTransition>

      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 transition-colors duration-200 text-black dark:text-white">

        <Navbar />

        <motion.div
          className="max-w-7xl mx-auto p-6 md:p-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          {/* HEADER */}

          <header className="mb-10 border-b border-gray-200 dark:border-zinc-800 pb-5">

            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              HireAI Analytics Dashboard
            </h1>

            <p className="text-gray-500 dark:text-zinc-400 mt-2">
              Hello, {data?.username}. Monitor interview readiness,
              AI performance metrics, ATS progression, and platform activity.
            </p>

          </header>


          {/* ADMIN METRICS */}

          {data?.admin_stats && (

            <motion.div
              variants={itemVariants}
              className="mb-10 p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/40"
            >

              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-5 flex items-center gap-2">

                <ShieldCheck className="w-5 h-5" />

                Admin Executive Metrics

              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border dark:border-zinc-800 flex items-center gap-4">

                  <Users className="w-8 h-8 text-blue-500" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Total Users
                    </p>

                    <h4 className="text-3xl font-black">
                      {data.admin_stats.total_users}
                    </h4>
                  </div>

                </div>

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border dark:border-zinc-800 flex items-center gap-4">

                  <Cpu className="w-8 h-8 text-purple-500" />

                  <div>
                    <p className="text-xs text-gray-400">
                      Voice Evaluations
                    </p>

                    <h4 className="text-3xl font-black">
                      {data.admin_stats.total_voice_audits}
                    </h4>
                  </div>

                </div>

                <div className="bg-white dark:bg-zinc-950 p-5 rounded-xl border dark:border-zinc-800 flex items-center gap-4">

                  <MessageSquare className="w-8 h-8 text-emerald-500" />

                  <div>
                    <p className="text-xs text-gray-400">
                      AI Chat Sessions
                    </p>

                    <h4 className="text-3xl font-black">
                      {data.admin_stats.total_bot_interactions}
                    </h4>
                  </div>

                </div>

              </div>

            </motion.div>

          )}


          {/* RECRUITER CARD */}

          {data?.role === 'recruiter' && (

            <motion.div
              variants={itemVariants}
              className="mb-10 bg-white dark:bg-zinc-950 p-5 rounded-xl border dark:border-zinc-800 flex items-center gap-4"
            >

              <Briefcase className="w-6 h-6 text-purple-500" />

              <div>

                <p className="text-xs uppercase text-gray-400 font-bold">
                  Recruiter Account
                </p>

                <h4 className="text-lg font-bold">
                  {data.company_name}
                </h4>

              </div>

            </motion.div>

          )}


          {/* KPI CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    ATS Resume Score
                  </p>

                  <h3 className="text-4xl font-black mt-2">
                    88%
                  </h3>

                </div>

                <Trophy className="w-10 h-10 text-yellow-500" />

              </div>

            </motion.div>


            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Avg Interview Score
                  </p>

                  <h3 className="text-4xl font-black mt-2">
                    75%
                  </h3>

                </div>

                <MessageSquare className="w-10 h-10 text-blue-500" />

              </div>

            </motion.div>


            <motion.div
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500 dark:text-zinc-400">
                    Coding Challenges
                  </p>

                  <h3 className="text-4xl font-black mt-2">
                    34 / 50
                  </h3>

                </div>

                <Code2 className="w-10 h-10 text-emerald-500" />

              </div>

            </motion.div>

          </div>


          {/* CHARTS */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


            {/* ATS CHART */}

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl border dark:border-zinc-800"
            >

              <h3 className="text-lg font-bold mb-6">
                ATS Resume Progress
              </h3>

              <div className="w-full h-[320px]">

                <ResponsiveContainer width="100%" height="100%">

                  <AreaChart data={atsHistoryData}>

                    <defs>

                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">

                        <stop
                          offset="5%"
                          stopColor="#2563eb"
                          stopOpacity={0.4}
                        />

                        <stop
                          offset="95%"
                          stopColor="#2563eb"
                          stopOpacity={0}
                        />

                      </linearGradient>

                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                    />

                    <XAxis
                      dataKey="month"
                      stroke={labelColor}
                    />

                    <YAxis
                      stroke={labelColor}
                      domain={[0, 100]}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#2563eb"
                      fill="url(#colorScore)"
                    />

                  </AreaChart>

                </ResponsiveContainer>

              </div>

            </motion.div>


            {/* MOCK INTERVIEW CHART */}

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl border dark:border-zinc-800"
            >

              <h3 className="text-lg font-bold mb-6">
                Mock Interview Performance
              </h3>

              <div className="w-full h-[320px]">

                <ResponsiveContainer width="100%" height="100%">

                  <BarChart data={mockInterviewScores}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={gridColor}
                    />

                    <XAxis
                      dataKey="attempt"
                      stroke={labelColor}
                    />

                    <YAxis
                      stroke={labelColor}
                      domain={[0, 100]}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder
                      }}
                    />

                    <Bar
                      dataKey="score"
                      fill={darkMode ? '#ffffff' : '#000000'}
                      radius={[4, 4, 0, 0]}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            </motion.div>


            {/* RADAR CHART */}

            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-zinc-950 p-6 rounded-xl border dark:border-zinc-800 lg:col-span-2"
            >

              <h3 className="text-lg font-bold mb-6">
                Technical Skill Matrix
              </h3>

              <div className="w-full h-[350px]">

                <ResponsiveContainer width="100%" height="100%">

                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                    data={skillMetricsData}
                  >

                    <PolarGrid stroke={gridColor} />

                    <PolarAngleAxis
                      dataKey="subject"
                      stroke={labelColor}
                    />

                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      stroke={labelColor}
                    />

                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#2563eb"
                      fill="#2563eb"
                      fillOpacity={0.2}
                    />

                    <Legend />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: tooltipBg,
                        borderColor: tooltipBorder
                      }}
                    />

                  </RadarChart>

                </ResponsiveContainer>

              </div>

            </motion.div>

          </div>


          {/* CHAT HISTORY */}

          <motion.div
            variants={itemVariants}
            className="mt-10 bg-white dark:bg-zinc-950 p-6 rounded-xl border dark:border-zinc-800"
          >

            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">

              <MessageSquare className="w-5 h-5 text-gray-400" />

              Saved AI Conversations

            </h3>

            {data?.chat_history?.length > 0 ? (

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">

                {data.chat_history.map((chat, idx) => (

                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border dark:border-zinc-800"
                  >

                    <p className="text-xs text-gray-400 mb-2">
                      [{chat.time}]
                    </p>

                    <p className="font-semibold mb-2">
                      USER:
                    </p>

                    <p className="mb-4">
                      {chat.prompt}
                    </p>

                    <p className="font-semibold text-blue-500 mb-2">
                      HIREAI:
                    </p>

                    <p>
                      {chat.reply}
                    </p>

                  </div>

                ))}

              </div>

            ) : (

              <p className="text-sm text-gray-400 italic">
                No chat history available yet.
              </p>

            )}

          </motion.div>

        </motion.div>

      </div>

    </PageTransition>

  );
};

export default Dashboard;
