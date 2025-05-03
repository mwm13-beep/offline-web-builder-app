import * as ContextMenu from '@radix-ui/react-context-menu';
import { ContextMenuItem } from './types';

type ContextMenuProps = {
  children: React.ReactNode;
  menuItems: ContextMenuItem[];
};

export default function CustomContextMenu({ children, menuItems }: ContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content className="radix-context-menu">
        {menuItems.map((item, index) => (
          <ContextMenu.Item
            key={index}
            className="menu-item"
            onSelect={item.onSelect}
            >
              {item.label}
            </ContextMenu.Item>
        ))}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
