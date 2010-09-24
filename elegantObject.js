var elegantObject = (function () {
  var data,
    indent = 0,
    br = "<br>",
    spanTypes = {
      "reserved": "color:#00007F; font-weight:bold;",
      "number": "color:#349934;",
      "string": "color:#FF8100;"
    },
    space = function (indents) {
      return new Array(indents + 1)
        .join("<span style='color:#DADADA'>|</span>&nbsp;");
    },
    span = function (text, type) {
      data += "<span style='" + spanTypes[type] + "'>" + text + "</span>";
    },
    handle = {
      "object": function (obj) {
        var firstProp = true,
          prop;
        if (obj === null) {
          span("null", "reserved");
        }
        else if (obj.length !== undefined) {
          handle.array(obj);
        }
        else {
          data += "{" + br + space(++indent);
          for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              if (firstProp) {
                firstProp = false;
              }
              else {
                data += "," + br + space(indent);
              }
              handle[typeof prop](prop);
              data += ": ";
              handle[typeof obj[prop]](obj[prop]);
            }
          }
          data += br + space(--indent) + "}";
        }
      },
      "array": function (arr) {
        data += "[" + br + space(++indent);
        for (var i = 0; i < arr.length; i++) {
          if (i !== 0) {
            data += "," + br + space(indent);
          }
          handle[typeof arr[i]](arr[i]);
        }
        data += br + space(--indent) + "]";
      },
      "function": function (func) {
        var funcStr = String(func)
          .replace(/\n/g, " ")
          .replace(/\ +/g, " ");
        data += (funcStr.length > 60) ?
          funcStr.substr(0, 56) + "... " : funcStr;
      },
      "number": function (num) {
        if (isNaN(num)) {
          span("NaN", "reserved");
        }
        else {
          span(num, "number");
        }
      },
      "string": function (str) {
        span("\"" + str.replace(/\"/g, "\\\"") + "\"", "string");
      },
      "boolean": function (bool) {
        span((bool ? "true" : "false"), "reserved");
      },
      "undefined": function () {
        span("undefined", "reserved");
      }
    };
  
  return function (obj, outputElm) {
    data = "";
    handle[typeof obj](obj);
    if (outputElm) {
      outputElm.innerHTML = data;
    }
    return data;
  };
}());
