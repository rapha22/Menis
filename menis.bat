@echo off

echo ***** Building Menis...

type .\Menis\_init.js >  menis.out.js
echo.                 >> menis.out.js
type .\Menis\Menis.js >> menis.out.js
type .\Menis\Util.js  >> menis.out.js

for /f %%f in ('dir ".\Menis\*.js" /s /b') do (
	if not "%%~nf" == ".Menis" (
	if not "%%~nf" == "Util"   (
	if not "%%~nf" == "_init"  (
	if not "%%~nf" == "_end"   (
		echo.    >> menis.out.js
		type %%f >> menis.out.js
	))))
)

echo.                >> menis.out.js
type .\Menis\_end.js >> menis.out.js

echo ***** Done building Menis.