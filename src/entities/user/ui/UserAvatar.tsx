import { cn } from '@/shared/lib'

export interface UserAvatarProps {
  firstName: string
  lastName: string
  size?: number
  className?: string
}

export function UserAvatar({ firstName, lastName, size = 32, className }: UserAvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-accent-soft font-medium text-accent',
        size >= 56 ? 'text-xl' : 'text-xs',
        className,
      )}
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  )
}