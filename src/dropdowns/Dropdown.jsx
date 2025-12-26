/**
 * File: ./src/dropdowns/Dropdown.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a single selection searchable dropdown that takes an array of primitive types.
 * * --------------------------------------------------------------------------------
 * Date        Dev   Version   Description
 * 2023/12/19  ITA   1.00      Genesis.
 * 2024/06/18  ITA   1.01      Add the version number.
 * 2024/09/17  ITA   1.02      Toggle (add/remove) class name (w3-show) for displaying list items. Remove the style attribute.
 *                             Adjust width and add borders.
 *                             Import context directly.
 * 2024/10/11  ITA   1.04      Reduce the width of the text box so that it appears side by side with the drop-down on even smaller screens.
 * 2024/10/28  ITA   1.05      Improve the responsiveness of the Dropdown.
 * 2025/12/18  ITA   1.06      Performed further tweaks and tests, preparing this component for npm publishing.
 * 2025/12/26  ITA   1.07      Changed the arrow symbols to + and - for better visibility across different platforms.
 */
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useCollectionsContext } from './CollectionsProvider';
import './dropdown.css';

export function Dropdown({label, // label with which to describe the dropdown.
                    collectionName, // the name of the collection.
                    onItemSelected = null, // function to pass on the value of the selected item to the parent component
                    dropdownStyle, // Styling object with fields {color, backgroundColor, borderColor (optional), fontSize}.
                    isDisabled = false})
{
    const { getCollectionData, setSelected, getSelected, collectionExists } = useCollectionsContext();
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
    const [showItems, setShowItems] = useState(false); // true or false. Show or hide dropdown items.
    const [searchText, setSearchText] = useState('');
    const [list, setList] = useState([]);

    async function handleSearch(e) {
        setSearchText(e.target.value);
        let aList = [];
        aList = getCollectionData(collectionName);

        aList = aList.filter(item=> {
                    const itemValue = item.toUpperCase();
                    const targetValue = e.target.value.toUpperCase();
                    return itemValue.includes(targetValue);
                });

        setList(aList);
        
        if (aList.length === 0)
            hideList();
        else
            showList();
    } // async function handleSearch(e)

    async function handleItemClick(value) {
        setSearchText(value);
        setSelected(collectionName, [value]);

        if (onItemSelected !== null)
            onItemSelected(); // Alert the parent component that a value has been selected.
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

    useEffect(()=> {
        // Collection by a given name not yet added by the parent component.
        if (!collectionExists(collectionName))
            return;

        try {
            // collection added, populate data.
            let aList;
            aList = getCollectionData(collectionName);
            setList(aList);
            const result = getSelected(collectionName);
            if (result.length > 0)
                setSearchText(result[0]);
            else
                setSearchText(''); // No selected item found.                
        } catch (error) {
        }
    }, [collectionExists(collectionName)]); // useEffect(()=> {

    return (
        <div className={`dropdown-js dropdown-js-rounded
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
             style={{...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>                
                <input className={`dropdown-js-input dropdown-js-rounded`} autoComplete='off'
                        type='text' id='searchDropDown' name='searchDropDown'
                        style={inputStyle}
                        aria-label={`Type to Search for ${label}`} aria-required={true} onChange={e=> handleSearch(e)}
                        disabled={isDisabled} placeholder='Type to search' value={searchText} />
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded' onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>
           
            <div className={`dropdown-js-padding dropdown-js-menu ${(!showItems) && 'dropdown-js-hide'}`}
                 id='dropDown' name='dropDown' 
                 disabled={isDisabled} aria-label={label} style={{...inputStyle, marginTop: '3.5px'}}>
                {list.map((item, index)=> {
                        return (
                            <div name={item} key={`${index}#${item}`} aria-label={item}
                                    style={{cursor: 'pointer'}} onClick={e=> handleItemClick(item)}>
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
    collectionName: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    onItemSelected: PropTypes.func,
    dropdownStyle: PropTypes.shape({
        color: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        fontSize: PropTypes.string,
        borderColor: PropTypes.string
    })
};
