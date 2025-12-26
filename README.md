# dropdowns-js

## Overview
Searchable dropdown components for React applications.
- Dropdown - a single selection dropdown whose underlying data is primitive type array.
- DropdownObj - a single selection dropdown whose underlying data is an array of objects.
- MultiSelectionDropdown - a multi-selection dropdown whose underlying data is a primitive array.
- MultiSelectionDropdownObj - a multi-selection dropdown whose underlying data is an array of objects.
   
## Installation
```
npm install dropdowns-js
```  
  
## 1. Wrap your Component
All components must be separately wrapped in the CollectionsProvider to manage the dropdown states.

```
// App.jsx
import { CollectionsProvider } from "dropdowns-js";
import MyComponent from "./MyComponent";

function App() {
    return (
        <CollectionsProvider>
            <MyComponent />
        </CollectionsProvider>
    );
}
export default App;
```  
  
## 2. Import styles and hook
Inside your component, where you use any of the dropdowns, import as follows:  
  
```
// File: MyComponent.jsx
import "dropdowns-js/style.css"; // Must not be left out, so as to enforce dropdown styling.
import {
    useCollectionsContext,
    Dropdown, // If you use it.
    DropdownObj, // If you use it.
    MultiselectionDropdown, // If you use it.
    MultiselectionDropdownObj,  // If you use it.
} from "dropdowns-js";

export default function MyComponent {
    // Inside your component.
    const {
        addCollection, // A must. For pre-populating your dropdown
        collectionExists, // A must. To be called prior to adding a collection.
        getCollectionData, // Depends
        updateCollection, // Depends on whether the collection's data gets updated.
        setSelected, // Depends. Use-case: pre-populated selection.
        getSelected // A must. For obtaining selected items.
    } = useCollectionsContext();

    // ...
}
``` 
**Context functions**  
`addCollection(collectionName, anArray, maxNumSelections = null, primitiveType = true, ...sortFields)`  
Add a new collection of data to be displayed in a dropdown for selection.  
  

`collectionExists(collectionName)`  
Check (true/false) whether the collection with the specified name exists.  
  
`updateCollection(collectionName, anArray)`  
Update the specified collection with new data. An error is thrown for a non-existent collection name. A dropdown whose data is updated must be given a key attribute, and the key value must be updated to cause a re-render with new data.  
  
`getCollectionData(collectionName)`  
Get the data (array) of the specified collection. An error is thrown for a non-existent collection name.  

`setSelected(collectionName, selectedItemsArray)`  
Set the selected items in the specified collection. They are ignored if they were are part of the collection. An error is thrown for a non-existent collection name.  
  
`getSelected(collectionName)`  
Get the selected items (array) of the specified collection. An error is thrown for a non-existent collection name is specified.  
  
`getMaxNumSelections(collectionName)`  
Get the maximum number of items that can be selected on this collection. An error is thrown for a non-existent collection name is specified.  
  
## 3. Dropdown Component Attributes
`label` - to be used for aria-label.  
  
`isDisabled` - disables the component when set to true. Default = false.  
  
`collectionName` - name of the collection to populate the dropdown.  
  
`dropdownStyle` - for providing styling the dropdown. Fields: {color, backgroundColor, borderColor (optional)}.  
  
`buttonStyle` - for providing styling the DONE button (pressed after completing selection in multi-selection dropdowns). Fields: {color, backgroundColor}.  
  
`onItemSelected` - a providing a method to execute on selection of items.
  
## 4. Dropdown usage example
This dropdown is to be used when the underlying data is a primitive type array.  
```  
import { Dropdown, useCollectionsContext } from 'dropdowns-js';
import 'dropdowns-js/style.css'; // styles must be imported, otherwise the dropdowns do not display properly.
import { useEffect, useState } from 'react';

export default function MyComponent() {
    const [output, setOutput] = useState('');

    const { 
        addCollection,
        collectionExists,
        getSelected
    } = useCollectionsContext();

    useEffect(()=> {
        if (!collectionExists("FRUITS")) {
            const fruits = ["APPLE", "BANANA" "ORANGE", "NAARJIE", "PEACH"]
            // Create an APPLES collection
            addCollection("FRUITS", // collection name
                          fruits, // collection data
                          1, // Maximum number of allowed selections.
                          true, // true = primitive type (string) data collection
                          'asc'); // sort order
        }
    }, []);

    /**Respond when the user has chosen a fruit */
    function fruitSelected() {
        // Obtain the selected items. Only 1 selection was made (size 1 array)
        const selectedFruit = getSelected("FRUITS")[0];
        setOutput(selectedFruit);
    }

    return (
        <div className='' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>Dropdown Example</h1>
            <p>Select a fruit</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='fruits' style={{width: '70px'}}>Fruit</label>

                <Dropdown id='fruits' label={'Fruits'} collectionName={'FRUITS'} 
                          onItemSelected={fruitSelected}
                          dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />

            </div>
            <p>{output}</p>

        </div>
    );
}
```  
## 5. DropdownObj usage example
```  
import { DropdownObj, useCollectionsContext } from 'dropdowns-js';
import 'dropdowns-js/style.css'; // Not to be left out.

import { useEffect, useState } from 'react';

export default function MyComponent2() {
    const [output, setOutput] = useState('');
    const [aKey, setAKey] = useState(0);
    const { 
        addCollection,
        collectionExists,
        updateCollection,
        getSelected
    } = useCollectionsContext();

    useEffect(()=> {
        if (!collectionExists("DRIVING_CODES")) {
            // Create a DRIVING_CODES collection, sorted by description ascending
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
            addCollection("DRIVING_CODES", // collection name
                          drivingCodes, // collection data
                          1, // allow maximum 1 selection
                          false, // non-primitive type, that is, object type data collection
                          'description asc'); // sort order
        }
    }, []);

    /**Respond when the user has chosen a driving code */
    function drivingCodeSelected() {
        // Obtain the selected items. Only 1 selection was made (size 1 array)
        const selectedDrivingCode = [...getSelected(collectionNames.DRIVING_CODES)[0]];
        setOutput(`${selectedDrivingCode.code} => ${selectedDrivingCode.description}`);
    }

    return (
        <div className='w3-container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>DropdownObj Example</h1>
            <p>Select driving licence code</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='driving-codes' style={{width: '70px'}}>Driving Codes</label>

                <DropdownObj id='driving-codes' label='Driving Codes' collectionName={"DRIVING_CODES"}
                    displayName="description" valueName="code"  onItemSelected={drivingCodeSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />
            </div>

            <p>{output}</p>
        </div>
    );
}
```  
## 6. MultiselectionDropdown usage example 
```  
import { MultiSelectionDropdown, useCollectionsContext } from 'dropdowns-js';
import 'dropdowns-js/style.css';

import { useEffect, useState } from 'react';

export default function MyComponent3() {
    const [output, setOutput] = useState('');
    const [aKey, setAKey] = useState(0);
    const { 
        addCollection,
        collectionExists,
        updateCollection,
        getSelected
    } = useCollectionsContext();

    useEffect(()=> {
        if (!collectionExists("SPORTS")) {
            // Create an SPORT collection sorted in ascending order.
            const sport = [
                "Motor Racing", "Cycling", "Wrestling", "Kung Fu", "Boxing", "Basket Ball",
                "Rugby", "Cricket", "Running", "Soccer", "Netball", "Hockey"
            ];
            addCollection("SPORT", // collection name
                          sport, // collection data
                          4, // maximum number of selections
                          true, // primitive type data (string in this case)
                          'asc'); // asc - sort order 
        }
    }, []);

    /**Respond when the user has chosen an interest */
    function sportSelected() {
        // Obtain the selected items.
        const selectedSport = getSelected("SPORT").join(", );
        setOutput(selectedSport);        
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='sport' style={{width: '70px'}}>Sport</label>

                <MultiSelectionDropdown label='Sport'
                    id='sport'
                    collectionName={"SPORT"}
                    onItemsSelected={sportSelected}
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
import { MultiSelectionDropdownObj, useCollectionsContext } from 'dropdowns-js';

import { useEffect, useState } from 'react';


export default function MyComponent4() {
    const [output, setOutput] = useState('');
    const [dropdownKey2, setDropdownKey2] = useState(0);
    const keyStep = .000001;
    const { 
        addCollection,
        collectionExists,
        updateCollection,
        getSelected
    } = useCollectionsContext();

    const collectionNames = {
        DRIVING_CODES: "DRIVING_CODES",
        DRIVERS: "DRIVERS"
    };

    useEffect(()=> {
        if (!collectionExists(collectionNames.DRIVING_CODES)) {
            // Create DRIVING_CODES collection sorted in ascending order.
            // Create a DRIVING_CODES collection, sorted by description ascending
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

            addCollection("DRIVING_CODES", // collection name
                          drivingCodes, // collection data
                          3, // maximum number of selections
                          false, // object type data
                          'description asc'); // asc - sort order 
        }
    }, []);

    /**Respond when the user has chosen an interest */
    function drivingCodesSelected() {
        // Obtain the selected driving codes.
        const selectedDrivingCodes = getSelected("DRIVING_CODES");

        // Create a string array of driving codes.
        const strSelectedCodes = selectedDrivingCodes.map((drivingCode)=> drivingCode.code)
                                    .map(drivingCode => drivingCode.code)
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
                    id='driving-licence-codes'
                    label='Driving Licence Codes'
                    collectionName='DRIVING_CODES'
                    valueName='code'
                    displayName='description'
                    onItemsSelected={drivingCodeSelected}
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
## 8. Multiple dropdown usage example
```
export default function MyComponent5() {
    const [output, setOutput] = useState();
     /* A dropdown whose collection data gets updated, must be given a key attribute, so as to update 
        it (key) to cause re-render upon the update of collection data. */
    const [dropdownKey2, setDropdownKey2] = useState(0);
    const keyStep = .000001;

    const { 
        addCollection,
        collectionExists,
        updateCollection,
        getSelected
    } = useCollectionsContext();

    const drivers = [
        { fullName: "Thabo Mokoena", licenceCode: "B", id: "771217" },
        { fullName: "Naledi Khumalo", licenceCode: "EB", id: "850412" },
        { fullName: "Sipho Dlamini", licenceCode: "C1", id: "861802" },
        { fullName: "Ayesha Patel", licenceCode: "B", id: "500101" },
        { fullName: "Johan van der Merwe", licenceCode: "EC", id: "620401" },
        { fullName: "Lerato Molefe", licenceCode: "A", id: "901012" },
        { fullName: "Sibusiso Nkosi", licenceCode: "EC1", id: "910512" },
        { fullName: "Michelle Adams", licenceCode: "B", id: "901012" },
        { fullName: "Kagiso Tshepe", licenceCode: "C", id: "920115" },
        { fullName: "Pieter Botha", licenceCode: "A1", id: "960401" },
        { fullName: "Nomvula Zungu", licenceCode: "B", id: "0792346789" },
        { fullName: "Riaan Pretorius", licenceCode: "EB", id: "0824567812" },
        { fullName: "Mandla Sithole", licenceCode: "C1", id: "0735678910" },
        { fullName: "Fatima Khan", licenceCode: "B", id: "0846789123" },
        { fullName: "Tshepo Madiba", licenceCode: "EC1", id: "0817890234" },
        { fullName: "Andre Nel", licenceCode: "A", id: "0728901345" },
        { fullName: "Zanele Mthembu", licenceCode: "B", id: "0769012456" },
        { fullName: "Imran Desai", licenceCode: "C", id: "0740123567" },
        { fullName: "Charlene Jacobs", licenceCode: "EB", id: "0831234678" },
        { fullName: "Vusi Hlongwane", licenceCode: "EC", id: "0712345789" }
    ];

    useEffect(()=> {
        if (!collectionExists("DRIVING_CODES")) {
            const drivingCodes = [
                "A", "A1", "EC", "EC1", "C", "C1", "B", "EB"
            ];
            // Create DRIVING_CODES collection sorted in ascending order.
            addCollection("DRIVING_CODES", // collection name
                          drivingCodes, // collection data
                          1, // maximum number of selections
                          true, // primitive type data
                          'asc'); // asc - sort order 
        }
        if (!collectionExists("DRIVERS")) {
            // Create a drivers collection sorted in ascending order. Initially empty pending the selection of a driving code.

            addCollection("DRIVERS",
                            [], // empty
                            5, // allow max 5 selections
                            false, // object type data.
                            'fullName asc'); 
        }
    }, []);

    /**Respond when the user has chosen a driving licence code */
    function drivingCodeSelected() {
        // Obtain the selected driving codes.
        const selectedDrivingCodes = getSelected("DRIVING_CODES");

        // Create a string array of driving codes.
        const strSelectedCodes = selectedDrivingCodes; // Expecting a size 1 array
        const selectedCode = strSelectedCodes[0];

        /*=========Update collection according to selected driving licence code=====*/
        const updateData = drivers.filter(driver=> {
            return selectedCode === driver.licenceCode;
        });
        updateCollection("DRIVERS", updateData);
        /*============================================================================*/

        // Force the re-render the drivers MultiselectionDropdownObj, since its data has been updated.
        setDropdownKey2(dropdownKey2 + keyStep);
    }

    function driversSelected() {
        const selectedDrivers = [...getSelected(collectionNames.DRIVERS)].map(driver => driver.fullName); // Array
        setOutput(selectedDrivers.join(', ')); // List of selected drivers' names.
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdownObj Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '100px'}}>Lic. Codes</label>
                <MultiSelectionDropdownObj label='Driving Licence Codes'
                    collectionName={collectionNames.DRIVING_CODES}
                    valueName='code'
                    displayName='description'
                    onItemsSelected={drivingCodeSelected}
                    isDisabled={false}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '100px'}}>Drivers</label>
                <MultiSelectionDropdownObj
                    key={dropdownKey2}
                    collectionName={collectionNames.DRIVERS}
                    label='Drivers'
                    valueName='id'
                    displayName='fullName'
                    onItemsSelected={driversSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}                     
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />               
            </div>

            {output &&  
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