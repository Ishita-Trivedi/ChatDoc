import { Moon, Sun } from 'lucide-react';

const ThemeToggle = ({ isDarkMode, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-pressed={isDarkMode}
    className="relative flex h-10 w-[72px] items-center justify-between rounded-full border border-slate-300 bg-slate-100 px-2 text-slate-500 shadow-inner transition-colors duration-300 dark:!border-slate-600 dark:!bg-slate-800 dark:!text-slate-300"
  >
    <Sun size={16} className="relative z-10 text-amber-500" />
    <Moon size={15} className="relative z-10 text-indigo-400" />
    <span className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-md transition-transform duration-300 dark:!bg-slate-600 ${isDarkMode ? 'translate-x-7' : '-translate-x-1'}`} />
  </button>
);

export default ThemeToggle;
