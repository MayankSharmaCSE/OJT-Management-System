import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  MessageSquare, 
  LayoutDashboard,
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const progressData = [
  { name: 'Jan', value: 30 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 38 },
  { name: 'Apr', value: 65 },
  { name: 'May', value: 58 },
  { name: 'Jun', value: 85 },
];

const barData = [
  { name: 'P1', value: 30 },
  { name: 'P2', value: 45 },
  { name: 'P3', value: 75 },
  { name: 'P4', value: 55 },
  { name: 'P5', value: 40 },
  { name: 'P6', value: 35 },
];

const COLORS = ['#bc13fe', '#8b5cf6', '#6366f1', '#4f46e5', '#3b82f6'];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#00f2ff',
      padding: 10,
      cornerRadius: 8,
      displayColors: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
    y: {
      display: false,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 4,
      hoverRadius: 6,
      backgroundColor: '#00f2ff',
      borderWidth: 2,
      borderColor: '#fff',
    },
  },
};

const lineChartData = {
  labels: progressData.map(d => d.name),
  datasets: [
    {
      data: progressData.map(d => d.value),
      borderColor: '#00f2ff',
      borderWidth: 3,
      fill: true,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const {ctx, chartArea} = chart;
        if (!chartArea) return null;
        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(0, 242, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(188, 19, 254, 0)');
        return gradient;
      },
    },
  ],
};

const barChartData = {
  labels: barData.map(d => d.name),
  datasets: [
    {
      data: barData.map(d => d.value),
      backgroundColor: COLORS,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
};

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('ADMIN');

  const tabs = ['ADMIN', 'MENTOR', 'STUDENT'];

  return (
    <div className="bg-futuristic font-sans p-4 md:p-10 flex items-center justify-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full glass-morphism rounded-3xl overflow-hidden border border-white/10 relative z-10"
      >
        {/* Header Tabs */}
        <div className="flex border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-6 text-xl font-bold tracking-widest transition-all relative ${
                activeTab === tab 
                  ? 'neon-text-cyan bg-white/5' 
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 border-2 neon-border-cyan rounded-lg m-2 pointer-events-none"
                />
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Content Area */}
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column - Task Assignment & Submission Status */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-morphism p-5 rounded-2xl border border-white/5">
              <h3 className="text-white/80 font-bold mb-4 tracking-wider uppercase text-sm">Task Assignment</h3>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Assign to:</span>
                <button className="bg-blue-500/20 text-blue-400 border border-blue-500/30 px-4 py-1 rounded-full text-xs font-bold hover:bg-blue-500/30 transition-all uppercase tracking-tighter">
                  Assign
                </button>
              </div>
            </div>

            <div className="glass-morphism p-5 rounded-2xl border border-white/5">
              <h3 className="text-white/80 font-bold mb-4 tracking-wider uppercase text-sm">Submission Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40 font-semibold tracking-tighter">SUBMITTED</span>
                    <span className="text-white/80">8/10</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '80%' }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_10px_#00f2ff]"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40 font-semibold tracking-tighter">PENDING</span>
                    <span className="text-white/80">2/10</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '20%' }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-500 shadow-[0_0_10px_#bc13fe]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-5 rounded-2xl border border-white/5">
              <h3 className="text-white/80 font-bold mb-2 tracking-wider uppercase text-sm">Feedback Summary</h3>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-cyan-400" />
                <span className="text-xl font-bold">4.8/5</span>
                <span className="text-white/40 text-xs border-l border-white/10 pl-2">12 Reviews</span>
              </div>
            </div>
          </div>

          {/* Middle Column - Student Submissions & Feedback */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass-morphism p-5 rounded-2xl border border-white/5 h-[280px] flex flex-col">
              <h3 className="text-white/80 font-bold mb-4 tracking-wider uppercase text-sm">Student Submissions</h3>
              <div className="flex-1 w-full">
              <div className="flex-1 w-full relative">
                <Line options={chartOptions} data={lineChartData} />
              </div>
              </div>
              <div className="text-center text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2">Progress</div>
            </div>

            <div className="glass-morphism p-5 rounded-2xl border border-white/5">
              <h3 className="text-white/80 font-bold mb-4 tracking-wider uppercase text-sm">Feedback</h3>
              <div className="relative">
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none h-24"
                  placeholder="Enter feedback here.."
                />
              </div>
            </div>
          </div>

          {/* Right Column - My Tasks & Course Progress & Auth */}
          <div className="md:col-span-3 space-y-6">
            <div className="glass-morphism p-5 rounded-2xl border border-white/5">
              <h3 className="text-white/80 font-bold mb-4 tracking-wider uppercase text-sm">My Tasks</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-xs">
                  <CheckCircle2 size={14} className="text-green-400 mt-0.5" />
                  <span className="text-white/70">Task 1: Complete Core Module</span>
                </li>
                <li className="flex items-start gap-2 text-xs">
                  <div className="w-3.5 h-3.5 rounded-sm border border-white/20 mt-0.5" />
                  <span className="text-white/70">Task 2: Submit Final Assignment</span>
                </li>
              </ul>
            </div>

            <div className="glass-morphism p-5 rounded-2xl border border-white/5 flex flex-col items-center">
              <div className="w-full h-32 relative">
                <Bar options={chartOptions} data={barChartData} />
              </div>
              <div className="mt-2 flex items-center justify-between w-full">
                <span className="text-[10px] text-white/30 uppercase font-bold">Course Progress</span>
                <span className="text-xl font-bold neon-text-purple">75%</span>
              </div>
            </div>

            <div className="glass-morphism p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center space-y-3 group cursor-pointer hover:bg-white/5 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center neon-border-cyan glow">
                <Lock size={24} className="text-cyan-400" />
              </div>
              <div className="text-[10px] text-white/40 uppercase font-bold tracking-[0.15em] text-center">
                JWT Authentication
              </div>
            </div>
          </div>
        </div>

        {/* Footer Login Action */}
        <div className="p-6 bg-white/5 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-white/40 text-xs">
            Experience the future of OJT management with our futuristic dashboard system.
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all"
          >
            GET STARTED <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
