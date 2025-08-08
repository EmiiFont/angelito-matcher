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
      <div className={`bg-white border-r border-purple-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-64 hidden lg:block'}`}>
        <div className="flex items-center justify-between p-6 border-b border-purple-200">
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-purple-600" />
            <span className="ml-3 text-xl font-normal text-gray-900">Angelito</span>
          </div>
          <button className="lg:hidden" onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item, index) => (
            <a
              key={index}
              href="#"
              className={`flex items-center px-6 py-3 text-sm font-normal transition-colors ${
                item.active
                  ? 'text-purple-600 bg-purple-50 border-r-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-6 border-t border-purple-200">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-normal text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
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
