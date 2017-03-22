/* The Text Librarian module
 * It looks inside a text library and retrieves text based on a desired
 * difficulty and length
 */

const MIN_LIB_RESULT_SIZE = 4;

export default class TextLibrarian {

  static retrieve(library, options){
    var found_text_segments;

    if(!library){ throw "ERROR: TextLibrarian.retrieve called without a text library"; }
    if(!options){ options = {} };

    return this.getTextFromLibrary(library, options);
  }

  // private 

  static getTextFromLibrary(library, options){
    var output;

    output = this.filterLength(library, options.minLength, options.maxLength)

    if(output.length < MIN_LIB_RESULT_SIZE){
      output = output.concat( _.sampleSize(library, 10));
    }

    return _.sample(output);
  }

  static filterLength(library, minL, maxL) {
    return _.filter(library, (curr) => {
      if(curr.length >= minL && curr.length <= maxL){
        return true;
      }
      return false;
    });
  }
}
