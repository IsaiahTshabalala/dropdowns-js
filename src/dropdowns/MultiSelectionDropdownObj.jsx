/**
 * File: ./src/dropdowns/MultiSelectionDropdownObj.jsx
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a multi-selection, searchable dropdown that takes an array of objects.
 * A developer must specify which field name to use for displaying (the displayName), and which field name  (valueName) to use as value selected.
 * * --------------------------------------------------------------------------------
 * Start Date  End Date    Dev    Version Description
 * 2024/02/07              ITA    1.00    Genesis.
 * 2024/09/18              ITA    1.01    Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                                        Adjust width and add borders.
 *                                        Import context directly. Variable names moved to VarNames object.
 * 2024/10/28              ITA    1.02    Improve the responsiveness of the dropdown.
 * 2025/12/21              ITA    1.03    Performed further tweaks and tests, preparing this component for npm publishing. 
 * 2025/12/26              ITA    1.04    Changed the arrow symbols to + and - for better cross-platform rendering.
 * 2025/12/29              ITA    1.05    Placeholder to show the name of the data, as provided by the label attribute.
 * 2026/01/11  2026/01/16  ITA    1.06    Improved the component so that it stores its own data instead of relying on the Collections context provider.
 * 2026/01/19  2026/01/19  ITA    1.07    Used useId() to ensure the uniqueness of ids of the concerned html elements even when the component is used multiple times in the same page.
 * 2026/01/20  2026/02/01  ITA    1.08    Added a 'selReset' attribute. When set to true, the dropdown updates to the default selected items when this value changes in the parent component.
 *                                        Combined list and searchItems state variables into one: list.
 *                                        Improved the logic for setting selected items.
 */
import PropTypes from 'prop-types';
import { useState, useMemo, useId, useEffect } from 'react';
import './dropdown.css';
import { getPaths as getObjPaths, objCompare } from 'some-common-functions-js';

/** Provide a multi-selection, searchable dropdown that takes an array of objects.
 * @param {String} label for screen readers.
 * @param {Array<Object>} data An array of objects to display in the multiselection dropdown.
 * @param {string} sortFields An array specifiying the field plus sort order. e.g. [ 'score desc', 'lastName asc', 'firstName asc' ]
 * @param {Array<Object>} [selectedData=[]] pre-set array of selected items. Optional.
 * @param {boolean} [selReset=false] When set to true, the dropdown resets to the default selected items when they are updated in the parent component.
 * @param {String} displayName the name of the field that will be used for displaying items in the dropdown.
 * @param {String} valueName  // the name of the field that will be used as the underlying unique value of each list item.
 * @param {Number} [maxNumSelections=null] allowed maximum number of selections. Optional.
 * @param {Boolean} [isDisabled=false] optional. Set to true if you want to disable component.
 * @param {null} [onItemsSelected=null] Callback function to call when selection is complete. Optional.
 * @param {Object} dropdownStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional)
 * @param {Object} buttonStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional) 
*/
export function MultiSelectionDropdownObj({
                    label, // label with which to describe the dropdown.
                    data,
                    sortFields,
                    selectedData = [],
                    selReset = false,
                    maxNumSelections = null,
                    displayName, // the name of the field that will be used for displaying the list items to the user.
                    valueName, // the name of the field that will be used as the underlying unique value of each list item.
                    isDisabled = false,
                    onItemsSelected = null,
                    dropdownStyle,
                    buttonStyle
                }) // If provided, use this function for sorting. Otherwise sort by displayName field.
{  
    const uid = useId(); // unique id.
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide

    // field paths of the objects in the data array.
    const fieldPaths = useMemo(()=> (data.length > 0? getObjPaths(data[0]) : []), [data]);

    const [searchText, setSearchText] = useState('');

    // Store dropdown input data as sorted.
    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);

    const [selKey, setSelKey] = useState(0); // If greater than 0, an indicator that the user has completed a selection.

    // Set items selected by the user.
    const [currentSelection, setCurrentSelection] = useState(null); // Use to set the user selection items only!! To get selected items, use selectedItems.

    const selectedItems = useMemo(()=> {        
        // If selReset is true, then always return the default selected items (selectedData).
        // If the user has not made any selection/deselection yet, return selectedData (default selection).
        // Else return the items selected by the user (currentSelection).
        let tempSelected = ((selReset === false) && currentSelection)? [...currentSelection] : [...selectedData];
        tempSelected = tempSelected
                        .filter(selItem=> {
                            return sortedData.some(sortedItem=>
                                (objCompare(selItem, sortedItem, ...fieldPaths) === 0)
                            );
                        }); // eliminate selected items not in the dropdown data.
        // Enforce maximum number of selections if specified.
        if (maxNumSelections && (tempSelected.length > maxNumSelections)) {
            tempSelected = tempSelected.slice(0, maxNumSelections - 1);
        }
        return tempSelected.toSorted(compareFn);
    }, [sortedData, selectedData, currentSelection]);

    useEffect(()=> {
        if ((selKey >  0) && currentSelection && onItemsSelected) {
            onItemsSelected([...selectedItems]); // Call the callback function when user has made a selection.
        }
    }, [selKey]);

    // List of items matching text typed by the user.
    const list = useMemo(()=> {
        // Obtain items matching the typed text.
        const searchTextUpperCase = searchText.toUpperCase();
        if (searchTextUpperCase.length === 0)
            return sortedData;

        return sortedData.filter(item=> {
            const itemValue = item[displayName].toUpperCase();
            return itemValue.includes(searchTextUpperCase);
        });
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

    /**Comparison function for sorting items. */
    function compareFn(item1, item2) {
        return objCompare(item1, item2, ...sortFields);
    }

    /**Respond to the user typing text to search for matching items. */
    function handleSearch(e) {
        // As the user types, pop up the listbox with matching items. Close the listbox if there's no matching items.
        setSearchText(e.target.value);
        showList();
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {
        if (selReset) // Selected items set by the parent component. Do not allow user selection.
            return;
        
        setCurrentSelection(prev=>{
            let tempSelected = (prev)? [...prev] : [...selectedItems];
            if (!(tempSelected.some(selItem=> // clicked item not found in the list of selected items.
                (objCompare(selItem, clickedItem, ...fieldPaths) === 0)
            ))) {
                // Allow item selection only if maxNumSelections has not been reached.
                if (maxNumSelections === null || tempSelected.length < maxNumSelections)
                    tempSelected.push(clickedItem);
            }
            else {  // if (selected(clickedItem)) // Amongst selected items.
                // Remove the item from the selected items.
                tempSelected = tempSelected.filter(item=> (
                    objCompare(item, clickedItem, ...fieldPaths) !== 0
                ));    
            } // else
            return tempSelected;
        });
    } // function handleItemClick(clickedItem) {
    
    function isSelected(item) {
        // Check whether an item is found in the list of selected items.
        return selectedItems.some(selectedItem=> {
            return (objCompare(selectedItem, item, ...fieldPaths) === 0);
        });
    } // function isSelected(item) {

    function removeItem(itemToRemove) {
        if (selReset) // Selected items set by the parent component. Do not allow user selection.
            return;
        
        setCurrentSelection(prev=> {
            let tempSelected = (prev)? [...prev] : [...selectedItems]; 
            tempSelected = tempSelected.filter(selItem=> (
                objCompare(selItem, itemToRemove, ...fieldPaths) !== 0
            ));
            return tempSelected;
        });
        setSelKey(prev=> prev + 1); // trigger useEffect to call the callback function.
    } // function removeItem(item) {

    function toggleShowList() {
        if (!showItems) {
            showList();
        }
        else
            hideList();
    } // function toggleShowList() {

    function hideList() {
        setShowItems(false);
        setSelKey(prev=> prev + 1); // trigger useEffect to call the callback function.
    } // function hideList() {

    function showList() {
        if (list.length > 0)
            setShowItems(true);
    } // function showList() {

    const ids = {
        multiSelectionDropdownObjSearch: `multiSelectionDropdownSearch-${uid}`,
        multiSelectionDropdownObj: `multiSelectionDropdown-${uid}`,
        selectedItems: `selectedItems-${uid}`
    };

    return (
        <div className={`dropdown-js dropdown-js-rounded 
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
            style={{ ...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>
                <div>
                    <input  
                        id={ids.multiSelectionDropdownObjSearch}
                        name='multiSelectionDropdownObjSearch'
                        className={`dropdown-js-input dropdown-js-rounded`}
                        style={inputStyle}
                        aria-label={label}
                        aria-autocomplete='list'
                        aria-controls={ids.multiSelectionDropdownObj}
                        role='combobox'
                        aria-expanded={showItems}
                        aria-haspopup='listbox'
                        type='text' autoComplete='off'
                        aria-placeholder={`Type to Search for ${label}`} onChange={e=> handleSearch(e)}
                        placeholder={`Type to Search for ${label}`} value={searchText}
                    />
                </div>
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded'
                     aria-expanded={showItems} aria-controls='multiSelectionDropdownObj' aria-label={`${label} options`}
                     onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>

            { /* Selected items */}
            <div className='dropdown-js-padding dropdown-js-selected-wrapper dropdown-js-selected-container'>
                <div id={ids.selectedItems} className='dropdown-js-selected-items'
                     aria-label={`Selected ${label} options`} aria-multiselectable={true} aria-live='polite' >
                    {selectedItems.map(item=> {                            
                            return ( 
                                <span key={`${item[valueName]}${item[displayName]}`} className='dropdown-js-padding dropdown-js-rounded' 
                                    aria-label={`${item[displayName]}`}
                                    style={{...inputStyle, margin: '3.5px', marginRight: '0px'}}>
                                    {item[displayName]} <span className='dropdown-js-padding' style={{cursor: 'pointer'}} aria-label={`Remove ${item[displayName]}`} onClick={e=> removeItem(item)}>{"\u00D7"}</span>
                                </span>
                            );
                        })
                    }
                </div>
            </div>

            { /* Dropdown items */}            
            <div className={`dropdown-js-padding dropdown-js-menu dropdown-js-rounded ${(!showItems) && 'dropdown-js-hide'}`}
                 style={inputStyle} id={ids.multiSelectionDropdownObj} name='multiSelectionDropdownObj'
                 role='listbox' aria-multiselectable={true} aria-expanded={showItems}  >
                {list.map((item)=> {
                                    return (
                                        <div key={`${item[valueName]}${item[displayName]}`} >
                                            <input id={`${item[valueName]}Checkbox`} type='checkbox'name={`${item[displayName]}Checkbox`}
                                                    role='option' aria-label={`${item[displayName]}`} aria-checked={isSelected(item)}
                                                    style={{cursor: 'pointer'}} checked={isSelected(item)} onChange={e=> handleItemClick(item)} value={item[valueName]} />
                                            <label style={{marginLeft: '5px'}} htmlFor={`${item[valueName]}`}>{item[displayName]}</label>
                                            <hr style={{ backgroundColor: inputStyle.color, border: 'none', height: '0.5px'}}/>
                                        </div>
                                    );
                                }) // list.map(item=> {
                }

                <button className='dropdown-js-padding dropdown-js-round' style={buttonStyle}
                    title='Done' aria-label={`Close ${label} options`} onClick={e=> hideList()} type='button'>
                    Done
                </button>
            </div>
        </div>
    );
}

MultiSelectionDropdownObj.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedData: PropTypes.arrayOf(PropTypes.object),
    selReset: PropTypes.bool,
    maxNumSelections: PropTypes.number,
    displayName: PropTypes.string.isRequired,               
    valueName: PropTypes.string.isRequired,
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
