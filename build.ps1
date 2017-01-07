if (test-path menis.js) { clear-content menis.js }
$starting_files = @("_init.js", "Menis.js", "Reflection.js", "Observable.js", "Entity.js", "EntityManager.js")
$starting_files | % { gc "Menis\$_" | ac menis.js }
gci Menis\*.js -Recurse -Exclude ($starting_files + "_end.js") | gc | ac menis.js
gc Menis\_end.js | ac menis.js