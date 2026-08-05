import { Bell, CheckCheck, BellOff, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
          aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
          className="relative"
        >

          <Bell className="h-5 w-5" />

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -right-1 -top-1 h-5 min-w-5 px-1 rounded-full bg-destructive text-[10px] text-destructive-foreground flex items-center justify-center font-medium"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>

        </Button>

      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0 overflow-hidden"
      >

        <DropdownMenuLabel
          className="flex items-center justify-between px-4 py-3"
        >

          <span className="font-display font-semibold">Notifications</span>

          {notifications.length > 0 && (

            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-7 px-2 text-xs"
            >
              <CheckCheck className="h-3.5 w-3.5 mr-1" />

              Read all

            </Button>

          )}

        </DropdownMenuLabel>

        <DropdownMenuSeparator className="m-0" />

        {notifications.length === 0 ? (

          <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
            <BellOff className="h-8 w-8 text-muted-foreground/50" />
            <span className="text-sm">You're all caught up</span>
          </div>

        ) : (

          <div className="max-h-96 overflow-y-auto no-scrollbar">

            {notifications.map((notification) => (

              <div
                key={notification._id}
                onClick={() =>
                  markAsRead(notification._id)
                }
                className={`
                  relative
                  grid grid-cols-[auto_minmax(0,1fr)] gap-3
                  p-4
                  border-b border-border/40
                  last:border-b-0
                  cursor-pointer
                  transition-colors
                  hover:bg-secondary/40
                  ${
                    !notification.isRead
                      ? "bg-primary/5"
                      : ""
                  }
                `}
              >

                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground mt-0.5">
                  <Info className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm truncate">
                      {notification.title}
                    </p>
                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />
                    )}
                  </div>

                  <p
                    className="
                      text-sm
                      text-muted-foreground
                      mt-0.5
                      line-clamp-2
                    "
                  >
                    {notification.message}
                  </p>

                  <p
                    className="
                      text-xs
                      text-muted-foreground/70
                      mt-1.5
                    "
                  >

                    {new Date(
                      notification.createdAt
                    ).toLocaleString()}

                  </p>
                </div>

              </div>

            ))}

          </div>

        )}

      </DropdownMenuContent>

    </DropdownMenu>

  );

}
