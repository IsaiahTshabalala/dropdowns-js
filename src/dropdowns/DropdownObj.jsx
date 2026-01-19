/**
 * File: ./src/dropdowns/DropdownObj.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a single selection, searchable dropdown that takes an array of objects.
 * A developer must specify which field name to use for displaying (the displayName), and which field name to use as value (valueName).
 * * --------------------------------------------------------------------------------
 * Start Date  End Date      Dev    Version Description
 * 2023/12/19                ITA    1.00    Genesis.
 * 2024/06/18                ITA    1.01    Add version number.
 * 2024/07/14                ITA    1.02    Use the underlying field value (valueName) as the key when displaying collection items.
 * 2024/09/17                ITA    1.03    Toggle (add/remove) class name (w3-show) for displaying list items. Remove the extra style attribute.
 *                                          Adjust width and add borders.
 *                                          Import context directly.
 * 2024/10/11                ITA    1.04    Reduce the width of the text box so that it appears side by side with the drop-down on even smaller screens.
 * 2024/10/28                ITA    1.05    Improve the responsiveness of the dropdown.
 * 2025/12/18                ITA    1.06    Renamed to from Dropdown2 to DropdownObj, and performed further tweaks and tests towards preparing this component
 *                                          for npm publishing.
 * 2025/12/26                ITA    1.07    Changed the arrow symbols to + and - for better visibility across different platforms.
 * 2025/12/29                ITA    1.08    Placeholder must show the name of the data as provided by the label attribute.
 * 2026/01/11   2026/01/16   ITA    1.09    Improved the component so that it stores its own data instead of relying on the Collections context provider.
 * 2026/01/19   2026/01/19   ITA    1.10    Used useId() to ensure the uniqueness of ids of the concerned html elements even when the component is used multiple times in the same page.
*/
import PropTypes from 'prop-types';
import { useId, useMemo, useState } from 'react';
import './dropdown.css';
import { get, getPaths as getObjPaths, objCompare} from 'some-common-functions-js'

/** Provide a multi-selection, searchable dropdown that takes an array of objects.
 * @param {String} label for screen readers.
 * @param {Array<Object>} data An array of objects to display in the multiselection dropdown.
 * @param {string} sortFields An array specifiying the field plus sort order. e.g. [ 'score desc', 'lastName asc', 'firstName asc' ]
 * @param {Array<Object>} [selected=null] pre-set selected item. Optional.
 * @param {String} displayName the name of the field that will be used for displaying items in the dropdown.
 * @param {String} valueName  the name of the field that will be used as the underlying unique value of each list item.
 * @param {Boolean} [isDisabled=false] optional. Set to true if you want to disable component.
 * @param {null} [onItemSelected=null] Callback function to call when selection is complete. Optional.
 * @param {Object} dropdownStyle styling object with attributes color, backgroundColor, fontSize (optional), borderColor (optional)
*/
export function DropdownObj({
                    label, // label with which to describe the dropdown.
                    data,
                    sortFields,
                    selected = null,
                    displayName, // the name of the field that will be used for displaying the list items to the user.
                    valueName, // the name of the field that will be used as the underlying unique value of each list item.
                    isDisabled = false,
                    onItemSelected = null,
                    dropdownStyle
                })
{
    const uid = useId();
    const [showItems, setShowItems] = useState(null); // true or false. Show or hide dropdown items.
    const [paths, setPaths] = useState('');
    const [searchText, setSearchText] = useState('');

    const sortedData = useMemo(()=> {
        return data.toSorted(compareFn);
    }, [data]);

    // Items matching the text typed by the user.
    const searchItems = useMemo(()=> {
        if (searchText.length === 0)
            return [];
        
        // Obtain items matching the typed text.
        const searchTextUpperCase = searchText.toUpperCase();
        return sortedData.filter(item=> {
            const itemValue = item[displayName].toUpperCase();
            return itemValue.toUpperCase().includes(searchTextUpperCase);
        });
    }, [searchText]);

    const [displayValue, setDisplayValue] = useState(''); // Text to display in the textbox, could be the selected item or search text typed by the user.

     // Use to set the user selected item only!! To get the selected item, use selectedItem
    const [currSelectedItem, setCurrSelectedItem] = useState(null);

     // Use to get the selected item only!! To set the selected item, use setCurrSelectedItem() function.
    const selectedItem = useMemo(()=> {
        let selItem;
        if (currSelectedItem) {
            selItem = { ...currSelectedItem };
        }
        else if (selected) {
            const fieldPaths = getPaths();
            const idx = data.findIndex(item=> get(item, ...fieldPaths) === get(selected, ...fieldPaths));
            if (idx >= 0)
                selItem = data[idx];
        }
        if (selItem)
            setDisplayValue(selItem[displayName]);

        return selItem;
    }, [selected, currSelectedItem]);

    // Items to display in the dropdown list.
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

    /**Respond to the user typing text to search for dropdown items */
    async function handleSearch(e) {
        // As the user types, 
        setSearchText(prev=> e.target.value);
        setDisplayValue(prev=> e.target.value);
        if (searchItems.length > 0)
            showList();
        else
            hideList();
    } // function handleSearch(e)

    /**Comparison function used in the sorting of dropdown elements. */
    function compareFn(item1, item2) {
        return objCompare(item1, item2, ...sortFields);
    }

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

    /**Respond to selection of an item */
    function handleItemClick(clickedItem) {
        setCurrSelectedItem(clickedItem);

        if (onItemSelected !== null)
            onItemSelected(clickedItem); // Alert the parent component that a new selection was made.
        
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
    }

    const ids = {
        dropdownSearch: `dropdownObjSearch-${uid}`,
        dropdownObj: `dropdownObj-${uid}`
    };

    return (
        <div className={`dropdown-js dropdown-js-rounded
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
             style={{...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div  className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>
                <input 
                    id={ids.dropdownSearch} name='dropdownObjSearch'
                    className={`dropdown-js-input dropdown-js-rounded`}
                    style={inputStyle}
                    type='text' autoComplete='off'
                    role='combobox'
                    aria-autocomplete='list'
                    aria-controls={ids.dropdownObj}
                    aria-expanded={showItems}
                    aria-placeholder={`Type to Search for ${label}`} aria-required={true} onChange={e=> handleSearch(e)}
                    disabled={isDisabled}
                    placeholder={`Type to Search for ${label}`} value={displayValue}
                />
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded'
                    aria-label={`${label} options`} aria-expanded={showItems} onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>
            
            <div className={`dropdown-js-padding dropdown-js-menu ${(!showItems) && 'dropdown-js-hide'}`}
                 id={ids.dropdownObj} name='dropDownObj' 
                 role='listbox' aria-expanded={showItems} style={{...inputStyle, marginTop: '3.5px'}} >
                {list.map((item, index)=> {
                        return (
                            <div name={item[displayName]} key={`${item[valueName]}${index}`}
                                role='option'
                                aria-label={item[displayName]} 
                                style={{cursor: 'pointer'}}
                                onClick={e=> handleItemClick(item)}>
                                {item[displayName]}
                                {(index < list.length - 1) &&
                                    <hr style={{borderColor: inputStyle.color}}/>
                                }
                            </div>
                        );
                    }) // list.map((item)=> {
                }
            </div>
        </div>
    );
}

DropdownObj.propTypes = {
    label: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    sortFields: PropTypes.arrayOf(PropTypes.string).isRequired,
    selected: PropTypes.object,
    displayName: PropTypes.string.isRequired,               
    valueName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    onItemSelected: PropTypes.func,
    dropdownStyle: PropTypes.shape({
        color: PropTypes.string.isRequired, // text color
        backgroundColor: PropTypes.string.isRequired,
        fontSize: PropTypes.string,
        borderColor: PropTypes.string
    })
};
