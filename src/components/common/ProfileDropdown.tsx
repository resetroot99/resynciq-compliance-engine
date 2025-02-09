import { useState, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export default function ProfileDropdown() {
  const { user, logout } = useAuth0();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none"
      >
        <img
          src={user?.picture || 'https://via.placeholder.com/40'}
          alt={user?.name || 'User'}
          className="h-8 w-8 rounded-full"
        />
        <span className="text-sm text-gray-700">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <a
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Your Profile
            </a>
            <a
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Settings
            </a>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 