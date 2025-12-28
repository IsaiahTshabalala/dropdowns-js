/**
 * Vite configuration for building a React library.
 * This setup ensures that React is treated as a peer dependency,
 * preventing bundling issues in consuming applications.
 * It also defines the library entry point, output formats, and file naming conventions.
 * 
 * Date          Dev    Version     Description
 * 2025/12/18    ITA    1.0.0       Genesis.
 * 2025/12/28    Google 1.0.1       Tell Vite to treat react an external dependency.
 *               Gemini
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    // 1. Use the React plugin for JSX transformation
    plugins: [react()],
    
    build: {
        lib: {
            // 2. Point to your main library entry point
            entry: resolve(__dirname, 'src/index.js'),
            name: 'DropdownsJS',
            // 3. Explicitly define the formats we mapped in package.json
            formats: ['es', 'cjs'],
            // 4. Matches the file names we used in the "exports" field
            fileName: (format) => `dropdowns-js.${format}.js`,
        },
        rollupOptions: {
            // 5. CRITICAL: This prevents the 'recentlyCreatedOwnerStacks' error
            // It tells Vite: "Don't bundle React, the app using this library will provide it."
            external: ['react', 'react-dom', 'react/jsx-runtime'],
            output: {
                // 6. Defines global variables for systems that don't use modules
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime'
                },
            },
        },
        // 7. Optional: Cleans the dist folder before every build
        emptyOutDir: true,
    },
});