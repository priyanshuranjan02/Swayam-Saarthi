import {
  Bell,
  CheckCheck,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

import {
  useNotifications,
} from "@/contexts/NotificationContext";

export default function NotificationBell() {

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (

    <DropdownMenu>

      <DropdownMenuTrigger asChild>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >

          <Bell className="h-5 w-5" />

          {unreadCount > 0 && (

            <span
              className="
                absolute
                -right-1
                -top-1
                h-5
                w-5
                rounded-full
                bg-red-500
                text-[10px]
                text-white
                flex
                items-center
                justify-center
              "
            >
              {unreadCount}
            </span>

          )}

        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96"
      >

        <DropdownMenuLabel
          className="flex items-center justify-between"
        >

          Notifications

          {notifications.length > 0 && (

            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-2" />

              Read All

            </Button>

          )}

        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {notifications.length === 0 ? (

          <div className="p-6 text-center text-muted-foreground">

            No Notifications

          </div>

        ) : (

          <div className="max-h-96 overflow-y-auto">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                onClick={() => 
                  markAsRead(notification._id)
                }
                className={`
                  p-4
                  border-b
                  last:border-b-0
                  cursor-pointer
                  transition-colors
                  ${
                    !notification.isRead
                      ? "bg-primary/5"
                      : ""
                  }
                `}
              >

                <p className="font-medium">
                  {notification.title}
                </p>

                <p
                  className="
                    text-sm
                    text-muted-foreground
                    mt-1
                  "
                >
                  {notification.message}
                </p>

                <p
                  className="
                    text-xs
                    text-muted-foreground
                    mt-2
                  "
                >

                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}

                </p>

              </div>

            ))}

          </div>

        )}

      </DropdownMenuContent>

    </DropdownMenu>

  );

}