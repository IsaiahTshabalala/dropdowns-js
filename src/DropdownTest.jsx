/**File: ./src/DropdownTest.jsx
 * Author: ITA
 * DropdownTest: A sample component demonstrating the use of the Dropdown.
 * 
 * Change Log
 * =========================================================
 * Start Date  End Date     Version   Author  Description
 * =========================================================
 * 2025/12/16               1.0.0     ITA     Genesis.
 * 2026/01/11  2026/01/16   1.0.1     ITA     Use of the Dropdown component no longer requires a Collections context provider.
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

// Test type 1: NPM package testing.
import { Dropdown } from 'dropdowns-js';
import 'dropdowns-js/style.css';

// Test type 2: local testing.
// import { Dropdown } from './dropdowns/Dropdown';

import { useEffect, useState } from 'react';

/*======= Collections/lists to be used to illustrate how to use Dropdown ============*/
const interests = ["Education", "Sport", "Movies"];
const sport = [
    "Motor Racing", "Cycling", "Wrestling", "Kung Fu", "Boxing", "Basket Ball",
    "Rugby", "Cricket", "Running", "Soccer", "Netball", "Hockey"
];

const education = [
    "Hunting", "Mathematics", "Physics", "Philosophy", "Programming", "Cooking", "Guarding",
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
    const [selectedInterest, setSelectedInterest] = useState();
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);

    useEffect(()=> {
        interestSelected(interests[0]);
    }, []);

    /**Respond when the user has chosen an interest */
    function interestSelected(selInterest) {
        if (selInterest !== selectedInterest)
            setSelectedInterest(prev=> selInterest);

        // Obtain the selected items. Only 1 selection was made (size 1 array)
        let updateData;
        if (selInterest === "Education") // Education selected
            updateData = education;
        else if (selInterest === "Sport") // Sport selected
            updateData = sport;
        else // Movies selected
            updateData = movies;

        setTopics(prev=> updateData);
        const selTopic = updateData[0];
        topicSelected(selTopic);
        setOutput(`${selInterest} => ${selTopic}`);
    }

    function topicSelected(selTopic) {
        setSelectedTopic(prev=> selTopic);
        setOutput(`${selectedInterest} => ${selTopic}`);
    }

    return (
        <div className='' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>Dropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor="interests" style={{width: '70px'}}>Choose your Interest</label>
                <Dropdown id="interests" 
                          label={'Interests'}
                          data={interests}
                          selected={selectedInterest} // Default selection.
                          onItemSelected={interestSelected}
                          dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label htmlFor="topics" style={{width: '70px'}}>Topics</label>
                <Dropdown id="topics"
                          label={'Topics'}
                          data={topics}
                          selected={selectedTopic}
                          onItemSelected={topicSelected}
                          dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}} />               
            </div>

            <p>{output}</p>

        </div>
    );
}