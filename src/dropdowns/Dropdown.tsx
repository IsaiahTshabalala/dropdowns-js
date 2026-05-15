/**
 * File: ./src/dropdowns/Dropdown.tsx
 * ------------------------------------------------------------------------------------------------------
 * Description: 
 * Provide a single selection searchable dropdown that takes an array of primitive types.
 * * ----------------------------------------------------------------------------------------------------
 * Start Date  End Date      Dev     Version   Description
 * 2023/12/19                ITA     1.00      Genesis.
 * 2024/06/18                ITA     1.01      Add the version number.
 * 2024/09/17                ITA     1.02      Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                                             Adjust width and add borders.
 *                                             Import context directly.
 * 2024/10/11                ITA     1.04      Reduce the width of the text box so that it appears side by side with the drop-down on even smaller screens.
 * 2024/10/28                ITA     1.05      Improve the responsiveness of the Dropdown.
 * 2025/12/18                ITA     1.06      Performed further tweaks and tests, preparing this component for npm publishing.
 * 2025/12/26                ITA     1.07      Changed the arrow symbols to + and - for better visibility across different platforms.
 * 2025/12/29                ITA     1.08      Placeholder must show the name of the data, as provided by the label attribute.
 * 2026/01/11  2026/01/16    ITA     1.09      Improved the component so that it stores its own data instead of relying on the Collections context provider.
 * 2026/01/17  2026/01/17    ITA     1.10      Removed attributes that do no apply to this component.
 *                                             Corrected the description of 'selected' attribute in the function header.
 * 2026/01/17  2026/01/17    ITA     1.11      Corrected the component proptypes to include onItemSelected, instead of onItemsSelected.
 * 2026/01/19  2026/01/19    ITA     1.12      Used useId() to ensure the uniqueness of ids of the concerned html elements even when the component is used multiple times in the same page.
 * 2026/01/20  2026/02/01    ITA     1.13      Added a 'selReset' attribute. When set to true, the dropdown updates to the default selected item when this value changes in the parent component.
 *                                             Combined searchItems and list state variables into a single variable: list.
 *                                             Improved the logic for setting selected items.
 * 2026/05/11  2026/05/15    ITA     2.0.0     Changed the file extension to .tsx and migrated to Typescript.
 */

import { useState, useMemo, useId, useEffect, JSX } from 'react';
import './dropdown.css';
import { DropdownStyle, ButtonStyle } from './dropdowns.models.js';
import { compare } from 'some-common-functions-js';

interface DropdownPropTypes<T> {
    label: string;
    data: NonNullable<T>[];
    sortOrder?: 'asc' | 'desc';
    onItemSelected?: (selectedItem: T) => void;
    selected?: T | null;
    selReset?: boolean;
    isDisabled?: boolean;
    dropdownStyle: DropdownStyle;
    buttonStyle?: ButtonStyle;
};

/**Single selection dropdown component.
 */
export function Dropdown<T extends number | string | bigint | boolean>({
                    label, // label with which to describe the dropdown.
                    data, // Primitive type array.
                    sortOrder = 'asc',
                    onItemSelected, // Function to pass on the value of the selected item to the parent component
                    selected, // Initial selected item.
                    selReset = false, // If true, selected item via parent component.
                    dropdownStyle, // Styling object with fields {color, backgroundColor, borderColor (optional), fontSize}.
                    isDisabled = false}: DropdownPropTypes<T>) : JSX.Element
{
    // Enforce that dropdown items be non-null and primitive type: string|number|bigint|boolean.    
    const primitiveTypes = ["number", "string", "boolean", "bigint"];
    if ((data.length > 0) && (data.some(dataItem=> {
        return ((dataItem === null) || (!primitiveTypes.includes(typeof dataItem)));
    }))) { // Ensure that the data array contains only primitive types.
        throw new Error(`Dropdown items must be one of ${primitiveTypes}`);
    }

    const uid = useId(); // Unique ID.
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide dropdown items.
    const [searchText, setSearchText] = useState('');

    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);

    // Items to display in the dropdown.
    const list = useMemo(()=> {
        if (searchText.length === 0)
            return sortedData;

        const searchTextUppercase = searchText.toUpperCase();
        return sortedData.filter(item=> {
            return (item as unknown as string).toUpperCase().includes(searchTextUppercase);
        });
    }, [sortedData, searchText]);

    // Text to display in the textbox. Could be search text or currently selected item.
    const [displayValue, setDisplayValue] = useState('');

    // Use to set the user selected item only!! For getting the currently selected item use selectedItem.
    const [currSelected, setCurrSelectedItem] = useState<T | undefined>();

    // Use to get the currently selected item only!! To set the user selected item, use setCurrSelectedItem() function.
    const selectedItem = useMemo<T | undefined>((): T | undefined => {
        // If selReset is true, then always return selected (default selection).
        // Else if the user has not made any selection yet, return selected (default selection).
        // Else return the item selected by the user (currSelectedItem).
        let selItem: T|undefined;
        let idx: number = -1;
        if ((currSelected) && (selReset === false)) {
            idx = data.findIndex(item=> item === currSelected); // Ensure that the currently selected item is still in the data array.
            if (idx >= 0)
                selItem = data[idx];
        }
        else if (selected) {
            idx = data.findIndex(item=> item === selected);
            if (idx >= 0)
                selItem = data[idx];
        }
        if (idx >= 0) // Check whether there is a selection, to avoid assigning undefined to the display value.
            setDisplayValue(selItem as string);
        else
            setDisplayValue('');

        return selItem;
    }, [selReset, selected, currSelected]);

    const [selKey, setSelKey ] = useState(0); // Used to trigger a side-effect when the user has made a selection.
    useEffect(()=> {
        if ((selKey > 0) && (currSelected) && (onItemSelected))
            onItemSelected(selectedItem!);
    }, [selKey]);

    const inputStyle = (()=> {
        const aStyle:DropdownStyle = { 
            backgroundColor: dropdownStyle?.backgroundColor,
            color: dropdownStyle?.color
        }
        if (dropdownStyle?.fontSize) {
            aStyle.fontSize = dropdownStyle.fontSize!;
        }
        return aStyle;
    })();
    const borderColor = dropdownStyle?.borderColor;

    /**Comparison function to be used in sorting dropdown items according to the specified sort direction */
    function compareFn<T>(item1: T, item2: T) {
        return compare(item1, item2, sortOrder);
    }

    /**Respond to the user typing text to search for items */
    function handleSearch(e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) {
        // As the user types, pop up the listbox with matching items, otherwise close the listbox if there's no matching items.
        setSearchText(e.target.value);
        setDisplayValue(e.target.value);        
        showList();
    } // function handleSearch(e)

    async function handleItemClick(value: T) {
        if (selReset) // Selected item set by the parent component. Do not allow user selection.
            return;

        setDisplayValue(value as string);
        setSearchText('');

        setCurrSelectedItem(value);
        hideList();
        setSelKey(prev=> prev + 1); // Trigger the side-effect to alert the parent component.
    } // function handleItemClick(value) {

    function toggleShowList() {
        if (isDisabled)
            return;
        if (!showItems)
            showList();
        else
            hideList();
    } // function toggleShowList() {

    function hideList() {
        setShowItems(false);
    }

    function showList() {
        if (list.length > 0)
            setShowItems(true);
    } // function showList() {
    
    const ids = {
        dropdownSearch: `dropdownSearch-${uid}`,
        dropdown: `dropdown-${uid}`
    };
    return (
        <div className={`dropdown-js dropdown-js-rounded
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
             style={{...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>                
                <input 
                    id={ids.dropdownSearch} name='dropdownSearch'
                    className={`dropdown-js-input dropdown-js-rounded`} autoComplete='off'
                    type='text'
                    style={inputStyle}
                    role='combobox'
                    aria-placeholder={`Type to Search for ${label}`}
                    aria-required={true} 
                    aria-controls={ids.dropdown}
                    aria-autocomplete='list'
                    aria-haspopup={'listbox'}
                    aria-expanded={showItems}
                    onChange={e=> handleSearch(e)}
                    disabled={isDisabled} placeholder={`Type to Search for ${label}`} value={displayValue}
                />
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded'
                     aria-expanded={showItems} aria-controls='multiSelectionDropdown' aria-label={`${label} options`}
                     onClick={()=> toggleShowList()}
                >
                    <span className='dropdown-js-arrow dropdown-js-padding'
                          aria-label={`${label} options`} aria-expanded={showItems} >{!showItems? "+" : "-"}</span>
                </div>
            </div>
           
            <ul className={`dropdown-js-padding dropdown-js-menu ${(!showItems) && 'dropdown-js-hide'}`}
                 id={ids.dropdown}
                 role='listbox' aria-expanded={showItems} 
                 aria-disabled={isDisabled} aria-label={label} style={{...inputStyle, marginTop: '3.5px'}}
            >
                {list.map((item, index)=> {
                        return (
                            <li key={`${index}#${item}`} role='option' aria-label={item as string}
                                style={{cursor: 'pointer'}} onClick={()=> handleItemClick(item)}
                            >
                                {item as string}
                                {(index < list.length - 1) &&
                                    <hr style={{borderColor: inputStyle.color}}/>
                                }
                            </li>
                        );
                    }) // list.map(item=> {
                }
            </ul>
        </div>
    );
}
