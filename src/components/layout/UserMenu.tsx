import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { UserProfile } from '@auth0/nextjs-auth0';

interface Props {
  user: UserProfile | undefined;
}

const fallbackAvatar = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

export function UserMenu({ user }: Props) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center">
        {user?.picture ? (
          <img src={user.picture} alt="" className="h-8 w-8 rounded-full" onError={(e) => {
            e.currentTarget.src = fallbackAvatar;
          }} />
        ) : (
          <UserCircleIcon className="h-8 w-8 text-gray-400" />
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/api/auth/logout"
                  className={`block px-4 py-2 text-sm ${
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                  }`}
                >
                  Sign out
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 