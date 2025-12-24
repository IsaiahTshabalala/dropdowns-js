/**File: ./src/DropdownTest.jsx
 * Author: ITA
 * DropdownTest: A sample component demonstrating the use of the Dropdown.
 * 
 * Change Log
 * =========================================================
 * Date        Version   Author  Description
 * =========================================================
 * 2025/12/16  1.0.0     ITA     Genesis.
*/

/** VERY IMPORTANT!!!
 * Depending on how you are testing the components, you need to uncomment the appropriate import statements below.
 * 
 * Test type 1:
 * If you are testing the dropdown components as part of this project,
 * then import Dropdown and useCollectionsContext from the local filepath of this project.
 * 
 * Test type 2:
 * If you are testing the component as an npm package, then import from 'dropdowns-js'.
 * 
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

import { Dropdown, useCollectionsContext } from 'dropdowns-js';
import 'dropdowns-js/style.css';

//import { useCollectionsContext } from './dropdowns/CollectionsProvider';
// import { Dropdown } from './dropdowns/Dropdown';

import { useEffect, useState } from 'react';

/*======= Collections/lists to be used to illustrate how to use Dropdown ============*/
const interests = ["Education", "Sport", "Movies"];
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

/*=======================================================================================*/

export default function DropdownTest() {
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
            // Create an INTERESTS collection
            addCollection(collectionNames.INTERESTS, // collection name
                          interests, // collection data
                          1, // Maximum number of allowed selections.
                          true, // true = primitive type data collection
                          'asc'); // sort order
        }
        if (!collectionExists(collectionNames.TOPICS)) {
            // Create a topics collection, initially empty pending a selection of an interest
            addCollection(collectionNames.TOPICS, [], 1, true, 'asc');
        }
    }, []);

    /**Respond when the user has chosen an interest */
    function interestSelected() {
        // Obtain the selected items. Only 1 selection was made (size 1 array)
        const selectedInterest = getSelected(collectionNames.INTERESTS)[0];

        let updateData;
        if (selectedInterest === "Education") // Education selected
            updateData = education;
        else if (selectedInterest === "Sport") // Sport selected
            updateData = sport;
        else // Movies selected
            updateData = movies;

        updateCollection(collectionNames.TOPICS, updateData);

        // Refresh the topics Dropdown, since it's data has been updated.
        setAKey(aKey + .0001);
    }

    function topicSelected() {
        const selectedInterest = getSelected(collectionNames.INTERESTS)[0];
        const selectedTopic = getSelected(collectionNames.TOPICS)[0];
        setOutput(`${selectedInterest} => ${selectedTopic}`);
    }

    return (
        <div className='' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>Dropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor="interests" style={{width: '70px'}}>Choose your Interest</label>
                <Dropdown id="interests" label={'Interests'} collectionName={collectionNames.INTERESTS} onItemSelected={interestSelected}
                          dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor="topics" style={{width: '70px'}}>Topics</label>
                <Dropdown id="topics" key={aKey} collectionName={collectionNames.TOPICS} label={'Topics'} onItemSelected={topicSelected}
                          dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />               
            </div>

            <p>{output}</p>

        </div>
    );
}