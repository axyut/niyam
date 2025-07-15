"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { CheckCheck, Circle } from "lucide-react";

// Mock data for notifications
const initialNotifications = [
  {
    id: 1,
    read: false,
    text: 'The "Digital Privacy Act 2024" has been updated.',
    time: "2 hours ago",
  },
  {
    id: 2,
    read: false,
    text: 'A new discussion has started on the "Environmental Protection Bill".',
    time: "5 hours ago",
  },
  {
    id: 3,
    read: true,
    text: "Your profile information was successfully updated.",
    time: "1 day ago",
  },
  {
    id: 4,
    read: false,
    text: 'The "Companies Act Amendment" is now under review.',
    time: "3 days ago",
  },
];

export function NotificationsTab() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const toggleRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="p-8 animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h3 className="text-2xl font-bold">Notifications</h3>
        <Button variant="outline" size="sm" onClick={markAllAsRead}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>
      <div className="flex-grow overflow-y-auto -mr-4 pr-4">
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start gap-4 p-3 rounded-lg transition-colors ${
                notification.read ? "bg-secondary" : "bg-primary/10"
              }`}
            >
              <div className="flex-grow">
                <p
                  className={`text-sm ${
                    notification.read
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {notification.text}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {notification.time}
                </p>
              </div>
              <button
                onClick={() => toggleRead(notification.id)}
                className="p-2 text-muted-foreground hover:text-primary"
                aria-label={
                  notification.read ? "Mark as unread" : "Mark as read"
                }
              >
                {notification.read ? (
                  <CheckCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
