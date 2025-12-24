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
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

// Test type 1: Local project testing.
// import { useCollectionsContext } from './dropdowns/CollectionsProvider';
// import { MultiSelectionDropdown } from './dropdowns/MultiSelectionDropdown';

// Test type 2: NPM package testing.
import { MultiSelectionDropdown, useCollectionsContext } from 'dropdowns-js';
import 'dropdowns-js/style.css';

import { useEffect, useState } from 'react';

/*======= Collections/lists to be used to illustrate how to use a MultiselectionDropdownObj ============*/
const interests = ["Education", "Sport", "Movies", "Cars"];
const sport = [
    "Motor Racing", "Cycling", "Wrestling", "Kung Fu", "Boxing", "Basket Ball",
    "Rugby", "Cricket", "Running", "Soccer", "Netball", "Hockey"
];

const education = [
    "Cooking", "Hunting", "Mathematics", "Physics", "Philosophy", "Programming", "Guarding",
    "Eviction", "Use of Firearms - Rifle", "Life Skills", "Life Science", "Policing", "Networking"
];

const movies = [
  "The Shawshank Redemption", "The Godfather", "The Dark Knight", "Pulp Fiction",
  "Forrest Gump", "Inception", "Fight Club", "The Matrix", "Goodfellas",
  "Sponge Bob Square Pants"
];

const carMakes = [
  // Japanese
  "Toyota",
  "Nissan",
  "Honda",
  "Mazda",
  "Suzuki",
  "Subaru",
  "Mitsubishi",
  "Volkswagen",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Porsche",
  "Renault",
  "Peugeot",
  "Volvo",
  "Hyundai",
  "Kia",
  "Ford",
  "Chevrolet",
  "Jeep",
  "Tesla",
  "Dodge",
  "Chery",
  "Haval",
  "Geely",
  "BYD",
  "GWM",
  "Tata",
  "Mahindra",
  "Isuzu",
  "Land Rover",
  "Mini",
  "Fiat"
];


/*=======================================================================================*/

export default function MultiSelectionDropdownTest() {
    const [output, setOutput] = useState('');
    const [aKey, setAKey] = useState(0);
    const { 
        addCollection,
        collectionExists,
        updateCollection,
        getSelected
    } = useCollectionsContext();

    const collectionNames = {
        INTERESTS: "INTERESTS",
        TOPICS: "TOPICS"
    };

    useEffect(()=> {
        if (!collectionExists(collectionNames.INTERESTS)) {
            // Create an INTERESTS collection sorted in ascending order.
            addCollection(collectionNames.INTERESTS, // collection name
                          interests, // collection data
                          1, // maximum number of selections
                          true, // primitive type data (string in this case)
                          'asc'); // asc - sort order 
        }
        if (!collectionExists(collectionNames.TOPICS)) {
            // Create a topics collection sorted in ascending order. Initially empty pending the selection of interests
            addCollection(collectionNames.TOPICS,
                            [], // empty
                            5, // allow max 5 selections
                            true, // primitive type data
                            'asc'); 
        }
    }, []);

    /**Respond when the user has chosen an interest */
    function interestSelected() {
        // Obtain the selected items. Only 1 selection was made (size 1 array)
        const selectedInterest = getSelected(collectionNames.INTERESTS)[0];

        let updateData = [];
        if (selectedInterest === "Education") // Education selected
            updateData = education;
        else if (selectedInterest === "Sport") // Sport selected
            updateData = sport;
        else if (selectedInterest === "Movies") // Movies selected
            updateData = movies;
        else if (selectedInterest === "Cars")
            updateData = carMakes;

        updateCollection(collectionNames.TOPICS, updateData);

        // Force the re-render the topics Dropdown, since its data has been updated.
        setAKey(aKey + .0001);
    }

    function topicSelected() {
        const selectedInterest = getSelected(collectionNames.INTERESTS)[0]; // string
        const selectedTopics = getSelected(collectionNames.TOPICS); // array
        
        setOutput(<p>{`${selectedInterest} => `}<br/>{selectedTopics.join(", ").trim()}</p>);
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '70px'}}>Choose your interest</label>
                <MultiSelectionDropdown label='Interests' collectionName={collectionNames.INTERESTS}
                    onItemsSelected={interestSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '70px'}}>Topics</label>
                <MultiSelectionDropdown key={aKey} collectionName={collectionNames.TOPICS} label='Topics'
                    onItemsSelected={topicSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}                     
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />               
            </div>

            <>{output}</>

        </div>
    );
}