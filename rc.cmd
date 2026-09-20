@echo off
cd /d C:\laragon\www\skripsi\format-skripsi
call npm run generate 1>gen-out.log 2>&1
set ec=%errorlevel%
echo npm-exit=%ec%
findstr /C:"Berhasil membuat" gen-out.log
if exist chk.zip del /q chk.zip
if exist "C:\laragon\www\skripsi\chkd" rmdir /s /q "C:\laragon\www\skripsi\chkd"
copy "output\template-skripsi-binus.docx" "C:\laragon\www\skripsi\chk.zip" >NUL
mkdir "C:\laragon\www\skripsi\chkd"
powershell -NoProfile -Command "Expand-Archive -Path 'C:\laragon\www\skripsi\chk.zip' -DestinationPath 'C:\laragon\www\skripsi\chkd' -Force"
echo.
echo ===settings.xml===
node -e "require('fs').readFileSync('C:/laragon/www/skripsi/chkd/word/settings.xml','utf8').split(/\n/).forEach(function(l){if(/evenAndOddHeaders|updateFields/.test(l))console.log(l.trim())})"
echo ===document.xml===
node -e "var s=require('fs').readFileSync('C:/laragon/www/skripsi/chkd/word/document.xml','utf8');console.log('lowerRoman x',(s.match(/fmt=\"lowerRoman\"/g)||[]).length);console.log('decimal x',(s.match(/fmt=\"decimal\"/g)||[]).length);console.log('titlePg x',(s.match(/<w:titlePg\/>/g)||[]).length);console.log('oddPage sect x',(s.match(/<w:type w:val=\"oddPage\"\/>/g)||[]).length);console.log('even hdr x',(s.match(/w:type w:val=\"even\"/g)||[]).length);console.log('default hdr x',(s.match(/w:type w:val=\"default\"/g)||[]).length);console.log('manual pagebr x',(s.match(/<w:br w:type=\"page\"\/>/g)||[]).length)"
