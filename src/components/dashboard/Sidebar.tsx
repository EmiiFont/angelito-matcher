import { Gift, Home, Users, Calendar, BarChart3, Settings, LogOut, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export function Sidebar({ isOpen, onClose, onLogout }: SidebarProps) {
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: Gift, label: 'Events', active: false },
    { icon: Users, label: 'Participants', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <>
      <div className={`bg-white dark:bg-gray-800 border-r border-purple-200 dark:border-gray-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-64 hidden lg:block'}`}>
        <div className="flex items-center justify-between p-6 border-b border-purple-200 dark:border-gray-700">
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <span className="ml-3 text-xl font-normal text-gray-900 dark:text-white">Angelito</span>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                item.active
                  ? 'text-purple-600 dark:text-purple-400 bg-gradient-to-r from-purple-50 to-purple-100/60 dark:from-purple-500/20 dark:to-purple-400/30 border-r-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-purple-200 dark:border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-normal text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}

export default Sidebar;
