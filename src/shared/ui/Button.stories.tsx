import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'shared/ui/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: 'Добавить рецепт',
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button'))
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Отмена' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Очистить' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Удалить' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const Loading: Story = {
  args: { isLoading: true, children: 'Сохраняем' },
}

export const Large: Story = {
  args: { size: 'lg', children: 'Создать рецепт' },
}