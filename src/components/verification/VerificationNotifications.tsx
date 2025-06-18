import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VerificationNotification } from '@/lib/types/verification-status'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Bell, CheckCircle, AlertCircle, FileText, Star } from 'lucide-react'

interface VerificationNotificationsProps {
  userId: string
  initialNotifications?: VerificationNotification[]
}

export function VerificationNotifications({
  userId,
  initialNotifications = [],
}: VerificationNotificationsProps) {
  const [notifications, setNotifications] = useState<VerificationNotification[]>(
    initialNotifications
  )
  const supabase = createClient()

  useEffect(() => {
    const notificationSubscription = supabase
      .channel(`verification-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'verification_notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as VerificationNotification, ...prev])
        }
      )
      .subscribe()

    return () => {
      notificationSubscription.unsubscribe()
    }
  }, [userId, supabase])

  const getNotificationIcon = (type: VerificationNotification['type']) => {
    switch (type) {
      case 'status_update':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      case 'verification_complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'evidence':
        return <FileText className="h-5 w-5 text-purple-500" />
      case 'trust_score':
        return <Star className="h-5 w-5 text-yellow-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('verification_notifications')
      .update({ read: true })
      .eq('id', notificationId)

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <Badge variant="secondary">
          {notifications.filter((n) => !n.read).length} unread
        </Badge>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              {getNotificationIcon(notification.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 