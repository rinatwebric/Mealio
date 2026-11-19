import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Modal } from './Modal'

const meta = {
  title: 'shared/ui/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
  args: {
    open: true,
    onClose: () => undefined,
    title: 'Оценить рецепт',
    description: 'Classic Margherita Pizza — текущий рейтинг 4.6 из 5.',
    children: (
      <p className="text-sm text-muted">
        Выберите оценку от 1 до 5. PATCH обновит общий рейтинг в кэше.
      </p>
    ),
  },
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithFooter: Story = {
  args: {
    footer: (
      <>
        <Button variant="secondary">Отмена</Button>
        <Button>Отправить</Button>
      </>
    ),
  },
}

export const LongContent: Story = {
  args: {
    children: (
      <div className="space-y-3 text-sm text-muted">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>
            Строка {index + 1}: модальное окно ограничивает высоту и прокручивает содержимое,
            сохраняя заголовок и кнопку закрытия.
          </p>
        ))}
      </div>
    ),
    footer: <Button>Понятно</Button>,
  },
}