import { Gift } from 'lucide-react';
import { APP_CONFIG } from '../constants';

export function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12 border-t border-blue-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Gift className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        <span className="ml-2 text-xl font-normal text-gray-900 dark:text-white">{APP_CONFIG.name}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        © 2024 {APP_CONFIG.name}. All rights reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;