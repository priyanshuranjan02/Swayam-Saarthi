import { AnimatePresence, motion } from "framer-motion";
import { BellOff, CheckCheck, Info } from "lucide-react";

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
        className="w-[420px] sm:w-[460px] flex flex-col"
      >
        <SheetHeader>

          <div className="flex justify-between items-center">

            <SheetTitle className="font-display">
              Notifications
            </SheetTitle>

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="gap-1.5"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all
              </Button>
            )}

          </div>

        </SheetHeader>

        <div className="mt-6 space-y-3 flex-1 overflow-y-auto no-scrollbar pr-1">

          {notifications.length === 0 ? (

            <div className="flex flex-col items-center gap-3 text-center text-muted-foreground py-16">
              <BellOff className="h-10 w-10 text-muted-foreground/40" />
              <span className="text-sm">No notifications yet</span>
            </div>

          ) : (

            <AnimatePresence initial={false}>
              {notifications.map((notification, i) => (

                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                  onClick={() =>
                    onMarkAsRead(notification._id)
                  }
                  className={`grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-border/60 p-4 cursor-pointer transition-all hover:bg-secondary/40 hover:shadow-soft ${
                    notification.isRead
                      ? ""
                      : "border-primary/40 bg-primary/5"
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                    <Info className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <div className="flex justify-between items-start gap-2">

                      <h4 className="font-semibold text-sm truncate">

                        {notification.title}

                      </h4>

                      {!notification.isRead && (

                        <span className="h-2 w-2 shrink-0 rounded-full bg-primary mt-1.5" />

                      )}

                    </div>

                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">

                      {notification.message}

                    </p>

                    <p className="text-xs text-muted-foreground/70 mt-2">

                      {new Date(
                        notification.createdAt
                      ).toLocaleString()}

                    </p>
                  </div>

                </motion.div>

              ))}
            </AnimatePresence>

          )}

        </div>
      </SheetContent>
    </Sheet>
  );
}
