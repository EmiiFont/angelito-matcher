import { Gift } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Gift className="h-8 w-8 text-purple-400" />
            <span className="ml-2 text-xl font-bold">My Angelito</span>
          </div>
          <div className="text-sm text-gray-400">
            © 2024 Angelito. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
