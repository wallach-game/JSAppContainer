shell for all icons is 
find -ipath ".*/materialicons/black/res/drawable/*"

find -ipath "./material-design-icons/android/*/materialicons/black/res/drawable/*" | xargs node androidXml2SvgCnv.js


kod pro ulozeni editace ikon
node codegen.js icons.txt > code.html