if (test-path platform_game.js) { clear-content platform_game.js }
$starting_files = @("_init.js", "Game.js")
$starting_files | % { gc "js\$_" | ac platform_game.js }
gci js\*.js -Recurse -Exclude ($starting_files + "_end.js") | gc | ac platform_game.js
gc js\_end.js | ac platform_game.js