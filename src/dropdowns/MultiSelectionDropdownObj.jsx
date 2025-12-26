/**
 * File: ./src/dropdowns/MultiSelectionDropdownObj.jsx
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a multi-selection, searchable dropdown that takes an array of objects.
 * A developer must specify which field name to use for displaying (the displayName), and which field name  (valueName) to use as value selected.
 * * --------------------------------------------------------------------------------
 * Date        Dev    Version Description
 * 2024/02/07  ITA    1.00    Genesis.
 * 2024/09/18  ITA    1.01    Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                           Adjust width and add borders.
 *                           Import context directly. Variable names moved to VarNames object.
 * 2024/10/28  ITA    1.02   Improve the responsiveness of the dropdown.
 * 2025/12/21  ITA    1.03   Performed further tweaks and tests, preparing this component for npm publishing. 
 * 2025/12/26  ITA    1.04   Changed the arrow symbols to + and - for better cross-platform rendering.
 */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useCollectionsContext } from './CollectionsProvider';
import './dropdown.css';

export function MultiSelectionDropdownObj({
                    label, // label with which to describe the dropdown.
                    collectionName,
                    displayName, // the name of the field that will be used for displaying the list items to the user.
                    valueName, // the name of the field that will be used as the underlying unique value of each list item.
                    isDisabled = false,
                    onItemsSelected = null,
                    dropdownStyle,
                    buttonStyle
                }) // If provided, use this function for sorting. Otherwise sort by displayName field.
{

    const { collectionExists, getCollectionData, setSelected, getSelected, getMaxNumSelections } = useCollectionsContext();
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide 
    const [list, setList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [listKey, setListKey] = useState(Math.random());
    const [selectedItemsKey, setSelectedItemsKey] = useState(Math.random);
    const keyStep = 0.000000000001;

    const [inputStyle] = useState(()=> {
        const aStyle = { 
            backgroundColor: dropdownStyle?.backgroundColor,
            color: dropdownStyle?.color
        }
        if (dropdownStyle?.fontSize) {
            aStyle.fontSize = dropdownStyle?.fontSize;
        }
        return aStyle;
    });
    const borderColor = dropdownStyle?.borderColor;
    
    useEffect(()=> {
        // If collection by the given name not yet added.
        if (!collectionExists(collectionName))
            return;
    
        // collection added, populate data.

        if (!displayName) // Make sure that displayName was provided.
            throw new Error('displayName must be provided');
        if (!valueName) // Make sure that the valueName was provided.
            throw new Error('valueName must be provided');

        const result = [...getCollectionData(collectionName)];

        // Make sure that all the collection elements do have the fields specified by valueName and displayName.
        result.forEach((item, index)=> {
            if (!item[displayName]) {
                throw new Error(`Error in collection ${collectionName}, index ${index}:
                                 field ${displayName} found`);
            }
            if (!item[valueName]) {
                throw new Error(`Error in collection ${collectionName}, index ${index}:
                                 field ${valueName} not found`);
            }
        });

        // Populate data.
        setList(result);
        const selItems = [...getSelected(collectionName)];
        setSelectedItems(selItems);
    }, [collectionExists(collectionName)]); // useEffect(()=> {

    function handleSearch(e) {
        setSearchText(e.target.value);
        const result = [...getCollectionData(collectionName).filter(item=> {
                            const itemValue = item[displayName].toUpperCase();
                            const targetValue = e.target.value.toUpperCase();
                            return itemValue.includes(targetValue);
                        })];
        setList(result);
        if (result.length > 0)
            showList();
        else
            hideList();

        setListKey(listKey + keyStep);
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {

        let updatedItems = [...selectedItems];
        
        if (!isSelected(clickedItem)) { // Not amongst selected items
            // Get the allowed maximum number of selections.
            // Allow no more item selection if maximum number of selections reached
            const maxSelections = getMaxNumSelections(collectionName); // Get the allowed maximum number of selections.
            
            if (maxSelections !== null && selectedItems.length >= maxSelections) {
                return;
            } // if (maxSelections !== null && selectedItems.length >= maxSelections)            
            
            updatedItems.push(clickedItem);
        } // if (!isSelected(clickedItem))
        else {  // if (selected(clickedItem)) // Amongst selected items.
            // Remove the item from the selected items.
            updatedItems = updatedItems.filter(item=> {
                return JSON.stringify(item) !== JSON.stringify(clickedItem);
            });    
        } // else
      
        // Update the selected items in the collection.
        setSelected(collectionName, updatedItems);
        // Update the selected items in the component.
        setSelectedItems(updatedItems);
        setSelectedItemsKey(selectedItemsKey + keyStep);
    } // function handleItemClick(clickedItem) {

    function isSelected(item) {
        // Check whether an item is found in the list of selected items.
        return selectedItems.findIndex(selectedItem=> {
            return JSON.stringify(selectedItem) === JSON.stringify(item);
        }) >= 0;
    } // function isSelected(item) {

    function removeItem(itemToRemove) {
        const updatedItems = selectedItems.filter(item=> {
            return JSON.stringify(item) !== JSON.stringify(itemToRemove);
        }); // remove the item marked for removal from selected items.

        setSelectedItems(updatedItems);
        setSelected(collectionName, updatedItems); // Update the selected items in the collection.
        // For re-render of the selected items in the component.
        setSelectedItemsKey(selectedItemsKey + keyStep); 

        if (onItemsSelected !== null)
            onItemsSelected();

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
            onItemsSelected();
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
                            style={inputStyle}
                            type='text' id='searchDropDown' name='searchDropDown' autoComplete='off'
                            aria-label={`Type to Search for ${label}`} aria-required={true} onChange={e=> handleSearch(e)}
                            placeholder='Type to search' value={searchText} />
                </div>
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded' onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>

            { /* Selected items */}
            <div className='dropdown-js-padding dropdown-js-selected-wrapper dropdown-js-selected-container'>
                <div className='dropdown-js-selected-items' key={selectedItemsKey}>
                    {selectedItems.map(item=> {                            
                            return ( 
                                <span key={`${item[valueName]}${item[displayName]}`} className='dropdown-js-padding dropdown-js-rounded' 
                                    style={{...inputStyle, margin: '3.5px', marginRight: '0px'}}>
                                    {item[displayName]} <span className='dropdown-js-padding' style={{cursor: 'pointer'}} onClick={e=> removeItem(item)}>{"\u00D7"}</span>
                                </span>
                            );
                        })
                    }
                </div>
            </div>

            { /* Dropdown items */}            
            <div className={`dropdown-js-padding dropdown-js-menu dropdown-js-rounded ${(!showItems) && 'dropdown-js-hide'}`}
                 style={inputStyle} id='dropDown' name='dropDown' aria-label={label} 
                 key={listKey} >
                {list.map((item)=> {
                                    return (
                                        <div key={`${item[valueName]}${item[displayName]}`} aria-label={item[displayName]} >
                                            <input type='checkbox'name={`${item[displayName]}Checkbox`} 
                                                    style={{cursor: 'pointer'}} checked={isSelected(item)} onChange={e=> handleItemClick(item)} value={item[valueName]} />
                                            <label style={{marginLeft: '5px'}} htmlFor={`${item[displayName]}`}>{item[displayName]}</label>
                                            <hr style={{borderColor: inputStyle.color}}/>
                                        </div>
                                    );
                                }) // list.map(item=> {
                }

                <button className='dropdown-js-padding dropdown-js-round' style={buttonStyle}
                    title='Done' disabled={list.length === 0} onClick={e=> hideList()} type='button'>
                    Done
                </button>
            </div>
        </div>
    );
}

MultiSelectionDropdownObj.propTypes = {
    label: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    valueName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    selectedItem: PropTypes.array,
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
