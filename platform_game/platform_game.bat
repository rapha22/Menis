@echo off

type .\js\_init.js >  platform_game.out.js

for %%f in (.\js\*.js) do (
	if not "%%f" == ".\js\Game.js" if not "%%f" == ".\js\_init.js" if not "%%f" == ".\js\_end.js" (
		echo.    >> platform_game.out.js
		type %%f >> platform_game.out.js
	)
)

echo.                         >> platform_game.out.js
type .\js\Game.js >> platform_game.out.js
echo.                         >> platform_game.out.js
type .\js\_end.js >> platform_game.out.js