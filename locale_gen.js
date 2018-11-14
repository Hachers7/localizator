var convertXLSXToJSON = require('./src/js/convertXLSXToJSON.js');
var generateLocales = require('./src/js/generateLocales.js');

var excelFileName = './src/excel/' + process.argv[2];
var jsonFileName  = './src/json/test.json';

var templateFileName = './src/templates/template.xml';
var locales;

if(process.argv[3] == '-l')
{
    locales = process.argv.slice(4);
}
else
{
    locales = ['en', 'es', 'it'];
}

locales = locales.map((locale) => {return {fileName : './src/locales/' + locale + '.xml', localeId : locale};});

convertXLSXToJSON(excelFileName, jsonFileName).then(generateLocales(jsonFileName, templateFileName, locales));