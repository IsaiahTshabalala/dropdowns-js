/**
 * File: ./src/components/MultiSelectionDropdown.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a multi-selection, searchable dropdown that takes an array of primitve types.
 * * --------------------------------------------------------------------------------
 * Start Date  End Date      Dev    Version   Description
 * 2024/02/27                ITA    1.00      Genesis.
 * 2024/09/17                ITA    1.02      Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                                            Adjust width and add borders.
 *                                            Import context directly. Variable names moved to VarNames object.
 * 2024/10/28                ITA    1.03      Improve the responsiveness of the dropdown.
 * 2025/12/18                ITA    1.06      Performed further tweaks and tests, to prepare this component for npm publishing.
 * 2025/12/26                ITA    1.07      Changed the arrow symbols to + and - for better cross-platform rendering.
 * 2025/12/29                ITA    1.09      Placeholder to show the name of the data, as provided by the label attribute.
 * 2026/01/11  2026/01/16    ITA    1.10      Improved the component so that it stores its own data instead of relying on the Collections context provider.
 */
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import { compare } from 'some-common-functions-js';
import './dropdown.css';

/** Provide a multi-selection, searchable dropdown that takes an array of primitve types.
 * @param {String} label for screen readers.
 * @param {Array} data An array of primitive type items to display in the multiselection dropdown.
 * @param {String} [sortDirection='asc'] 'asc' or 'desc'. Default = 'asc'.
 * @param {Array} [selectedData=[]] pre-set array of selected items. Optional.
 * @param {Number} [maxNumSelections=null] allowed maximum number of selections. Optional.
 * @param {Boolean} [isDisabled=false] optional. Set to true if you want to disable component.
 * @param {null} [onItemsSelected=null] Callback function to call when selection is complete. Optional.
 * @param {Object} dropdownStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional)
 * @param {Object} buttonStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional) 
*/
export function MultiSelectionDropdown({
                    label, // label with which to describe the dropdown.
                    data,
                    sortDirection = 'asc',
                    selectedData = [],
                    maxNumSelections = null,
                    isDisabled = false,
                    onItemsSelected = null,
                    dropdownStyle, // Styling object with fields {color, backgroundColor, borderColor (optional), fontSize}.
                    buttonStyle // Styling for the DONE button
                })
{
    const [showItems, setShowItems] = useState(false); /* true or false: show or hide dropdown items */

    // Store dropdown input data as sorted.
    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);
    
    const [searchText, setSearchText] = useState('');

    // Use to set user selected items only!! To get selected items, use selectedItems.
    const [currentSelection, setCurrentSelection] = useState([]);

    // Use to get selected items only!! To set selected items, use setCurrentSelection() function.
    const selectedItems = useMemo(()=> {
        if (currentSelection.length > 0) {
            return currentSelection
                    .filter(currSelItem=> {
                        // Eliminate selected items currently not in the dropdown data.
                        return sortedData.findIndex(sortedItem=> (sortedItem === currSelItem)) >= 0;
                    })
                    .toSorted(compareFn);

        }
        
        return selectedData // Eliminate selected items currently not in the dropdown data.
                .filter(item=> sortedData.findIndex(stableItem=> (stableItem === item)) >= 0)
                .toSorted(compareFn);
    }, [sortedData, selectedData, currentSelection]);

    // Items matching text typed by the user.
    const searchItems = useMemo(()=> {
        if (searchText.length === 0)
            return [];

        // Obtain items matching the typed text.
        const searchTextUpperCase = searchText.toUpperCase();
        return sortedData.filter(item=> item.toUpperCase().includes(searchTextUpperCase));
    }, [searchText]);

    // List of items to display in the dropdown.
    const list = useMemo(()=> {
        if (searchText.length > 0)
            return searchItems;

        return sortedData;
    }, [searchText, sortedData]);

    const inputStyle = (()=> {
        const aStyle = { 
            backgroundColor: dropdownStyle?.backgroundColor,
            color: dropdownStyle?.color
        }
        if (dropdownStyle?.fontSize) {
            aStyle.fontSize = dropdownStyle?.fontSize;
        }
        return aStyle;
    })();
    const borderColor = dropdownStyle?.borderColor;

    /**Comparison function used in the sorting of dropdown elements. */
    function compareFn(item1, item2) {
        return compare(item1, item2, sortDirection);
    }
    
    /** Respond the user typing text to search for items */
    function handleSearch(e) {
        // As the user types, pop up the listbox with matching items. Close the listbox if there's no matching items.
        const text = e.target.value;
        setSearchText(text);
        if (list.length > 0)
            showList();
        else
            hideList();
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {
        let updatedItems = [ ...selectedItems ];
        if (!isSelected(clickedItem)) {
            // Get the allowed maximum number of selections.
            // Allow no more item selection if maximum number of selections reached
            if (maxNumSelections !== null && updatedItems.length >= maxNumSelections) {
                return;
            } // if (maxSelections !== null && selectedItems.length >= maxSelections)
            
            updatedItems.push(clickedItem);
        } // if (!isSelected(clickedItem)) {
        else { // Remove the item from the selected items.
            updatedItems = updatedItems.filter(item=> {
                return item !== clickedItem;
            });
        } // else

        // Update the selected items in the component.
        setCurrentSelection(updatedItems);
    } // function handleItemClick(e) {

    function isSelected(item) { 
    // Check whether an item is found in the list of selected items.
        return selectedItems.findIndex(selectedItem=> {
            return selectedItem === item;
        }) >= 0;
    } // function isSelected(item) {

    function removeItem(itemToRemove) {
        const updatedItems = selectedItems.filter(item=> {
            return item !== itemToRemove;
        });
        setCurrentSelection(prev=> updatedItems);
        if (onItemsSelected !== null)
            onItemsSelected(updatedItems);
    } // function removeItem(itemToRemove) {

    function toggleShowList() {
        if (!showItems)
            showList();
        else
            hideList();
    } // function toggleShowList() {

    function hideList() {
        setShowItems(false);
        if (onItemsSelected !== null)
            onItemsSelected(selectedItems); 
    } // function hideList() {

    function showList() {
        if (list.length > 0)
            setShowItems(true);
    } // function showList() {

    return (
        <div className={`dropdown-js dropdown-js-rounded 
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
            style={{ ...(isDisabled? { pointerEvents: 'none'}: {})}}>
            
            <div className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>
                <div>
                    <input className={`dropdown-js-input dropdown-js-rounded`}
                        id='multiselectionDropdownSearch' name='multiselectionDropdownSearch'
                        style={inputStyle}
                        type='text' autoComplete='off'
                        role='combobox'
                        aria-label={label}
                        aria-placeholder={`Type to search for ${label}`}
                        aria-autocomplete='list'
                        aria-controls='multiSelectionDropdown'
                        aria-expanded={showItems}
                        aria-haspopup='listbox'
                        onChange={e=> handleSearch(e)}
                        placeholder={`Type to Search for ${label}`} value={searchText}
                    />
                </div>
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded'
                     aria-expanded={showItems} aria-controls='multiSelectionDropdown' aria-label={`${label} options`}
                     onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>

            {/* Selected items */}
            <div className='dropdown-js-padding dropdown-js-selected-wrapper dropdown-js-selected-container'>
                <div id='multiSelectionDropdown-selectedItems' className='dropdown-js-selected-items'
                     aria-label={`Selected ${label} options`} aria-live='polite' >
                    {selectedItems.map((item)=> {                            
                            return ( 
                                <span key={`${item}`} className='dropdown-js-padding dropdown-js-rounded' 
                                      aria-label={`${item}`}
                                      style={{...inputStyle, margin: '3.5px', marginRight: '0px'}}>
                                    {item} <span style={{cursor: 'pointer'}} aria-label={`Remove ${item}`} onClick={e=> removeItem(item)}>{"\u00D7"}</span>
                                </span>
                            );
                        })
                    }
                </div>
            </div>

            {/* Dropdown items */}
            <div className={`dropdown-js-padding dropdown-js-menu dropdown-js-rounded ${(!showItems) && 'dropdown-js-hide'}`}
                 style={inputStyle} id='multiSelectionDropdown' name='multiSelectionDropdown'
                 role='listbox' aria-multiselectable={true} aria-expanded={showItems} >
                {list.map((item, index)=> {
                        return (
                            <div key={`${index}#${item}`} >
                                <input type='checkbox' name={`${item}Checkbox`} 
                                       role='option' aria-label={item} aria-checked={isSelected(item)}
                                       style={{cursor: 'pointer'}} checked={isSelected(item)} onChange={e=> handleItemClick(item)} value={item} />
                                <label style={{marginLeft: '5px'}} htmlFor={`${item}`}>{item}</label>
                                <hr style={{ backgroundColor: inputStyle.color, border: 'none', height: '0.5px'}}/>
                            </div>
                        );
                    }) // list.map((item, index)=> {
                }
                <button className='dropdown-js-padding dropdown-js-round' style={buttonStyle} aria-label={`Click to collapse ${label} options`}
                    title='Done' disabled={list.length === 0} onClick={e=> hideList()} type='button'>
                    Done
                </button>
            </div>
        </div>
    );
}

MultiSelectionDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    sortDirection: PropTypes.string,
    selectedData: PropTypes.array.isRequired,
    selectedItems: PropTypes.array,
    maxNumSelections: PropTypes.number,
    isDisabled: PropTypes.bool,
    onItemsSelected: PropTypes.func,
    dropdownStyle: PropTypes.shape({
        color: PropTypes.string.isRequired, // text color
        backgroundColor: PropTypes.string.isRequired,
        fontSize: PropTypes.string,
        borderColor: PropTypes.string
    }),
    buttonStyle: PropTypes.shape({
        color: PropTypes.string.isRequired, // text color
        backgroundColor: PropTypes.string.isRequired,
        fontSize: PropTypes.string,
        borderColor: PropTypes.string
    })
};

