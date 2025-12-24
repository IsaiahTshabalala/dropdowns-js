/**File: ./src/MultiSelectionDropdownTest.jsx
 * Author: ITA
 * MultiSelectionDropdownTest: A sample component demonstrating the use of the MultiSelectionDropdown.
 * 
 * Change Log
 * =========================================================
 * Date        Version   Author  Description
 * =========================================================
 * 2025/12/19  1.0.0     ITA     Genesis.
*/

/** VERY IMPORTANT!!!
 * Depending on how you are testing the components, you need to uncomment the appropriate import statements below.
 * 
 * Test type 1:
 * If you are testing the dropdown components as part of this project,
 * then import MultiSelectionDropdown and useCollectionsContext from the local filepath of this project.
 * 
 * Test type 2:
 * If you are testing the component as an npm package, then import from 'dropdowns-js'.
 * 
 * 
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

// Test Type 1: local import.
// import { useCollectionsContext } from './dropdowns/CollectionsProvider';
// import { MultiSelectionDropdownObj } from './dropdowns/MultiSelectionDropdownObj';

// Test type 2: package import.
import 'dropdowns-js/style.css';
import { MultiSelectionDropdownObj, useCollectionsContext } from 'dropdowns-js';

import { useEffect, useState } from 'react';

/*======= Collections/lists to be used to illustrate how to use MultiSelectionDropdownObj ============*/
const drivingCodesZA = [
  { code: "A1", description: "Motorcycle ≤ 125cc", minAge: 18 },
  { code: "A", description: "Motorcycle > 125cc", minAge: 16 },
  { code: "B", description: "Light motor vehicle ≤ 3,500kg", minAge: 18 },
  { code: "C1", description: "Medium goods vehicle (3,500 - 16,000kg)", minAge: 18 },
  { code: "C", description: "Heavy goods vehicle (>16,000kg)", minAge: 18 },
  { code: "EB", description: "Light vehicle + heavy trailer", minAge: 18 },
  { code: "EC1", description: "Medium goods vehicle + heavy trailer", minAge: 18 },
  { code: "EC", description: "Heavy goods vehicle + heavy trailer", minAge: 18 }
];

const drivers = [
  {
    fullName: "Thabo Mokoena",
    licenceCode: "B",
    id: "771217"
  },
  {
    fullName: "Naledi Khumalo",
    licenceCode: "EB",
    id: "850412"
  },
  {
    fullName: "Sipho Dlamini",
    licenceCode: "C1",
    id: "861802"
  },
  {
    fullName: "Ayesha Patel",
    licenceCode: "B",
    id: "500101"
  },
  {
    fullName: "Johan van der Merwe",
    licenceCode: "EC",
    id: "620401"
  },
  {
    fullName: "Lerato Molefe",
    licenceCode: "A",
    id: "901012"
  },
  {
    fullName: "Sibusiso Nkosi",
    licenceCode: "EC1",
    id: "910512"
  },
  {
    fullName: "Michelle Adams",
    licenceCode: "B",
    id: "901012"
  },
  {
    fullName: "Kagiso Tshepe",
    licenceCode: "C",
    id: "920115"
  },
  {
    fullName: "Pieter Botha",
    licenceCode: "A1",
    id: "960401"
  },

  {
    fullName: "Nomvula Zungu",
    licenceCode: "B",
    id: "0792346789"
  },
  {
    fullName: "Riaan Pretorius",
    licenceCode: "EB",
    id: "0824567812"
  },
  {
    fullName: "Mandla Sithole",
    licenceCode: "C1",
    id: "0735678910"
  },
  {
    fullName: "Fatima Khan",
    licenceCode: "B",
    id: "0846789123"
  },
  {
    fullName: "Tshepo Madiba",
    licenceCode: "EC1",
    id: "0817890234"
  },
  {
    fullName: "Andre Nel",
    licenceCode: "A",
    id: "0728901345"
  },
  {
    fullName: "Zanele Mthembu",
    licenceCode: "B",
    id: "0769012456"
  },
  {
    fullName: "Imran Desai",
    licenceCode: "C",
    id: "0740123567"
  },
  {
    fullName: "Charlene Jacobs",
    licenceCode: "EB",
    id: "0831234678"
  },
  {
    fullName: "Vusi Hlongwane",
    licenceCode: "EC",
    id: "0712345789"
  }
];

/*=======================================================================================*/
export default function MultiSelectionDropdownObjTest() {
    const [output, setOutput] = useState();
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
            addCollection(collectionNames.DRIVING_CODES, // collection name
                          drivingCodesZA, // collection data
                          2, // maximum number of selections
                          false, // object type data
                          'description asc'); // asc - sort order 
        }
        if (!collectionExists(collectionNames.DRIVERS)) {
            // Create a topics collection sorted in ascending order. Initially empty pending the selection of interests
            addCollection(collectionNames.DRIVERS,
                            [], // empty
                            5, // allow max 5 selections
                            false, // object type data.
                            'fullName asc'); 
        }
    }, []);

    /**Respond when the user has chosen an interest */
    function drivingCodeSelected() {
        // Obtain the selected driving codes.
        const selectedDrivingCodes = getSelected(collectionNames.DRIVING_CODES);

        // Create a string array of driving codes.
        const strSelectedCodes = selectedDrivingCodes.map((drivingCode)=> drivingCode.code);
        const updateData = drivers.filter(driver=> {
            return strSelectedCodes.includes(driver.licenceCode);
        });        

        updateCollection(collectionNames.DRIVERS, updateData);

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
                <label htmlFor='driving-codes-dropdown' style={{width: '100px'}}>Lic. Codes</label>
                <MultiSelectionDropdownObj
                    id= 'driving-codes-dropdown'
                    label='Driving Licence Codes'
                    collectionName={collectionNames.DRIVING_CODES}
                    valueName='code'
                    displayName='description'
                    onItemsSelected={drivingCodeSelected}
                    isDisabled={false}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='drivers-dropdown' style={{width: '100px'}}>Drivers</label>
                <MultiSelectionDropdownObj
                    id= 'drivers-dropdown'
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