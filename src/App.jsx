/** File: ./src/App.jsx
 * =========================================================
 * Date                 Dev     Version Description
 * 2025/12/22     ITA     1.0.0     Genesis
 * =========================================================
 */
// import DropdownTest from "./DropdownTest";
// import DropdownObjTest from "./DropdownObjTest";
// import MultiSelectionDropdownTest from "./MultiSelectionDropdownTest";
import MultiSelectionDropdownObjTest from "./MultiSelectionDropdownObjTest";

// Depending on how you are testing the components, you need to uncomment the appropriate import statement below.

// Test type 1: Local project testing.
// import { CollectionsProvider } from "./dropdowns/CollectionsProvider";

// Test type 2: NPM package testing.   
import { CollectionsProvider } from "dropdowns-js";

function App() {
    return (
        <CollectionsProvider>
            { // Comment/uncomment appropriate tester component depending on which dropdown are you testing.
                // <DropdownTest/>
                // <DropdownObjTest/>
                // <MultiSelectionDropdownTest/>
                <MultiSelectionDropdownObjTest/>
            }
        </CollectionsProvider>
    );
}

export default App;
