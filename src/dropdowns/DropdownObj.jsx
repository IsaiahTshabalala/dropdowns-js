/**
 * File: ./src/dropdowns/DropdownObj.js
 * --------------------------------------------------------------------------------
 * Description: 
 * Provide a single selection, searchable dropdown that takes an array of objects.
 * A developer must specify which field name to use for displaying (the displayName), and which field name to use as value (valueName).
 * * --------------------------------------------------------------------------------
 * Date        Dev    Version Description
 * 2023/12/19  ITA    1.00    Genesis.
 * 2024/06/18  ITA    1.01    Add version number.
 * 2024/07/14  ITA    1.02    Use the underlying field value (valueName) as the key when displaying collection items.
 * 2024/09/17  ITA    1.03    Toggle (add/remove) class name (w3-show) for displaying list items. Remove the extra style attribute.
                              Adjust width and add borders.
                              Import context directly.
* 2024/10/11   ITA   1.04     Reduce the width of the text box so that it appears side by side with the drop-down on even smaller screens.
* 2024/10/28   ITA   1.05     Improve the responsiveness of the dropdown.
* 2025/12/18   ITA   1.06     Renamed to from Dropdown2 to DropdownObj, and performed further tweaks and tests towards preparing this component
                              for npm publishing.
* 2025/12/26   ITA   1.07     Changed the arrow symbols to + and - for better visibility across different platforms.
* 2025/12/29   ITA   1.08     Placeholder must show the name of the data as provided by the label attribute.

*/
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useCollectionsContext } from './CollectionsProvider';
import './dropdown.css';

export function DropdownObj({label, // label with which to describe the dropdown.
                    collectionName,  // Name of the collection from which to display items.
                    displayName, // the name of the field that will be used for displaying the list items to the user.
                    valueName, // the name of the field that will be used as the underlying value of each list item. Typically a unique code/id
                    onItemSelected = null, // Function to be called to alert the parent component on selection of an item.
                    dropdownStyle,
                    isDisabled=false})
{
    const { getCollectionData,
            setSelected,
            getSelected,
            collectionExists
          } = useCollectionsContext();

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

    const [showItems, setShowItems] = useState(null); // true or false. Show or hide dropdown items.
    const [list, setList] = useState([]);
    const [searchText, setSearchText] = useState('');

    async function handleSearch(e) {
        setSearchText(e.target.value);

        let aList = getCollectionData(collectionName);
        aList = aList.filter(item=> {
            const itemValue = item[displayName].toUpperCase();
            const targetValue = e.target.value.toUpperCase();
            return itemValue.includes(targetValue);
        });
        setList(aList);
        showList();
    } // function handleSearch(e)

    function handleItemClick(clickedItem) {
        setSearchText(clickedItem[displayName]);
        setSelected(collectionName, [clickedItem]);

        if (onItemSelected !== null)
            onItemSelected(); // Alert the parent component that a new selection was made.
        
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

    useEffect(()=> {
        // Collection by a given name not yet added by the parent component.
        if (!collectionExists(collectionName))
            return;

        // collection added, populate data.

        if (!displayName) // Make sure that displayName was provided.
            throw new Error('displayName must be provided');
        if (!valueName) // Make sure that the valueName was provided.
            throw new Error('valueName must be provided');

        let result = [...getCollectionData(collectionName)];

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

        setList(result);
        result = getSelected(collectionName);

        if (result.length > 0)
            setSearchText(result[0][displayName]);
        else
            setSearchText(''); // No selected item found.
    }, [collectionExists(collectionName)]); // useEffect(()=> {

    return (
        <div className={`dropdown-js dropdown-js-rounded
                         ${borderColor && `dropdown-js-border ${borderColor}`}`}
             style={{...(isDisabled? { pointerEvents: 'none'}: {})}}>

            <div  className='dropdown-js-input-wrapper dropdown-js-rounded' style={inputStyle}>
                <input className={`dropdown-js-input dropdown-js-rounded`}
                        style={inputStyle}
                        type='text' id='searchDropDown' name='searchDropDown' autoComplete='off'
                        aria-label={`Type to Search for ${label}`} aria-required={true} onChange={e=> handleSearch(e)}
                        disabled={isDisabled}
                        placeholder={`Type to Search for ${label}`} value={searchText} />
                
                <div className='dropdown-js-arrow-container dropdown-js-padding dropdown-js-rounded' onClick={e=> toggleShowList(e)}>
                    <span className='dropdown-js-arrow dropdown-js-padding'>{!showItems? "+" : "-"}</span>
                </div>
            </div>
            
            <div className={`dropdown-js-padding dropdown-js-menu ${(!showItems) && 'dropdown-js-hide'}`}
                 id='dropDown' name='dropDown' aria-label={label} style={{...inputStyle, marginTop: '3.5px'}} >
                {list.map((item, index)=> {
                        return (
                            <div name={item[displayName]} key={item[valueName]} 
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
    collectionName: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    onItemSelected: PropTypes.func,
    dropdownStyle: PropTypes.shape({
        color: PropTypes.string.isRequired,
        backgroundColor: PropTypes.string.isRequired,
        fontSize: PropTypes.string,
        borderColor: PropTypes.string
    })
};
