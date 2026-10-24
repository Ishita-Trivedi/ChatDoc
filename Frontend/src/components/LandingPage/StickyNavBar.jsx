import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import ChatDocLogo from "../ui/ChatDocLogo";
import ThemeToggle from '../ui/ThemeToggle';
export default function StickyNavbar({ isDarkMode, onToggleTheme }) {
  return (
    <nav className="theme-nav fixed top-0 z-50 h-[70px] w-full border-b px-4 shadow-sm backdrop-blur-xl transition-colors duration-300 lg:px-0">
      <div className="max-w-[1200px] w-full py-4 mx-auto flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
           <ChatDocLogo/>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sign In Button for signed-out users */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="theme-secondary-button rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:!border-blue-400 hover:!text-blue-600">Sign In</button>
            </SignInButton>
          </SignedOut>

          {/* Sign Up Button for signed-out users */}
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-lg dark:!bg-blue-500 dark:!text-white dark:hover:!bg-blue-400">Sign Up</button>
            </SignUpButton>
          </SignedOut>

          {/* User Button for signed-in users */}
          <SignedIn>
            <UserButton path="/" />
          </SignedIn>

          {/* Dark mode toggle */}
          <ThemeToggle isDarkMode={isDarkMode} onToggle={onToggleTheme} />
        </div>
      </div>
    </nav>
  );
}
