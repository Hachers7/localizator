var XLSX = require('xlsx');
var fs = require('fs');

var convertXLSXToJSON = function(excelFileName, jsonFileName)
{

    var promise = new Promise((resolve) =>
    {
        var workbook = XLSX.readFile(excelFileName);
        var sheet_name_list = workbook.SheetNames;
        var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        var json = JSON.stringify(xlData);

        fs.writeFile(jsonFileName, json, 'utf8', function (err)
            {
                if(err)
                {
                    console.log('Error writing json file!');
                }
                else {
                    console.log('JSON file created!');
                    resolve();
                }
            }
        );
    });

    return promise;
};

module.exports = convertXLSXToJSON;