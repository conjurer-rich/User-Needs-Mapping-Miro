import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { createStarterTemplate } from './utils/template';
import { createShape, ShapeType } from './utils/shapes';
import './assets/style.css';

// Session-scoped tracking for shapes created from panel drops.
// These values reset when the app (panel) is reloaded.
let createdShapesCount = 0;
let hasShownLinkingHint = false;

async function showLinkingShortcutHint() {
  try {
    await miro.board.notifications.showInfo(
      'Click the board, then press "L" on your keyboard to start linking components.'
    );
  } catch (error) {
    // If notifications fail, log the error but do not interrupt the flow.
    console.error('Failed to show linking shortcut hint:', error);
  }
}

// Register drop handler for drag-and-drop from panel to board
async function initDropHandler() {
  miro.board.ui.on('drop', async ({ x, y, target }) => {
    // Find the shape type from the dropped element or its parents
    let element = target as HTMLElement | null;
    let shapeType: ShapeType | undefined;

    while (element) {
      shapeType = element.dataset?.shapeType as ShapeType | undefined;
      if (shapeType) break;
      element = element.parentElement;
    }

    if (!shapeType) {
      console.warn('No shape type found on dropped element');
      return;
    }

    try {
      await createShape(shapeType, x, y);
      createdShapesCount += 1;

      if (!hasShownLinkingHint && createdShapesCount === 2) {
        hasShownLinkingHint = true;
        await showLinkingShortcutHint();
      }
    } catch (error) {
      console.error(`Failed to create shape:`, error);
    }
  });
}

// Initialize drop handler
initDropHandler();

interface ShapeItemProps {
  type: ShapeType;
  label: string;
  children: React.ReactNode;
}

const ShapeItem: React.FC<ShapeItemProps> = ({ type, label, children }) => {
  return (
    <div
      className="miro-draggable shape-item"
      data-shape-type={type}
      title={`Drag to add ${label}`}
    >
      <div className="shape-preview">{children}</div>
      <span className="shape-label">{label}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [isCreatingTemplate, setIsCreatingTemplate] = React.useState(false);

  const handleCreateTemplate = async () => {
    setIsCreatingTemplate(true);
    try {
      await createStarterTemplate();
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  return (
    <div className="panel-container">
      <div className="shape-section">
        <h3 className="section-title">Users & Needs</h3>
        <div className="shape-grid">
          <ShapeItem type="user" label="User">
            <div className="preview-user">
              <svg viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
              </svg>
            </div>
          </ShapeItem>
          <ShapeItem type="userNeed" label="User Need">
            <div className="preview-circle preview-user-need" />
          </ShapeItem>
          <ShapeItem type="connector" label="Depends On">
            <div className="preview-connector">
              <div className="connector-line" />
            </div>
          </ShapeItem>
          <ShapeItem type="process" label="Process/Journey">
            <div className="preview-process" />
          </ShapeItem>
        </div>
      </div>

      <div className="shape-section">
        <h3 className="section-title">Capabilities</h3>
        <div className="shape-grid">
          <ShapeItem type="internalCapability" label="Internal">
            <div className="preview-circle preview-internal" />
          </ShapeItem>
          <ShapeItem type="externalCapability" label="External">
            <div className="preview-circle preview-external" />
          </ShapeItem>
          <ShapeItem type="system" label="System">
            <div className="preview-system" />
          </ShapeItem>
        </div>
      </div>

      <div className="shape-section">
        <h3 className="section-title">Team Overlays</h3>
        <div className="shape-grid">
          <ShapeItem type="streamAlignedTeam" label="Stream-aligned">
            <div className="preview-stream-aligned" />
          </ShapeItem>
          <ShapeItem type="platformTeam" label="Platform">
            <div className="preview-platform-team" />
          </ShapeItem>
          <ShapeItem type="complicatedSubsystemTeam" label="Complicated Subsystem">
            <div className="preview-complicated-subsystem" />
          </ShapeItem>
          <ShapeItem type="undefinedTeam" label="Undefined">
            <div className="preview-undefined-team" />
          </ShapeItem>
        </div>
      </div>

      <div className="shape-section">
        <h3 className="section-title">Groupings</h3>
        <div className="shape-grid">
          <ShapeItem type="valueStreamGrouping" label="Value Stream">
            <div className="preview-value-stream" />
          </ShapeItem>
          <ShapeItem type="platformGrouping" label="Platform">
            <div className="preview-platform-grouping" />
          </ShapeItem>
          <ShapeItem type="undefinedGrouping" label="Undefined">
            <div className="preview-undefined-grouping" />
          </ShapeItem>
        </div>
      </div>

      <div className="panel-footer">  
        <button
          className="button button-primary template-button"
          onClick={handleCreateTemplate}
          disabled={isCreatingTemplate}
        >
          {isCreatingTemplate ? 'Creating...' : 'Create Frame'}
        </button>
        <a
          href="https://userneedsmapping.com"
          target="_blank"
          rel="noopener noreferrer"
          className="learn-more-link"
        >
          Learn more about User Needs Mapping
        </a>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
