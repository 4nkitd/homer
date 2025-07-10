# Homer

Homer is a modern, clean, and customizable dashboard for your browser. It allows you to easily add and manage your favorite links, notes, and events all in one place.

![Homer Dashboard](docs/index.html)

## Features

- **Customizable Dashboard:** Add, remove, and arrange links, notes, and events.
- **Sleek Interface:** A modern and clean UI.
- **Search:** Quickly search through your items or use the integrated Google search.
- **Event Reminders:** Get notified about upcoming events.

## Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) for local storage

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/4nkitd/homer.git
    cd homer
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Run the development server:**
    ```bash
    pnpm dev
    ```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build, run:

```bash
pnpm build
```

This will create a `dist` folder with the optimized and minified files. You can preview the production build with:

```bash
pnpm preview
```

## Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue on the GitHub repository.

If you'd like to contribute code, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes and commit them (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a pull request.
