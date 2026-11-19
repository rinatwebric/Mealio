import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { Input } from './Input'

const meta = {
  title: 'shared/ui/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: {
    label: 'Название рецепта',
    placeholder: 'Например, Tom yum',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('textbox'))
  },
}

export const WithHint: Story = {
  args: { hint: 'Минимум 3 символа' },
}

export const Error: Story = {
  args: { error: 'Название от 3 символов', defaultValue: 'Том' },
}

export const Disabled: Story = {
  args: { disabled: true, value: 'Chicken Biryani' },
}