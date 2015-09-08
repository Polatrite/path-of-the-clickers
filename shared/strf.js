module.exports = function(str, ctx) {
    var chars = str.split('');
    var output = '';
    var last = '';
    var open_i = 0;
    var open_c = 0;
    var has_ctx = arguments.length > 1;
    
    for (var i = 0, l = chars.length; i < l; i++) {
    	if (chars[i] == '[') {
            if (last == '[' && open_i == i - 1) { 
                open_c = 0;
                output += '[';
                last = '';
                open_i = i + 1;
            }
            else {
                if (!open_c) {
                	output += str.slice(open_i, i);
                    open_i = i;
                }
                open_c++;
            }
    	}
    	else if (chars[i] == ']') {
    		if (last == ']' && !open_c) {
    			output += str.slice(open_i, i);
    			open_i = i + 1;
                last = '';
            }
            else if (open_c == 1) {
            	try {
            		if (has_ctx) {
                  		output += eval('ctx.' + str.slice(open_i + 1, i));
                  	}
                  	else {
                  		output += eval(str.slice(open_i + 1, i));
                  	}
                }
                catch(e) {
                }
                open_c = 0;
                open_i = i + 1;
            }
            else if (open_c > 0) {
                open_c--;
            }
    	}
        last = chars[i];
    }
    
    if (open_c) {
    	output += str.slice(open_i + 1);
    }
    else {
    	output += last == ']' ? str.slice(open_i, -1) : str.slice(open_i);
    }
    return output;
}