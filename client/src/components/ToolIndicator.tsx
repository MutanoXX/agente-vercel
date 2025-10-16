interface ToolIndicatorProps {
  tool: string | null;
}

export function ToolIndicator({ tool }: ToolIndicatorProps) {
  if (!tool) return null;

  return (
    <div className="tool-indicator">
      <div className="tool-indicator-content">
        <div className="spinner"></div>
        <span>{tool}</span>
      </div>
    </div>
  );
}
