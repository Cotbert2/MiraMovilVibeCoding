# Figma Make Local Runner

A skeleton project designed to run code downloaded from Figma Make locally, so you can easily modify the generated code with your favorite tools.

## ⚡ How It Works

1. **Pre-installed Packages**  
   This project comes with many packages that Figma Make-generated code may require (see `package.json`). If you encounter errors about missing dependencies, simply install the required packages using `npm install <package-name>`.

2. **Automatic Removal of Version Specifiers in Imports**  
   Figma Make sometimes generates import statements with explicit version specifiers, for example:

   ```js
   import { Slot } from "@radix-ui/react-slot@1.1.2";
   ```

   This can cause version conflicts or issues with local development.  
   **Solution:**  
   This project uses a custom Vite plugin that automatically removes version specifiers from import statements during build and development.  
   The above import will be transformed to:

   ```js
   import { Slot } from "@radix-ui/react-slot";
   ```

   This ensures compatibility with the dependencies installed in your project.

   > If you still see errors about missing packages, install them manually as needed.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/likang/figma-make-local-runner
cd figma-make-local-runner
```

### 2. Download Code from Figma Make

1. Export your code from Figma Make
2. Decompress the downloaded files
3. Copy all the files and folders into the `src` directory of this project

**Important**: Make sure to replace or merge with the existing files in the `src` folder. The current `src` folder contains a demo application that you should replace with your Figma Make code.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is occupied).

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
