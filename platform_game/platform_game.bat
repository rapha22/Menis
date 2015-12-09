@echo off

setlocal EnableDelayedExpansion

echo **** Building platform_game...

pushd ..
call %~dp0..\menis.bat
popd

type .\js\_init.js >  platform_game.out.js
echo.             >> platform_game.out.js
type .\js\Game.js >> platform_game.out.js

for /f %%f in ('dir ".\js\*.js" /s /b') do (
	if not "%%~nf" == "Game" if not "%%~nf" == "_init" if not "%%~nf" == "_end" (
		echo.    >> platform_game.out.js
		type %%f >> platform_game.out.js
	)
)

echo.             >> platform_game.out.js
type .\js\_end.js >> platform_game.out.js

echo **** Done building platform_game.