import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  notifications: Notification[];

  onMarkAsRead: (id: string) => void;

  onMarkAllAsRead: () => void;
}

export default function NotificationDrawer({
  open,
  onOpenChange,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: Props) {
  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent
        side="right"
        className="w-[420px] sm:w-[460px]"
      >
        <SheetHeader>

          <div className="flex justify-between items-center">

            <SheetTitle>
              Notifications
            </SheetTitle>

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
              >
                Mark all
              </Button>
            )}

          </div>

        </SheetHeader>

        <div className="mt-6 space-y-4 max-h-[80vh] overflow-y-auto">

          {notifications.length === 0 ? (

            <div className="text-center text-muted-foreground py-12">

              No notifications

            </div>

          ) : (

            notifications.map((notification) => (

              <div
                key={notification._id}
                onClick={() =>
                  onMarkAsRead(notification._id)
                }
                className={`rounded-xl border p-4 cursor-pointer transition-all hover:bg-secondary/50 ${
                  notification.isRead
                    ? ""
                    : "border-primary bg-primary/5"
                }`}
              >

                <div className="flex justify-between">

                  <h4 className="font-semibold">

                    {notification.title}

                  </h4>

                  {!notification.isRead && (

                    <span className="h-2 w-2 rounded-full bg-primary" />

                  )}

                </div>

                <p className="text-sm text-muted-foreground mt-2">

                  {notification.message}

                </p>

                <p className="text-xs text-muted-foreground mt-3">

                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}

                </p>

              </div>

            ))

          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}