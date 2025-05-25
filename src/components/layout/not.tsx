import React from 'react';
import { Bell, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchWithAuth } from '@/lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from "react-hot-toast";


// ... existing code ...

export function Notifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchWithAuth('/notification') as Promise<any>,
    enabled: !!user,
    refetchInterval: 3000,
  });

  const unseenCount = notifications?.result?.filter((n : any) => !n.seen).length || 0;

  const markAllAsSeen = async () => {
    try {
      await fetchWithAuth('/notification/seen-all', {
        method: 'POST',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      toast.error('Failed to mark notifications as seen');
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetchWithAuth(`/notification/${notificationId}`, {
        method: 'DELETE',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  const deleteAllNotifications = async () => {
    try {
      await fetchWithAuth('/notification/all', {
        method: 'DELETE',
      });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('All notifications deleted');
    } catch (error) {
      toast.error('Failed to delete all notifications');
    }
  };

  // Mark all as seen when popover opens
  React.useEffect(() => {
    if (isOpen && unseenCount > 0) {
      markAllAsSeen();
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative w-10 h-10">
          <Bell className="h-5 w-5" />
          {unseenCount > 0 && (
            <span className="absolute top-0 right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unseenCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          {unseenCount > 0 && (
            <span className="text-sm text-muted-foreground">
              {unseenCount} new
            </span>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {notifications?.result && notifications.result.length > 0 ? (
            <div className="p-2">
              {notifications.result.map((notification:any, index:number) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${!notification.seen ? 'bg-accent/50' : ''} group relative`}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col gap-1 pr-8">
                    <p className="font-medium text-sm">{notification.topic}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
              <div className="p-3 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={deleteAllNotifications}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All Notifications
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}