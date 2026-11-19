import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'shared/ui/Card',
  component: Card,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 className="text-base font-semibold">Коротко о рецепте</h3>
        <p className="mt-2 text-sm text-muted">
          Подготовка, готовка, порции и калорийность в одном блоке.
        </p>
      </div>
    ),
  },
}

export const Flush: Story = {
  args: {
    padded: false,
    children: (
      <div className="p-0">
        <div className="h-32 rounded-t-card bg-raised" />
        <p className="p-4 text-sm">Карточка без внутреннего отступа для изображения.</p>
      </div>
    ),
  },
}