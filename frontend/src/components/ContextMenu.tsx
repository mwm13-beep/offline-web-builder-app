import * as ContextMenu from '@radix-ui/react-context-menu';
import { handler } from '../handlers/handlerMap';

async function handleContextPaste() {
    try {
        const canvas = document.querySelector(".canvas")?.getBoundingClientRect();
        if (!canvas) return;

        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
        for (const type of item.types) {
            const blob = await item.getType(type);
            const success = handler({
                data: blob,
                canvas: canvas,
                createElement: (element) =>
                    setElements((prev) => [...prev, element]),
            });
            if (success) return;
        }
        }
        console.warn("❗ Unsupported clipboard content.");
    } catch (err) {
        console.error("Clipboard read error:", err);
    }
}

export default function CustomContextMenu() {
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div className="canvas" style={{ width: '100%', height: '100vh' }}>
          Right-click anywhere
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Content
        className="radix-context-menu"
        sideOffset={5}
        align="start"
      >
        <ContextMenu.Item className="menu-item" onSelect={handleContextPaste}>
          Paste
        </ContextMenu.Item>
        {/* Add more items as needed */}
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
