import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta = {
  title: 'shared/ui/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: {
    children: 'Итальянская',
    variant: 'neutral',
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Accent: Story = {
  args: { variant: 'accent', children: 'Ужин' },
}

export const Success: Story = {
  args: { variant: 'success', children: 'Готово' },
}

export const Warning: Story = {
  args: { variant: 'warning', children: 'Демо-данные' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Ошибка' },
}