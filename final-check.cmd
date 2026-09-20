@echo off
cd /d C:\laragon\www\skripsi
node -e "const fs=require('fs');const st=fs.statSync('format-skripsi/output/template-skripsi-binus.docx');console.log('FINAL docx:',st.size,'bytes',st.mtime.toISOString());"
if exist chkd rmdir /s /q chkd
copy "format-skripsi\output\template-skripsi-binus.docx" "chk.zip" >NUL
mkdir chkd
powershell -NoProfile -Command "Expand-Archive -Path 'C:\laragon\www\skripsi\chk.zip' -DestinationPath 'C:\laragon\www\skripsi\chkd' -Force"
node -e "const fs=require('fs');const s=fs.readFileSync('chkd/word/settings.xml','utf8');console.log('settings.xml: evenAndOddHeaders(true)=',/evenAndOddHeaders w:val=\"true\"/.test(s),'| updateFields(true)=',/updateFields w:val=\"true\"/.test(s));const d=fs.readFileSync('chkd/word/document.xml','utf8');console.log('document.xml: lowerRoman=',(d.match(/fmt=\"lowerRoman\"/g)||[]).length,'decimal=',(d.match(/fmt=\"decimal\"/g)||[]).length,'titlePg=',(d.match(/<w:titlePg\/>/g)||[]).length,'oddPage=',(d.match(/w:type w:val=\"oddPage\"/g)||[]).length,'manualBr=',(d.match(/<w:br w:type=\"page\"\/>/g)||[]).length,'startPg=',(d.match(/w:start=\"1\"/g)||[]).length);"
