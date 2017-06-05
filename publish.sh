npm run build
cp -r ./src/* .
npm publish
rm -rf ./components ./directives ./managers ./mixins ./styles ./utils index.js
