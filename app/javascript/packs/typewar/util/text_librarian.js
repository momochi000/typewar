/* The Text Librarian module
 * It looks inside a text library and retrieves text based on a desired
 * difficulty and length
 */

// This is a flag to help me tweak these values. I should probably write a util to do this
const TEXT_DEBUG = true;

const MIN_LIB_RESULT_SIZE = 4;
const INFINITE_LOOP_GUARD = 20;

export default class TextLibrarian {

  static retrieve(library, options){
    var found_text_segments;

    if(!library){ throw "ERROR: TextLibrarian.retrieve called without a text library"; }
    if(!options){ options = {} };

    return this.getTextFromLibrary(library, options);
  }

  // private 

  static getTextFromLibrary(library, options){
    var output, index, loop_count, temp_word, target_length;

    dbg("DEBUG: BEGIN LIB REQ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    dbg("DEBUG: options are ---->", options);

    output = [];
    temp_word = _.sample(library);
    index = library.indexOf(temp_word);
    loop_count = 0;
    output.push(temp_word);
    if(options.minLength && options.maxLength) { 
      target_length = _.random(options.minLength, options.maxLength);
    }else{
      target_length = options.minLength;
    }
    dbg("DEBUG: target length determined as ---->", target_length);
    for(;;){
      loop_count += 1;
      if(this.lengthOfOutputString(output) > target_length) { 
        dbg("DEBUG: finished building string from library -----------> ", output);
        dbg("DEBUG: END LIB REQ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        dbg("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        return output.join(" "); 
      }
      if((index+1) > library.length) {
        let temp_word = _.sample(library);
        index = library.indexOf(temp_word);
        output.push(temp_word);
      }else{
        output.push(library[++index]);
      }
      if(loop_count >= INFINITE_LOOP_GUARD) { return output.join(" "); }
    }
  }

  static lengthOfOutputString(array) {
    return array.join(" ").length;
  }
}

function dbg(str, args) {
  if(TEXT_DEBUG) {
    console.log(str, args);
  }
}
