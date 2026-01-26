# User Needs Mapping - Miro App

A Miro app that provides draggable shapes and a starter template for User Needs Mapping, a visual technique for mapping user needs to organizational capabilities.

## Quick Start

```bash
npm install
npm start
```

Then add the app to your Miro board via the app settings (localhost:3000).

## Project Structure

```text
src/
├── index.ts          # Main entry - opens panel on icon click
├── app.tsx           # React panel UI with draggable shapes and drop handler
├── utils/
│   ├── shapes.ts     # Shape factory functions (User, UserNeed, Internal, External, etc.)
│   └── template.ts   # Starter template generator with frame, labels, and legend
└── assets/
    ├── style.css     # Panel styling (Poppins font, grid layout)
    └── user-icon.svg # User icon asset
```

## Key Files

### shapes.ts

Factory functions for creating User Needs Mapping elements:

- `createUser()` - Person silhouette (head + body circles)
- `createUserNeed()` - Blue filled circle
- `createInternalCapability()` - White circle with border
- `createExternalCapability()` - Gray filled circle
- `createSystem()` - Dotted border rectangle
- `createProcess()` - Dashed border rectangle
- `createConnector()` - Straight line (no arrows)
- `createTeamBoundary()` - Rounded rectangle with dashed border

All shapes include a text label and are grouped together.

### template.ts

Creates the starter template inside a Miro frame:

- Row labels: Users, User needs, Capabilities
- Value chain axis with Visible/Value Chain/Invisible labels
- Key legend (horizontal, right-aligned)

### app.tsx

React panel with:

- Draggable shape library (uses `miro-draggable` class)
- "Create Starter Template" button
- Drop handler that creates shapes on the board

## Shape Colors

| Shape     | Fill        | Border             |
| --------- | ----------- | ------------------ |
| User      | White       | #1A1A1A            |
| User Need | #414BB2     | None               |
| Internal  | White       | #1A1A1A            |
| External  | #808080     | None               |
| System    | Transparent | #1A1A1A (dotted)   |
| Process   | Transparent | #1A1A1A (dashed)   |

## Build Commands

- `npm start` - Development server
- `npm run build` - Production build
- `npm run serve` - Preview production build
