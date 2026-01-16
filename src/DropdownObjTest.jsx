/**File: ./src/DropdownObjTest.jsx
 * Author: ITA
 * DropdownObjTest: A sample component demonstrating the use of the DropdownObj.
 * 
 * Change Log
 * =========================================================
 * Start Date  End Date    Version   Author  Description
 * =========================================================
 * 2025/12/18              1.0.0     ITA     Genesis.
 * 2026/01/11  2026/01/16  1.0.1     ITA     Use of the Dropdown component no longer requires a Collections context provider.
*/

/** VERY IMPORTANT!!!
 * Depending on how you are testing the components, you need to uncomment the appropriate import statements below.
 * 
 * Test type 1:
 * If you are testing the dropdown components as part of this project,
 * then import DropdownObj and useCollectionsContext from the local filepath of this project.
 * 
 * Test type 2:
 * If you are testing the component as an npm package, then import from 'dropdowns-js'.
 * 
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

// Test type 1: package import.
import { DropdownObj } from 'dropdowns-js';
import 'dropdowns-js/style.css';

// Test Type 2: local import.
// import { DropdownObj } from './dropdowns/DropdownObj';

import { useState } from 'react';

/*======= Collections/lists to be used to illustrate how to use DropdownObj ============*/
const drivingCodesZa = [
  { code: "A1", description: "Motorcycle ≤125cc", minAge: 18 },
  { code: "A", description: "Motorcycle >125cc", minAge: 16 },
  { code: "B", description: "Light motor vehicle ≤3,500kg", minAge: 18 },
  { code: "C1", description: "Medium goods vehicle (3,500–16,000kg)", minAge: 18 },
  { code: "C", description: "Heavy goods vehicle (>16,000kg)", minAge: 18 },
  { code: "EB", description: "Light vehicle + heavy trailer", minAge: 18 },
  { code: "EC1", description: "Medium goods vehicle + heavy trailer", minAge: 18 },
  { code: "EC", description: "Heavy goods vehicle + heavy trailer", minAge: 18 }
];

const driversData = [
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

export default function DropdownObjTest() {
    const [output, setOutput] = useState('');
    const [selectedDrivingCode, setSelectedDrivingCode] = useState(null);
    const [drivers, setDrivers] = useState([]);
    const [selectedDriver, setSelectedDriver] = useState(null);

    /**Respond when the user has chosen a driving code */
    function drivingCodeSelected(selDrivCode) {
        // Obtain the selected items. Only 1 selection was made (size 1 array)
        setSelectedDrivingCode(({ ...selDrivCode }));
        let updateData  = driversData.filter(driver=> {
            return driver.licenceCode === selDrivCode.code;
        });
        setDrivers(updateData);
        setSelectedDriver(updateData[0]);
        updateOutput(selDrivCode, updateData[0]);
    }

    function driverSelected(selDriver) {
        updateOutput(selectedDrivingCode, selDriver);
    }

    function updateOutput(selDrivCode, selDriver) {
        setOutput(`${selDriver.fullName} => ${selDrivCode.code}`);
    }

    return (
        <div className='w3-container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>DropdownObj Example</h1>
            <p>Select a driving code, and then a driver</p>
            
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='driving-codes' style={{width: '70px'}}>Driving Codes</label>
                <DropdownObj 
                    id='driving-codes' label='Driving Codes'
                    data={drivingCodesZa}
                    sortFields={['description', 'code']}
                    displayName="description" valueName="code"  onItemSelected={drivingCodeSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />
            </div>

             <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor='driver' style={{width: '70px'}}>Drivers</label>
                <DropdownObj id='drivers' 
                    label='Drivers'
                    data={drivers} 
                    selected={selectedDriver}
                    sortFields={['fullName', 'id']}
                    displayName="fullName" valueName="id" onItemSelected={driverSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />               
            </div>

            <p>{output}</p>

        </div>
    );
}