import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta = {
  title: 'shared/ui/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  args: {
    label: 'Ингредиенты',
    hint: 'Один ингредиент на строку',
    placeholder: 'Pizza dough\nTomato sauce',
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: { error: 'Добавьте минимум два ингредиента' },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'Pizza dough' },
}