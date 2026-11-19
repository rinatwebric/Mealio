import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { Pagination } from './Pagination'

const meta = {
  title: 'shared/ui/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  args: {
    page: 3,
    totalPages: 10,
    onPageChange: () => undefined,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.hover(canvas.getByRole('button', { name: 'Страница 4' }))
  },
}

export const FirstPage: Story = {
  args: { page: 1 },
}

export const LastPage: Story = {
  args: { page: 10 },
}

export const SinglePage: Story = {
  args: { page: 1, totalPages: 1 },
}