/**File: ./src/MultiSelectionDropdownTest.jsx
 * Author: ITA
 * MultiSelectionDropdownTest: A sample component demonstrating the use of the MultiSelectionDropdown.
 * 
 * Change Log
 * =========================================================
 * Start Date  End Date    Version   Author   Description
 * =========================================================
 * 2025/12/19              1.0.0      ITA     Genesis.
 * 2026/01/11  2026/01/16  1.0.1      ITA     Working with the MultiSelectionDropdown no longer requires a Collections context provider.
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
 * Based on the above, please comment/uncomment the appropriate import statements below.
 */

// Test type 1: Local project testing.
// import { MultiSelectionDropdown } from './dropdowns/MultiSelectionDropdown';

// Test type 2: NPM package testing.
import { MultiSelectionDropdown } from 'dropdowns-js';
import 'dropdowns-js/style.css';

import { useState } from 'react';

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
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);

    /**Respond interest selection */
    function interestSelected(pInterests) {
        setSelectedInterests(pInterests);
        let topicUpdate = [];
        pInterests.forEach(item=> {
            if (item === "Education") // Education selected
                topicUpdate = [ ...topicUpdate, ...education ];
            else if (item === "Sport") // Sport selected
                topicUpdate = [ ...topicUpdate, ...sport ];
            else if (item === "Movies") // Movies selected
                topicUpdate = [ ...topicUpdate,...movies ];
            else if (item === "Cars")
                topicUpdate = [ ...topicUpdate, ...carMakes ];
        });
        setTopics(prev=> topicUpdate);
        setSelectedTopics(prev=> [topicUpdate[0], topicUpdate[1]]);
    }

    /**Respond topic selection */
    function topicSelected(selTopics) {
        setSelectedTopics(prev=> selTopics);
        setOutput(prev=> (<p>{`${selectedInterests.join(", ").trim()} => `}<br/>{selTopics.join(", ")}</p>));
    }

    return (
        <div className='container' style={{padding: '5px', backgroundColor: 'green'}}>
            <h1>MultiSelectionDropdown Example</h1>
            <p>Select an interest, and then your topic</p>
            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '70px'}}>Choose your interest</label>
                <MultiSelectionDropdown
                    label='Interests'
                    data={interests}
                    sortOrder='desc'
                    maxNumSelections={2}
                    onItemsSelected={interestSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />
            </div>

            <div style={{padding: '2px', display: 'flex'}}> 
                <label style={{width: '70px'}}>Topics</label>
                <MultiSelectionDropdown
                    label='Topics'
                    data={topics}
                    maxNumSelections={5}
                    selectedData={selectedTopics}
                    onItemsSelected={topicSelected}
                    dropdownStyle={{color: '#000', backgroundColor: '#66ff66'}}                     
                    buttonStyle={{color: '#fff', backgroundColor: '#008000'}} />               
            </div>

            <>{output}</>

        </div>
    );
}