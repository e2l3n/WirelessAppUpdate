// check if an element exists in array using a comparer function and return true/false
// comparer : function(currentElement)
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer(this[i])) return true; 
    }
    return false; 
}; 

// adds an element to the array if it does not already exist using a comparer 
// function
Array.prototype.pushIfNotExist = function(element, comparer) { 
    if (!this.inArray(comparer)) {
        this.push(element);
    }
}; 

//Public methods
module.exports = {
    findObjectInArray: function(array, comparer) {
	    for(var i=0; i < array.length; i++) { 
	        if(comparer(array[i])) {
	        	return array[i];
	        } 
	    }
	
	    return null; 
    }
};