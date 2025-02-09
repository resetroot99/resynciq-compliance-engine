import { useStore } from '../../store';
import { formatDate } from '../../utils/format';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Activity {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: Date;
}

export function TeamActivity() {
  const { estimates } = useStore();

  // Generate activity from estimates
  const activities: Activity[] = estimates
    .slice(-5)
    .map(est => ({
      id: est.id,
      user: { name: 'Team Member' }, // Replace with actual user data
      action: 'processed',
      target: `${est.vehicleInfo.year} ${est.vehicleInfo.make} ${est.vehicleInfo.model}`,
      timestamp: new Date(est.createdAt)
    }))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Team Activity</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, idx) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {idx !== activities.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    {activity.user.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={activity.user.avatar}
                        alt=""
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">
                          {activity.user.name}
                        </span>{' '}
                        {activity.action}{' '}
                        <span className="font-medium text-gray-900">
                          {activity.target}
                        </span>
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 