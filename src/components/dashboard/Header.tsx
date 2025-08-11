import { Menu, LogOut } from 'lucide-react';
import { useSession } from '../../lib/auth-client';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Header({ onMenuClick, onLogout }: HeaderProps) {
  const { data: session } = useSession();
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-blue-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="lg:hidden mr-4" onClick={onMenuClick}>
            <Menu className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-normal text-gray-900 dark:text-white">Create New Event</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-normal">
                  {getInitials(session?.user?.name)}
                </span>
              </div>
              <span className="ml-3 text-sm font-normal text-gray-700 dark:text-gray-300">
                {session?.user?.name || session?.user?.email || 'User'}
              </span>
            </div>
            <button
              onClick={onLogout}
              className="h-8 w-8 p-0 flex items-center justify-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
