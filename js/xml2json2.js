
//----------------------xml 
//
function xml2json(xmlText, parseNodeValue=false, parseAttributeValue=false, indentBy='  '){
    let result = parser.parse(xmlText,buildParsingConfig(parseNodeValue, parseAttributeValue));
    let jsonText = JSON.stringify(result,null,indentBy)
    return jsonText;

    function buildParsingConfig(parseNodeValue=false, parseAttributeValue=false, indentBy='  '){
        let config = {
            attributeNamePrefix : "@_",
            attrNodeName: false, //"@",  //false,               //Group all the attributes
            textNodeName : "#text",
            ignoreAttributes : false,                           //Ignore attributes
            ignoreNameSpace : false,                            //Remove namespace string from tag and attribute names.
            parseNodeValue : parseNodeValue, //false            //Parse text-node's value to float / integer / boolean.
            parseAttributeValue : parseAttributeValue, //false  //Parse attribute's value to float / integer / boolean.
            allowBooleanAttributes: true, 
            trimValues: true, 
            decodeHTMLchar: false,
            arrayMode : true, //false

            cdataTagName: false, //'val',                       // TagName to parse CDATA as separate property
            cdataPositionChar: "\\c",
            localeRange : '',
        };
        // Object.assign({a:1},{b:2}, {a:222}); //{a: 222, b: 2}
        return config;
    }
}

//
function json2xml(jsonText, format=true, indentBy='    '){
    let result = buildJ2XParser(format, indentBy).parse(JSON.parse( jsonText ));
    let xmlText = '<'+'?'+'xml version="1.0"'+'?'+'>\n' + result
    return xmlText;

    function buildJ2XParser(format=true, indentBy='    '){
        var defaultOptions = {
            attributeNamePrefix : "@_",
            attrNodeName: false, // "@", //false,
            textNodeName : "#text",
            ignoreAttributes : false,
            cdataTagName: false, 
            cdataPositionChar: "\\c",
            format: format, //true,
            indentBy: indentBy, //'    ',
            supressEmptyNode: false
        }
        // Object.assign({a:1},{b:2}, {a:222}); //{a: 222, b: 2}
        return new parser.j2xParser(defaultOptions);
    }
}

//ex)
// console.log(xml2json( xmlText, false, true, '  ' ))
// console.log(json2xml( jsonText, true, '  ' ))

    //SCRIPT-SRC:  https://cdnjs.cloudflare.com/ajax/libs/fast-xml-parser/3.18.0/parser.min.js 
    //API: https://github.com/NaturalIntelligence/fast-xml-parser
