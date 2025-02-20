import { LogOut } from 'lucide-react';
import Link from 'next/link';

interface SidebarProps {
  handleSignout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleSignout }) => {
  return (
    <div className="w-64 bg-black fixed h-full md:block hidden text-white p-6">
      <div className="mb-8">
        <Link href={"/"}>
          <h1 className="text-2xl font-bold">
            MAX<span className="text-red-500">CLEAN</span>
          </h1>
        </Link>
      </div>
      <nav className="space-y-4">
        <Link
          href="/dashboard"
          className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
        >
          <div className="w-5 h-5 rounded-full border-2 border-red-500" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/tip-report"
          className="flex items-center space-x-2 bg-white/10 text-white rounded-lg p-3"
        >
          <div className="w-5 h-5 rounded-full border-2 border-red-500" />
          <span>Tip Report</span>
        </Link>
        {/* Add more links as needed */}
        <div className="absolute bottom-0">
          <button
            onClick={handleSignout}
            className="flex items-center space-x-2 text-gray-400 p-3"
          >
            <LogOut className="w-5 h-5" />
            <span>Log out</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
