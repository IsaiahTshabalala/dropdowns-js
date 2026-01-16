# dropdowns-js

## Overview
Searchable dropdown components for React applications.
- Dropdown - a single selection dropdown whose underlying data is primitive type array.
- DropdownObj - a single selection dropdown whose underlying data is an array of objects.
- MultiSelectionDropdown - a multi-selection dropdown whose underlying data is a primitive array.
- MultiSelectionDropdownObj - a multi-selection dropdown whose underlying data is an array of objects.
The components sort the data provided to them.
   
## Installation
```
npm install dropdowns-js
```  

## 1. Imports
Inside your component, where you use any of the dropdowns, import as follows:  
  
```
// File: MyComponent.jsx
import "dropdowns-js/style.css"; // Must not be left out, so as to enforce dropdown styling.
import {
    Dropdown, // If you use it.
    DropdownObj, // If you use it.
    MultiselectionDropdown, // If you use it.
    MultiselectionDropdownObj,  // If you use it.
} from "dropdowns-js";

export default function MyComponent {
    // ...
}
``` 
  
## 3. Dropdown Component Attributes
`label` - the name of the data to be displayed displayed in the dropdown. e.g. Cars, Users.
  
`isDisabled` - disables the component when set to true. Default = false.  
  
`data` - data to display in the dropdown, for the user to select from.  

`sortDirection` - for dropdowns using primitive type array input. Specifies the sort order of the dropdown data. 'asc' or 'desc'. Default is 'asc'.

`sortFields` - for dropdonws using object type array input. An array. Specifies the field sort orders of the dropdown data. e.g. ['score desc', 'numGames asc']. If a field is to be sorted ascending order, you can ommit asc. .e.g.  ['fullName', 'score desc'].

`displayName` - for dropdowns using object type array input. The field (name) by which the dropdown items will be displayed.  

`valueName` - for dropdowns using object type array input. The name of the field that will be used as the underlying unique value of each dropdown item. e.g. 'code', 'id'.

`selectedData` - for multi-selection dropdowns. An array of pre-set selection of options. This is an array of multi-selection dropdowns. Optional.

`selected` - for single selection dropdowns. A pre-set selected option.
  
`onItemSelected` - for single selection dropdowns. A function to call when the user has made a selection.
  
`onItemsSelected` - for multi-selection dropdowns. A function to call when the user has made a selection. Or removed items from their selection.
  
`dropdownStyle` - CSS styling for the dropdown. Fields: {color, backgroundColor, borderColor (optional)}.  
  
`buttonStyle` - for multi-selecton dropdowns. CSS styling for the DONE button (pressed after completing a selection). Fields: {color, backgroundColor}.  
  
## 4. Dropdown usage example
This dropdown is to be used when the underlying data is a primitive type array.  
```  
import { Dropdown } from 'dropdowns-js';
import 'dropdowns-js/style.css'; // styles must be imported, otherwise the dropdowns do not display properly.
import { useState } from 'react';

export default function MyComponent() {
    const [output, setOutput] = useState('');
    const fruits = [ "BANANA" "ORANGE", "NAARJIE", "PEACH", "APPLE" ];

    /**Respond when the user has chosen a fruit */
    function fruitSelected(selFruit) {
        setOutput(selFruit);
    }

    return (
        <div className='' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>Dropdown Example</h1>
            <p>Select a fruit</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='fruits' style={{width: '70px'}}>Fruit</label>

                <Dropdown
                    label={'Fruits'}
                    data={fruits} sortDirection='asc'
                    onItemSelected={fruitSelected}
                    selected={"BANANA"}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                />

            </div>
            <p>{output}</p>

        </div>
    );
}
```  
## 5. DropdownObj usage example
```  
import { DropdownObj } from 'dropdowns-js';
import 'dropdowns-js/style.css'; // Not to be left out.

import { useState } from 'react';

export default function MyComponent2() {
    const [output, setOutput] = useState('');
    const drivingCodes = [
        { code: 'A1', description: 'Light Motorcycles' },
        { code: 'A', description: 'Heavy Motorcycles' },
        { code: 'B', description: 'Light Vehicles' },
        { code: 'EB', description: 'Light Articulated' },
        { code: 'C1', description: 'Heavy Vehicles' },
        { code: 'C', description: 'Extra Heavy Vehicles' },
        { code: 'EC1', description: 'Heavy Articulated' },
        { code: 'EC', description: 'Extra Heavy Articulated' }
    ];

    /**Respond when the user has chosen a driving code */
    function drivingCodeSelected(selDrivingCode) {
        setOutput(`${selDrivingCode.code} => ${selDrivingCode.description}`);
    }

    return (
        <div className='w3-container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>DropdownObj Example</h1>
            <p>Select driving licence code</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='driving-codes' style={{width: '70px'}}>Driving Codes</label>

                <DropdownObj
                    label='Driving Codes' data={drivingCodes}
                    displayName="description"
                    valueName="code"
                    sortFields={ ['description'] }
                    onItemSelected={drivingCodeSelected}
                    selected={drivingCodes[0]}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />
            </div>

            <p>{output}</p>
        </div>
    );
}
```  
## 6. MultiselectionDropdown usage example 
```  
import { MultiSelectionDropdown } from 'dropdowns-js';
import 'dropdowns-js/style.css';

import { useState } from 'react';

export default function MyComponent3() {
    const [output, setOutput] = useState('');
    const sport = [
        "Motor Racing", "Cycling", "Wrestling", "Kung Fu", "Boxing", "Basket Ball",
        "Rugby", "Cricket", "Running", "Soccer", "Netball", "Hockey"
    ];

    /**Respond when the user has chosen an interest */
    function sportsSelected(selSports) {
        // Obtain the selected items.
        const selectedSport = selSports("SPORT").join(", );
        setOutput(selectedSport);        
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='sport' style={{width: '70px'}}>Sport</label>

                <MultiSelectionDropdown
                    label='Sport'
                    data={sport}
                    onItemsSelected={sportsSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <>{output}</>
        </div>
    );
}
```  

## 7. MultiSelectionDropdownObj usage example
```  
import 'dropdowns-js/style.css';
import { MultiSelectionDropdownObj } from 'dropdowns-js';

import { useState } from 'react';


export default function MyComponent4() {
    const [output, setOutput] = useState('');
    const drivingCodes = [
        { code: 'A1', description: 'Light Motorcycles' },
        { code: 'A', description: 'Heavy Motorcycles' },
        { code: 'B', description: 'Light Vehicles' },
        { code: 'EB', description: 'Light Articulated' },
        { code: 'C1', description: 'Heavy Vehicles' },
        { code: 'C', description: 'Extra Heavy Vehicles' },
        { code: 'EC1', description: 'Heavy Articulated' },
        { code: 'EC', description: 'Extra Heavy Articulated' }
    ];

    /**Respond when the user has chosen an interest */
    function drivCodesSelected(selDrivCode) {
        // Create a string array of driving codes.
        const strSelectedCodes = selDrivCodes.map((drivCode)=> drivCode.code)
                                    .map(drivCode => drivCode.code)
                                    .join(", ");
        setOutput(strSelectedCodes);
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdownObj Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor={'driving-licence-codes'} style={{width: '100px'}}>Lic. Codes</label>
                <MultiSelectionDropdownObj
                    label='Driving Licence Codes'
                    data={drivingCodes}
                    sortFields={ ['description'] }
                    valueName='code'
                    displayName='description'
                    onItemsSelected={drivCodeSelected}
                    isDisabled={false}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            {(output.length > 0) &&  
              <div style={{ marginTop: '10px', padding: '5px' }}>
                  {output}
              </div>
            }

        </div>
    );
}
```  

## License
MIT