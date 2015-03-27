@echo off

type .\Menis\_init.js >  menis.out.js
echo.                 >> menis.out.js
type .\Menis\Menis.js >> menis.out.js
type .\Menis\Reflection.js >> menis.out.js

for /f %%f in ('dir ".\Menis\*.js" /s /b') do (
	if not "%%f" == ".\Menis\Menis.js" if not "%%f" == ".\Menis\Reflection.js" if not "%%f" == ".\Menis\_init.js" if not "%%f" == ".\Menis\_end.js" (
		echo.    >> menis.out.js
		type %%f >> menis.out.js
	)
)

echo.                >> menis.out.js
type .\Menis\_end.js >> menis.out.js