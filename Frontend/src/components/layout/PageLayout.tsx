import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import ThemeToggle from "@/components/ThemeToggle";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PageLayout = ({ children, showFooter = true }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main
        className="flex-1 pt-16"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {children}
      </motion.main>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageLayout;
