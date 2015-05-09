
//Check if string has specific prefix
String.prototype.hasPrefix = function (str){
    return this.slice(0, str.length) == str;
};

