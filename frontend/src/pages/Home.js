import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const Home = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 text-black dark:text-white transition-colors duration-200">
        <Navbar />

        <motion.div 
          className="text-center mt-32 max-w-3xl mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-5xl md:text-6xl font-black tracking-tight leading-none" variants={itemVariants}>
            AI Powered Hiring Platform
          </motion.h1>

          <motion.p className="mt-6 text-xl text-gray-600 dark:text-zinc-400" variants={itemVariants}>
            Smart Resume Analysis and Interactive Mock Interviews
          </motion.p>

          <motion.div className="mt-8" variants={itemVariants}>
            {/* FIXED: Pointing the path to your active resume checker endpoint tool */}
            <Link to="/resume-upload">
              <motion.button 
                className="bg-black dark:bg-white text-white dark:text-black font-semibold px-8 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Home;
