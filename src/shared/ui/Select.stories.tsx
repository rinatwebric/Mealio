import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const options = [
  { value: 'Easy', label: 'Просто' },
  { value: 'Medium', label: 'Средне' },
  { value: 'Hard', label: 'Сложно' },
]

const meta = {
  title: 'shared/ui/Select',
  component: Select,
  parameters: { layout: 'centered' },
  args: {
    label: 'Сложность',
    options,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {
  args: { error: 'Выберите сложность' },
}

export const Disabled: Story = {
  args: { disabled: true },
}

export const WithHint: Story = {
  args: { hint: 'Фильтр применяется сразу' },
}