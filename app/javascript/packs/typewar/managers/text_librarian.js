/* The Text Librarian module
 * It looks inside a text library and retrieves text based on a desired
 * difficulty and length
 */


Typewar.Util.TextLibrarian = ( function (_){
  var retrieve,
  // private methods
    getTextFromLibrary, filterDifficulty, filterLength, obtainNextBestFit,
    findNearestSegments,
  // Constants
    MIN_LIB_RESULT_SIZE;

  MIN_LIB_RESULT_SIZE = 10;

  retrieve = function (library, options){
    var found_text_segments;

    if(!library){ throw "ERROR: TextLibrarian.retrieve called without a text library"; }
    if(!options){ options = {} };
    options["difficulty"]       = options["difficulty"]         || 1;
    options["min_difficulty"]   = options["min_difficulty"]     || null;
    options["max_difficulty"]   = options["max_difficulty"]     || null;
    options["length"]           = options["length"]             || (Math.random()*140);
    options["min_length"]       = options["min_length"]         || null;
    options["max_length"]       = options["max_length"]         || null;

    return getTextFromLibrary(library, options);
  };

  // private 

  getTextFromLibrary = function (library, options){
    var output;

    output = filterLength(library, options);
    output = filterDifficulty(output, options);


    if(output.length < MIN_LIB_RESULT_SIZE){
      output = obtainNextBestFit(library, options);
    }
    return _.sample(output).text;
  };

  filterDifficulty = function (library, options){
    var min_diff, max_diff;

    min_diff = options.min_difficulty;
    max_diff = options.max_difficulty;
    if(!min_diff || !max_diff){
      min_diff = options.difficulty;
      max_diff = options.difficulty;
    }
    return _.filter(library, function (curr_item){
      return (
        curr_item.difficulty >= min_diff &&
        curr_item.difficulty <= max_diff
      );
    });
  };

  filterLength = function (library, options){
    var min_length, max_length;

    min_length = options.min_length;
    max_length = options.max_length;
    if(!min_length || !max_length){
      min_length = options.length;
      max_length = options.length;
    }

    return _.filter(library, function (curr_item){
      return (
        curr_item.length >= min_length &&
        curr_item.length <= max_length
      );
    });
  };

  // Assumes a sorted library of text segments
  findNearestSegments = function (library, num_to_find){
    var closest_match, output, itor, local_lib;

    output = [];
    local_lib = _.clone(library);
    if(local_lib.length <= MIN_LIB_RESULT_SIZE){
      return local_lib;
    }
    closest_match = binarySearchLibrary(local_lib, num_to_find, 0, local_lib.length-1, null);

    for(itor = 0; output.length < MIN_LIB_RESULT_SIZE; itor++){
      if(!closest_match || closest_match < 0){ throw "ERROR: " };
      if(local_lib[closest_match]) {
        output.push(local_lib[closest_match]);
        local_lib.splice(closest_match, 1);
        continue;
      }
      closest_match--;
    }

    return output;
  };

  binarySearchLibrary = function (library, target, min_idx, max_idx, prev_idx){
    var next_val, next_idx, prev_val, next_val_dist_from_target, next_try_idx;

    if(!library || library.length === 0){
      throw "ERROR: binarySearchLibrary called without a valid library";
    }

    next_idx = Math.round( ((max_idx - min_idx) / 2) + min_idx );
    next_val = library[next_idx];
    prev_val = (prev_idx ? library[prev_idx] : null);
    min_val = library[min_idx];
    max_val = library[max_idx];

    if(!next_val) { return (prev_idx || 0); }

    if(next_val.length === target) { return next_idx; }
    if(target <= min_val.length) { return min_idx; }
    if(target >= max_val.length) { return max_idx; }

    // Check for the existence of the target between the curr index and adjacents: 
    if(library[next_idx-1].length === target) { return (next_idx-1); }
    if(library[next_idx-1].length <= target && 
      target <= next_val.length) { 
      return next_idx; 
    }
    if(library[next_idx+1].length === target) { return (next_idx+1); }
    if((next_val.length <= target) && 
      (target <= library[next_idx+1].length)) { 
      return next_idx; 
    }

    if(!prev_val) { // We're on the first call to this recursive, so go ahead and try again
      if(next_val.length > target) { 
        return binarySearchLibrary(library, target, min_idx, next_idx, next_idx);
      }else if(next_val.length < target) {
        return binarySearchLibrary(library, target, next_idx, max_idx, next_idx);
      }else{
        throw "Error: Comparison of current search value with target failed";
      }
    }

    // If the previous value is closer to the target than the current value, return the previous
    next_val_dist_from_target = distanceFromTarget(next_val, target);
    prev_val_dist_from_target = distanceFromTarget(prev_val, target);
    if(next_val_dist_from_target >= prev_val_dist_from_target) { return prev_idx; }

    if(max_idx === min_idx || max_idx === min_idx+1) { return prev_idx; }

    // Base case
    if(next_val.length > target) { 
      return binarySearchLibrary(library, target, min_idx, next_idx, next_idx);
    }else if(next_val.length < target) {
      return binarySearchLibrary(library, target, next_idx, max_idx, next_idx);
    }else{
      throw "Error: Comparison of current search value with target failed";
    }
  };

  distanceFromTarget = function (current, target){
    return (target.length - target);
  }

  obtainNextBestFit = function (library, options){
    var output;

    output = _.sortBy(library, "difficulty");
    output = _.sortBy(output, "length");
    return findNearestSegments(output, MIN_LIB_RESULT_SIZE);
  };

  return {
     binarySearchLibrary: binarySearchLibrary,
     findNearestSegments: findNearestSegments,
       obtainNextBestFit: obtainNextBestFit,
                retrieve: retrieve,
  };
})(_);
