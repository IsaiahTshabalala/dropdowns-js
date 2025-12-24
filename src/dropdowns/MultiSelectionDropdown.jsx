/**
 * File: ./src/components/MultiSelectionDropdown.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a multi-selection, searchable dropdown that takes an array of primitve types.
 * * --------------------------------------------------------------------------------
 * Date        Dev    Version   Description
 * 2024/02/27  ITA    1.00      Genesis.
 * 2024/09/17  ITA    1.02      Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                              Adjust width and add borders.
 *                              Import context directly. Variable names moved to VarNames object.
 * 2024/10/28  ITA    1.03      Improve the responsiveness of the dropdown.
*  2025/12/18  ITA    1.06      Performed further tweaks and tests, to prepare this component for npm publishing.
 */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useCollectionsContext } from './CollectionsProvider';
import './dropdown.css';

export function MultiSelectionDropdown({
                    label, // label with which to describe the dropdown.
                    collectionName,
                    isDisabled = false,
                    onItemsSelected = null,
                    dropdownStyle,
                    buttonStyle // Styling for the DONE button
                })
{

    const { getCollectionData, setSelected, getSelected, getMaxNumSelections, collectionExists } = useCollectionsContext();
    const [showItems, setShowItems] = useState(false); /* true or false: show or hide dropdown items */
    const [list, setList] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [listKey, setListKey] = useState(Math.random()); // To be used to cause the re-render of selected items in the drop-down.
    const [selectedItemsKey, setSelectedItemsKey] = useState(Math.random()); // To be used to cause the re-render of the drop-down items.
    const keyStep = 0.001;
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

        // Collection added. Populate data.
        setList(getCollectionData(collectionName));
        const selItems = getSelected(collectionName); // Get the collection's selected items.
        setSelectedItems(selItems);
    }, [collectionExists(collectionName)]); // useEffect(()=> {

    /** Respond to text being typed in the input box */
    function handleSearch(e) {
        setSearchText(e.target.value);

        // Obtain items matching the typed text.
        let result = getCollectionData(collectionName).filter(item=> {
                        const itemValue = item.toUpperCase();
                        const targetValue = e.target.value.toUpperCase();
                        return itemValue.includes(targetValue);
                    });

        setList(result);
        if (result.length > 0)
            showList(); // Show list only if there were matching items.
        else
            hideList();

        setListKey(listKey + keyStep); // Cause re-render of drop-down items.
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {
        let updatedItems = [...selectedItems];
        if (!isSelected(clickedItem)) {
            // Get the allowed maximum number of selections.
            // Allow no more item selection if maximum number of selections reached
            const maxSelections = getMaxNumSelections(collectionName);
            if (maxSelections !== null && selectedItems.length >= maxSelections) {
                return;
            } // if (maxSelections !== null && selectedItems.length >= maxSelections)

            updatedItems.push(clickedItem);
        } // if (!isSelected(clickedItem)) {
        else { // Remove the item from the selected items.
            updatedItems = updatedItems.filter(item=> {
                return item !== clickedItem;
            });
        } // else

        // Update the selected items in the collection.
        setSelected(collectionName, updatedItems);
        // Update the selected items in the component.
        setSelectedItems(updatedItems);
        // Force re-render.
        setSelectedItemsKey(selectedItemsKey + keyStep);
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
        setSelectedItems(updatedItems);
        setSelectedItemsKey(selectedItemsKey + keyStep);
        setSelected(collectionName, updatedItems); // collectionsContext update. Set the selected items.

        if (onItemsSelected !== null)
            onItemsSelected();
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
                            aria-label={`Type to search for ${label}`} aria-required={true} onChange={e=> handleSearch(e)}
                            placeholder='Type to search' value={searchText} />
                </div>
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded' onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "\u25BE" : "\u25B4"}</span>
                </div>
            </div>

            {/* Selected items */}
            <div className='dropdown-js-padding dropdown-js-selected-wrapper dropdown-js-selected-container'>
                <div className='dropdown-js-selected-items' key={selectedItemsKey}>
                    {selectedItems.map((item, index)=> {                            
                            return ( 
                                <span key={`${item}`} className='dropdown-js-padding dropdown-js-rounded' 
                                      style={{...inputStyle, margin: '3.5px', marginRight: '0px'}}>
                                    {item} <span style={{cursor: 'pointer'}} onClick={e=> removeItem(item)}>{"\u00D7"}</span>
                                </span>
                            );
                        })
                    }
                </div>
            </div>

            {/* Dropdown items */}
            <div className={`dropdown-js-padding dropdown-js-menu dropdown-js-rounded ${(!showItems) && 'dropdown-js-hide'}`}
                 style={inputStyle} id='dropDown' name='dropDown' aria-label={label} 
                 key={listKey} >
                {list.map((item, index)=> {
                        return (
                            <div key={`${index}#${item}`} aria-label={item} >
                                <input type='checkbox' name={`${item}Checkbox`} 
                                    style={{cursor: 'pointer'}} checked={isSelected(item)} onChange={e=> handleItemClick(item)} value={item} />
                                <label style={{marginLeft: '5px'}} htmlFor={`${item}`}>{item}</label>
                                <hr style={{borderColor: inputStyle.color}}/>
                            </div>
                        );
                    }) // list.map((item, index)=> {
                }
                <button className='dropdown-js-padding dropdown-js-round' style={buttonStyle}
                    title='Done' disabled={list.length === 0} onClick={e=> hideList()} type='button'>
                    Done
                </button>
            </div>
        </div>
    );
}

MultiSelectionDropdown.propTypes = {
    label: PropTypes.string.isRequired,
    collectionName: PropTypes.string.isRequired,
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

