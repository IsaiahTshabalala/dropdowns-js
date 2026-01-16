/**File: ./src/MultiSelectionDropdownTest.jsx
 * Author: ITA
 * MultiSelectionDropdownTest: A sample component demonstrating the use of the MultiSelectionDropdown.
 * 
 * Change Log
 * =========================================================
 * Start Date  End Date    Version   Dev     Description
 * =========================================================
 * 2025/12/19              1.0.0     ITA     Genesis.
 * 2026/01/11  2026/01/16  1.0.1     ITA     Working with MultiSelectionObj dropdown no longer requires a Collections context provider.
*/

/** VERY IMPORTANT!!!
 * Depending on how you are testing the components, you need to uncomment the appropriate import statements below.
 * 
 * Test type 1:
 * If you are testing the dropdown components as part of this project,
 * then import MultiSelectionDropdown from the local filepath of this project.
 * 
 * Test type 2:
 * If you are testing the component as an npm package, then import from 'dropdowns-js'.
 * 
 * 
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

// Test Type 1: local import.
// import { MultiSelectionDropdownObj } from './dropdowns/MultiSelectionDropdownObj';

// Test type 2: package import.
import 'dropdowns-js/style.css';
import { MultiSelectionDropdownObj } from 'dropdowns-js';

import { useState } from 'react';

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
    fullName: "Pieter Botha",
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
    const [driversPerLicenceCode, setDriversPerLicenceCode] = useState([]);
    const [selectedDrivers, setSelectedDrivers] = useState(useState([]));
    const [output, setOutput] = useState();

    /**Respond when the user has chosen driving codes */
    function drivingCodesSelected(drivCodes) {
        // Create a string array of driving codes.
        const strSelectedCodes = drivCodes.map((drivCode)=> drivCode.code);
        const updateData = drivers.filter(driver=> {
            return strSelectedCodes.includes(driver.licenceCode);
        });    

        setDriversPerLicenceCode(updateData);
        setSelectedDrivers(updateData);
    }

    function driversSelected(selDrivers) {
        setSelectedDrivers(selDrivers);
        setOutput(selDrivers.map(selDriv=> `${selDriv.fullName} (${selDriv.licenceCode})`).join(', ')); // List of selected drivers' names.
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdownObj Example</h1>
            <p>Choose the driving licence codes, and then pick your drivers</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='driving-codes-dropdown' style={{width: '100px'}}>Lic. Codes</label>
                <MultiSelectionDropdownObj
                    id= 'driving-codes-dropdown'
                    label='Driving Licence Codes'
                    data={drivingCodesZA}
                    sortFields={['description']}
                    valueName='code'
                    displayName='description'
                    maxNumSelections={3}
                    onItemsSelected={drivingCodesSelected}
                    isDisabled={false}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='drivers-dropdown' style={{width: '100px'}}>Drivers</label>
                <MultiSelectionDropdownObj
                    id= 'drivers-dropdown'
                    label='Drivers'
                    data={driversPerLicenceCode}
                    sortFields={['lastName', 'firstName',]}
                    valueName='id'
                    displayName='fullName'
                    maxNumSelections={5}
                    onItemsSelected={driversSelected}
                    selectedData={selectedDrivers}
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