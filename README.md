# Ligma

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/ligma/actions)  
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)  
[![Contributors](https://img.shields.io/badge/contributors-3-orange)](https://github.com/yourusername/ligma/graphs/contributors)

## Short Description
Ligma is a collaborative, real-time design tool inspired by Figma, allowing users to create, edit, and share designs with live collaboration features.

## Long Description
Ligma is a **web application** built using **Next.js**, **React**, and **Liveblocks** that allows users to collaboratively design and edit canvas-based projects in real time. It was created to solve the problem of disconnected design workflows by enabling live collaboration, real-time comments, and interactive features. Key features include:
- Real-time cursor sharing and chat.
- Collaborative canvas editing with undo/redo functionality.
- Live comments and threads for better communication.
- Export designs to PDF.

## Tech Stack
- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Liveblocks (real-time collaboration)
- **Database**: Liveblocks Storage
- **Others**: Zustand, Fabric.js, TypeScript, Radix UI

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/drave-coding/Ligma
   cd ligma
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file in the root directory.
   - Add the required environment variables as specified in `.env.example`. For example:
     ```
     NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=your_liveblocks_public_key
     ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Usage Instructions
1. Open your browser and navigate to `http://localhost:3000`.
2. Use the navigation bar to select tools like shapes, text, or comments.
3. Collaborate with others in real time by sharing the room link.
4. Export your designs to PDF using the "Export" option in the right sidebar.

### Screenshots
![Screenshot 1](https://via.placeholder.com/800x400)  
*Caption for screenshot 1*


## Features
- **Real-Time Collaboration**: See live cursors, chat, and reactions from other users.
- **Canvas Editing**: Add shapes, text, and images to the canvas.
- **Comments and Threads**: Add and resolve comments directly on the canvas.
- **Undo/Redo**: Easily revert or reapply changes.
- **Export to PDF**: Download your designs as a PDF file.
- **Customizable Design**: Modify shapes, colors, and text attributes.

## Folder Structure
```
.
├── app/                # Next.js app directory
│   ├── layout.tsx      # Root layout for the app
│   ├── page.tsx        # Main entry point for the app
│   └── Room.tsx        # Room setup for Liveblocks
├── components/         # Reusable React components
│   ├── comments/       # Components for comments and threads
│   ├── cursor/         # Components for live cursors
│   ├── reaction/       # Reaction-related components
│   ├── settings/       # Sidebar settings components
│   ├── ui/             # UI components (buttons, dropdowns, etc.)
│   ├── LeftSideBar.tsx # Left sidebar for layers
│   ├── Navbar.tsx      # Top navigation bar
│   └── RightSideBar.tsx# Right sidebar for design settings
├── lib/                # Utility functions and helpers
│   ├── canvas.ts       # Canvas-related logic
│   ├── shapes.ts       # Shape creation and modification logic
│   ├── key-events.ts   # Keyboard event handlers
│   └── utils.ts        # General utility functions
├── public/             # Static assets (images, icons, etc.)
├── styles/             # Global and component-specific styles
├── types/              # TypeScript type definitions
├── .env.example        # Example environment variables
├── package.json        # Project metadata and dependencies
└── README.md           # Project documentation
```

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request.

For more details, see our [CONTRIBUTING.md](CONTRIBUTING.md).

## License
This project is licensed under the [MIT License](LICENSE).

## Badges
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/ligma/actions)  
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)  
[![Contributors](https://img.shields.io/badge/contributors-3-orange)](https://github.com/yourusername/ligma/graphs/contributors)

## Optional Sections
### Changelog
See the [CHANGELOG.md](CHANGELOG.md) for a detailed list of changes and updates.

### Demo
Check out the live demo: [Deployed URL](https://ligma-ochre.vercel.app)

### Additional Notes
- This project uses Liveblocks for real-time collaboration. Ensure you have a valid API key configured in your `.env` file.
- For any issues or feature requests, please open an issue in the GitHub repository.