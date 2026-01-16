/**
 * File: ./src/dropdowns/Dropdown.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a single selection searchable dropdown that takes an array of primitive types.
 * * --------------------------------------------------------------------------------
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
 */
import PropTypes from 'prop-types';
import { useState, useMemo } from 'react';
import './dropdown.css';
import { compare } from 'some-common-functions-js';

/**Single selection dropdown component.
 * @param {string} label name of the data items.
 * @param {array} data  primitve type array data items.
 * @param {string} [sortOrder='asc'] sort order. Default 'asc'.
 * @param {function} [onItemSelected=null] callback function passed by the parent component. Optional.
 * @param {null} [selected=null] default selected item. Must be one of data array elements. Optional.
 * @param {boolean} [isDisabled=false] optional. Set to true if you want to disable component.
 * @param {Function} [onItemsSelected=null] Callback function to call when selection is complete. Optional.
 * @param {object} dropdownStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional).
 * @param {object} buttonStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional).
 */
export function Dropdown({
                    label, // label with which to describe the dropdown.
                    data, // Primitive type array.
                    sortOrder = 'asc',
                    onItemSelected = null, // Function to pass on the value of the selected item to the parent component
                    selected = null, // Initial selected item.
                    dropdownStyle, // Styling object with fields {color, backgroundColor, borderColor (optional), fontSize}.
                    isDisabled = false})
{
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide dropdown items.
    const [searchText, setSearchText] = useState('');

    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);

    // Dropdown items matching text typed by the user.
    const searchItems = useMemo(()=> {
        if (searchText.length === 0)
            return [];
        const searchTextUppercase = searchText.toUpperCase();
        return sortedData.filter(item=> item.toUpperCase().includes(searchTextUppercase));
    }, [sortedData, searchText]);

    // Items to display in the dropdown.
    const list = useMemo(()=> {
        if (searchText.length === 0)
            return sortedData;

        return searchItems;
    }, [sortedData, searchText]);

    // Text to display in the textbox. Could be search text or currently selected item.
    const [displayValue, setDisplayValue] = useState('');

    // Use to set the user selected item only!! For getting the currently selected use selectedItem.
    const [currSelected, setCurrSelectedItem] = useState(null);

    // Use to get the currently selected item. To set the user selected item, use setCurrSelectedItem() function.
    const selectedItem = useMemo(()=> {
        let selItem = '';
        if (currSelected) {
            selItem = currSelected;
        }
        else if (selected) {
            const idx = data.findIndex(item=> item === selected);
            if (idx >= 0)
                selItem = data[idx];
        }
        setDisplayValue(selItem);
        return selItem;
    }, [selected, currSelected]);

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

    /**Comparison function to be used in sorting dropdown items according to the specified sort direction */
    function compareFn(item1, item2) {
        return compare(item1, item2, sortOrder);
    }

    /**Respond to the user typing text to search for items */
    function handleSearch(e) {
        // As the user types, pop up the listbox with matching items, otherwise close the listbox if there's no matching items.
        setSearchText(e.target.value);
        setDisplayValue(e.target.value);
        
        if (searchItems.length === 0)
            hideList();
        else
            showList();
    } // function handleSearch(e)

    async function handleItemClick(value) {
        setDisplayValue(value);
        setSearchText('');

        setCurrSelectedItem(value);
        if (onItemSelected !== null)
            onItemSelected(value); // Alert the parent component that a value has been selected.
        hideList();
    } // function handleItemClick(e) {

    function toggleShowList() {
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

    return (
        <div className={`dropdown-js dropdown-js-rounded
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
             style={{...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>                
                <input 
                     id='dropdownSearch' name='dropdownSearch'
                    className={`dropdown-js-input dropdown-js-rounded`} autoComplete='off'
                    type='text'
                    style={inputStyle}
                    role='combobox'
                    aria-placeholder={`Type to Search for ${label}`}
                    aria-required={true} 
                    aria-controls='dropdown'
                    aria-autocomplete='list'
                    aria-haspopup={'listbox'}
                    aria-expanded={showItems}
                    onChange={e=> handleSearch(e)}
                    disabled={isDisabled} placeholder={`Type to Search for ${label}`} value={displayValue}
                />
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded'
                     aria-expanded={showItems} aria-controls='multiSelectionDropdown' aria-label={`${label} options`}
                     onClick={e=> toggleShowList(e)}
                >
                    <span className='dropdown-js-arrow dropdown-js-padding'
                          aria-label={`${label} options`} aria-expanded={showItems} >{!showItems? "+" : "-"}</span>
                </div>
            </div>
           
            <div className={`dropdown-js-padding dropdown-js-menu ${(!showItems) && 'dropdown-js-hide'}`}
                 id='dropDown' name='dropDown' 
                 role='listbox' aria-expanded={showItems} 
                 disabled={isDisabled} aria-label={label} style={{...inputStyle, marginTop: '3.5px'}}
            >
                {list.map((item, index)=> {
                        return (
                            <div name={item} key={`${index}#${item}`} 
                                 role='option' aria-label={item}
                                 style={{cursor: 'pointer'}} onClick={e=> handleItemClick(item)}
                            >
                                {item}
                                {(index < list.length - 1) &&
                                    <hr style={{borderColor: inputStyle.color}}/>
                                }
                            </div>
                        );
                    }) // list.map(item=> {
                }
            </div>
        </div>
    );
}

Dropdown.propTypes = {
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
