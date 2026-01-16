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
 */
import PropTypes from 'prop-types';
import { useState, useEffect, useMemo } from 'react';
import './dropdown.css';
import { getPaths as getObjPaths, objCompare } from 'some-common-functions-js';


/** Provide a multi-selection, searchable dropdown that takes an array of objects.
 * @param {String} label for screen readers.
 * @param {Array<Object>} data An array of objects to display in the multiselection dropdown.
 * @param {string} sortFields An array specifiying the field plus sort order. e.g. [ 'score desc', 'lastName asc', 'firstName asc' ]
 * @param {Array<Object>} [selectedData=[]] pre-set array of selected items. Optional.
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
                    maxNumSelections = null,
                    displayName, // the name of the field that will be used for displaying the list items to the user.
                    valueName, // the name of the field that will be used as the underlying unique value of each list item.
                    isDisabled = false,
                    onItemsSelected = null,
                    dropdownStyle,
                    buttonStyle
                }) // If provided, use this function for sorting. Otherwise sort by displayName field.
{  
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide
    const [paths, setPaths] = useState('');

    const [searchText, setSearchText] = useState('');

    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);

    // Set items selected by the user.
    const [currentSelection, setCurrentSelection] = useState([]); // Use to set the user selection items only!! To get selected items, use selectedItems.

    const selectedItems = useMemo(()=> { // Use for getting selected items only!! To set usr selected items, use the setCurrentSelection() function.
        if (currentSelection.length > 0) {
            return currentSelection
                .filter(currSelItem=> {
                    return sortedData.findIndex(sortedItem=> {
                        const fieldPaths = getPaths();
                        return objCompare(currSelItem, sortedItem, ...fieldPaths) === 0;
                    }) >= 0;
                }) // eliminate selected items not in the dropdown data.
                .toSorted(compareFn);
        }

        return selectedData
                .filter(selItem=> {
                    return sortedData.findIndex(sortedItem=> {
                        const fieldPaths = getPaths();
                        return objCompare(selItem, sortedItem, ...fieldPaths) === 0;
                    }) >= 0;
                }) // eliminate selected items not in the dropdown data.
                .toSorted(compareFn);
    }, [sortedData, selectedData, currentSelection]);

    // List of items matching text typed by the user.
    const searchItems = useMemo(()=> {
        if (searchText.length === 0)
            return [];
        
        // Obtain items matching the typed text.
        const searchTextUpperCase = searchText.toUpperCase();
        return sortedData.filter(item=> {
            const itemValue = item[displayName].toUpperCase();
            return itemValue.includes(searchTextUpperCase);
        });
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
    
    useEffect(()=> {
        if (!displayName) // Make sure that displayName was provided.
            throw new Error('displayName must be provided');
        if (!valueName) // Make sure that the valueName was provided.
            throw new Error('valueName must be provided');    
    }, []); // useEffect(()=> {    

    /**Calculate the field paths of the objects displayed in the dropdown. */
    function getPaths() {
        let tempPaths = paths;
        if (!tempPaths) {
            if (data.length > 0)
                tempPaths = getObjPaths(data[0]);

            setPaths(tempPaths);
        }
        return tempPaths;
    }

    function compareFn(item1, item2) {
        return objCompare(item1, item2, ...sortFields);
    }

    /**Respond to the user typing text to search for matching items. */
    function handleSearch(e) {
        // As the user types, pop up the listbox with matching items. Close the listbox if there's no matching items.
        setSearchText(e.target.value);
        if (searchItems.length > 0)
            showList();
        else
            hideList();
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {
        let tempSelected = [...selectedItems];
        
        if (!isSelected(clickedItem)) { // Not amongst selected items
            // Get the allowed maximum number of selections.
            // Allow no more item selection if maximum number of selections reached
            if (maxNumSelections !== null && selectedItems.length >= maxNumSelections) {
                return;
            } // if (maxNumSelections !== null && selectedItems.length >= maxNumSelections)         
            
            tempSelected.push(clickedItem);
        } // if (!isSelected(clickedItem))
        else {  // if (selected(clickedItem)) // Amongst selected items.
            // Remove the item from the selected items.
            tempSelected = tempSelected.filter(item=> {
                const fieldPaths = getPaths();
                return objCompare(item, clickedItem, ...fieldPaths) !== 0;
            });    
        } // else
        setCurrentSelection(tempSelected);
    } // function handleItemClick(clickedItem) {

    function isSelected(item) {
        // Check whether an item is found in the list of selected items.
        const fieldPaths = getPaths();
        return selectedItems.findIndex(selectedItem=> {
            return (objCompare(selectedItem, item, ...fieldPaths) === 0);
        }) >= 0;
    } // function isSelected(item) {

    function removeItem(itemToRemove) {
        const paths = getPaths(selectedItems);
        const updatedItems = selectedItems.filter(item=> {
            return objCompare(item, itemToRemove, ...paths) !== 0;
        }); // remove the item marked for removal from selected items.

        setCurrentSelection(updatedItems);
        if (onItemsSelected !== null)
            onItemsSelected(updatedItems);
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
                    <input  
                        id='multiSelectionDropdownObjSearch'
                        name='multiSelectionDropdownObjSearch'
                        className={`dropdown-js-input dropdown-js-rounded`}
                        style={inputStyle}
                        aria-label={label}
                        aria-autocomplete='list'
                        aria-controls='multiSelectionDropdownObj'
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
                <div id='multiSelectionDropdownObj' className='dropdown-js-selected-items'
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
                 style={inputStyle} id='multiSelectionDropdownObj' name='multiSelectionDropdownObj'
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
                    title='Done' disabled={list.length === 0} aria-label={`Close ${label} options`} onClick={e=> hideList()} type='button'>
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
