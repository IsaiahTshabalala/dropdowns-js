## 2025/12/18 - Version 1.0.0 - ITA
Genesis.  
  
## 2025/12/25 - Version 1.0.1 - ITA
Add more clarity to documentation: dropdown component attributes.
  
## 2025/12/25 - Version 1.0.2 - ITA
Sync version with package.json version.
  
## 2025/12/26 - Version 1.0.3 - ITA
* Replace the arrow icons with +/- characters, for better cross-platform rendering.  
* Collection class: fix comparison function to properly compare object type data.

## 2025/12/26 - Version 1.0.4 - ITA
- Mention backgroundColor as an additional attribute (optional) when specifying the dropdownStyle.  

## 2025/12/27 - Version 1.0.5 - ITA
- Updated the dependency package some-common-functions-js.  

## 2025/12/27 - Version 1.0.6 - ITA
- Switched to ESM-only build output for improved compatibility with CRA and modern bundlers.
- Simplified module resolution to avoid dual ESM/CJS ambiguity.

## 2025/12/27 - Version 1.0.7 - ITA & Gemini
- Updated the dependency package some-common-function-js.
- Updated vite.config to tell vite to treat React as an external dependency.
- Updated package.json to treat react and react-dom as a dev dependency as well, in addition to being a peer dependency.

## 2025/12/27 - Version 1.0.8
- Efficient use of the object functions from some-common-functions-js, which are recursive, in the CollectionsProvider context hook.
- Placeholder text in the text input of the dropdowns to also show the name of the data, as provided by the label attribute.

## 2026/01/01 - Version 1.0.9
Updated the current package to use the latest some-common-functions-js package. Given the changes that were done to change recursive functions to iterative, thereby overcoming stack limits imposed by browsers.  

## 2026/01/11 to 2026/01/16 - Version 1.1.1
- Collections context and provider removed, and no longer necessary for use by the consumers of this package.

## 2026/01/16 to 2026/01/16 - Version 1.1.2
- Removed the multiple dropdown usage example from the README file. It had not been updated when Collections context and provider was removed. The remaining dropdown usage examples suffice.  

## 2026/01/17 to 2026/01/17 - Version 1.1.3
- Removing attributes that do not apply to Dropdown component.
- Renaming 'sortDirection' in MultiSelectionDropdown to 'sortOrder', ensuring consistent naming of attributes across the dropdown components.  

## 2026/01/17 to 2026/01/17 - Version 1.1.4
Dropdown: Corrected proptypes to include onItemSelected instead of onItemsSelected, since this is a single selection dropdown.


  



  

