/**
 * File: ./src/dropdowns/dropdowns.models.tsx
 * --------------------------------------------------------------------------------
 * Description: 
 * For definition of interfaces and type aliases that are common among the dropdowns.
 * --------------------------------------------------------------------------------
 * Change log
 * Start Date  End Date    Version   Dev     Description
 * 2026/05/11  2026/05/15  1.00      ITA     Genesis
 */

interface DropdownStyle {
    color: string;
    backgroundColor: string;
    fontSize?: string;
    borderColor?: string;
};
export type { DropdownStyle };

interface ButtonStyle {
    color: string, // text color
    backgroundColor: string,
    fontSize?: string,
    borderColor?: string
};
export type { ButtonStyle };
