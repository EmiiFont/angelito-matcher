import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-purple-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button className="lg:hidden mr-4" onClick={onMenuClick}>
            <Menu className="h-6 w-6 text-gray-500" />
          </button>
          <h1 className="text-2xl font-normal text-gray-900">Create New Event</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-normal">JD</span>
            </div>
            <span className="ml-3 text-sm font-normal text-gray-700">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
