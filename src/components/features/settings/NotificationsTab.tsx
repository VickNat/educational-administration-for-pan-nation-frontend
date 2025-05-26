import { RiNotification2Line } from 'react-icons/ri';
import { useGetParentSMSToggle } from '@/queries/parents/queries';
import { useEffect, useState } from 'react';
import { useToggleParentSMS } from '@/queries/parents/mutations';
import { useAuth } from '@/app/context/AuthContext';

export default function NotificationsTab() {
  const { data: parentSMSToggle } = useGetParentSMSToggle();
  const { user } = useAuth();

  const { mutateAsync: toggleParentSMS } = useToggleParentSMS(user?.roleId || '');
  const [smsToggle, setSmsToggle] = useState(parentSMSToggle?.result?.isSMSUser);


  useEffect(() => {
    setSmsToggle(parentSMSToggle?.result?.isSMSUser);
  }, [parentSMSToggle]);
  
  const handleToggleSMS = async () => {
    await toggleParentSMS({ smsToggle: !smsToggle });
    setSmsToggle(!smsToggle);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {['SMS Notifications'].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RiNotification2Line className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={smsToggle} onChange={handleToggleSMS} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 