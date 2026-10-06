import React, { useState } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { mockNotifications } from '../../data/mockAnnouncements';
import { Link } from 'react-router-dom';

export const NotificationDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE4D5] text-[#173F35] border border-[#E6DDCF] relative transition-colors"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B85C45] text-white rounded-full text-[9px] font-black flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Popover */}
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFDF8] rounded-2xl shadow-elevated border border-[#EDE6D8] z-50 overflow-hidden text-left animate-slide-up">
            <div className="p-3.5 border-b border-[#EDE6D8] bg-[#F7F3EA]/70 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold font-serif text-[#173F35]">System Alerts</h4>
                <p className="text-[10px] text-stone-500">{unreadCount} unread notices</p>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-[#2E6B57] hover:underline font-semibold flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#EDE6D8]">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-xs text-stone-400">No alerts right now</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 transition-colors ${
                      n.read ? 'bg-transparent' : 'bg-[#F0F5F3]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[#173F35]">{n.title}</p>
                      <span className="text-[10px] text-stone-400 shrink-0">{n.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 leading-snug">{n.message}</p>
                    {n.link && (
                      <Link
                        to={n.link}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#B85C45] hover:underline mt-2"
                      >
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
