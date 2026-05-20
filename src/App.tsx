/** File: ./src/App.jsx
 * =========================================================
 * Start Date   End Date    Dev     Version   Description
 * 2025/12/22               ITA     1.0.0     Genesis
 * 2026/01/11   2026/01/16  ITA     1.0.1     Working with the dropdown compnents no longer requires a Collections context provider.
  * 2026/05/11  2026/05/15  ITA     2.0.0     Changed the file extension to .tsx and migrated to Typescript.
 * =================================================================================================
 */
import DropdownTest from "./DropdownTest.jsx";
// import DropdownObjTest from "./DropdownObjTest.jsx";
// import MultiSelectionDropdownTest from "./MultiSelectionDropdownTest.jsx";
// import MultiSelectionDropdownObjTest from "./MultiSelectionDropdownObjTest.jsx";

function App() {
    return (
        // Comment/uncomment appropriate tester component depending on which dropdown are you testing.
        <DropdownTest/>
        // <DropdownObjTest/>
        // <MultiSelectionDropdownTest/>
        // <MultiSelectionDropdownObjTest/>
    );
}

export default App;
