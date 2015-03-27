type .\js\_init.js > platform_game.out.js
type .\js\Game.js >> platform_game.out.js

dir js -recurse | ? { $_ -is [System.IO.FileInfo] -and ("Game.js", "_init.js", "_end.js") -notcontains $_.Name } | % {

    echo `n >> platform_game.out.js
    type $_.FullName >> platform_game.out.js
}

type .\js\_end.js >> platform_game.out.js