import * as ContextMenu from '@radix-ui/react-context-menu';

type ContextMenuProps = {
    onPaste: () => void;
}

export default function CustomContextMenu({ onPaste }: ContextMenuProps) {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div className="canvas" style={{ width: '100%', height: '100vh' }}></div>
      </ContextMenu.Trigger>

      <ContextMenu.Content
        className="radix-context-menu"
      >
        <ContextMenu.Item className="menu-item" onSelect={onPaste}>
          Paste
        </ContextMenu.Item>
        {/* Add more items as needed */}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
