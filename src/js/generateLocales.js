var xml = require('xml');
var fs = require('fs');

var generateLocales = function (jsonFileName, templateFileName, locales)
{
    var promise = new Promise(resolve =>
    {
        if(!locales.length)
        {
            resolve();

            return;
        }

        fs.readFile(templateFileName, {encoding: 'utf8'}, function(err, templateData)
        {
            if(err)
            {
                console.log('Cannot read template file!');
            }
            else
            {
                var labels = findLabels(templateData);

                fs.readFile(jsonFileName, {encoding: 'utf8'}, function (e, jsonData)
                {
                    if(e)
                    {
                        console.log('Cannot read json file!');
                    }
                    else
                    {
                        var json = JSON.parse(jsonData);
                        Promise.all(locales.map((locale) =>
                        {
                            var dictionary = {};
                            json.forEach(function(x) {
                                dictionary[x.unique_id] = x[locale.localeId];
                            });
                            return generateLocale(locale, templateData, dictionary, labels);
                        })).then(function()
                        {
                            console.log('Generation successfull!');
                            resolve();
                        });
                    }
                });
            }
        });
    });

    return promise;
};

var findLabels = function(text)
{
    var labels = [];

    while(text.indexOf('@{') != -1)
    {
        text = text.substring(text.indexOf('@{') + 2);
        if(text.indexOf('}') == -1)
        {
            console.log("Template file parse error!");
        }
        else
        {
            var id = text.substring(0, text.indexOf('}'));

            if(isNaN(id))
            {
                console.log("Template file id error!");
            }
            else
            {
                labels.push(Number(id));
                text = text.substring(text.indexOf('}') + 1);
            }
        }
    }

    console.log(labels);

    return labels;
};

var generateLocale = function(locale, templateData, dictionary, labels)
{
    var promise = new Promise((resolve) =>
    {
        for(var i = 0; i < labels.length; i++)
        {
            var label = "@{" + labels[i] + "}";
            var str = dictionary[labels[i]];

            templateData = templateData.substring(0, templateData.indexOf(label)) + str + templateData.substring(templateData.indexOf(label) + label.length);
        }

        fs.writeFile(locale.fileName, templateData, function(err)
        {
            if(err)
            {
                console.log("Error creating locale " + locale.fileName);
            }
            else
            {
                resolve();
            }
        });
    });

    return promise;
};

module.exports = generateLocales;