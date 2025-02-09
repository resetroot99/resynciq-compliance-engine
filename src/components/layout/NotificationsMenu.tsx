import { Menu, Transition } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

export function NotificationsMenu() {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="p-1 rounded-full hover:bg-gray-100">
        <BellIcon className="h-6 w-6 text-gray-400" />
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
        <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-md shadow-lg">
          <div className="py-1">
            <div className="px-4 py-2 text-sm text-gray-500">
              No new notifications
            </div>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
} 