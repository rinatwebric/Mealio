import { cn } from '@/shared/lib'
import type { User } from '../model/types'
import { UserAvatar } from './UserAvatar'

export interface UserBadgeProps {
  user: Pick<User, 'firstName' | 'lastName' | 'image'>
  caption?: string
  className?: string
}

export function UserBadge({ user, caption, className }: UserBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <UserAvatar firstName={user.firstName} lastName={user.lastName} size={32} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-ink">
          {user.firstName} {user.lastName}
        </p>
        {caption ? <p className="truncate text-xs text-muted">{caption}</p> : null}
      </div>
    </div>
  )
}