/**
 * File: ./src/declarations.d.ts
 * --------------------------------------------------------------------------------
 * Description: 
 * Tell Typescript about the css files.
 * --------------------------------------------------------------------------------
 * Change log
 * Start Date  End Date    Version   Dev     Description
 * 2026/05/11  2026/05/15  1.00      ITA     Genesis
 */
declare module '*.css'{
    const content: {
        [className: string]: string;
    };
    export default content;
};
declare module 'react-dom/client';