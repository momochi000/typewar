describe("Util", function (){
  it("should be defined", function (){ expect(Typewar.Util).toBeDefined(); });
  it("should have access to underscore", function (){ expect(_).toBeDefined(); });
  it("should have access to jQuery", function (){ expect($).toBeDefined(); });

  describe(":: TextLibrarian", function (){
    var TL, lib_1_10, lib_0_9;

    it("should be defined", function (){
      expect(Typewar.Util.TextLibrarian).toBeDefined();
    });

    beforeEach( function (){
      TL = Typewar.Util.TextLibrarian;

      lib_1_10 = [
        {difficulty: 1, length: 1,  text: "a"},
        {difficulty: 1, length: 2,  text: "aa"},
        {difficulty: 1, length: 3,  text: "aaa"},
        {difficulty: 1, length: 4,  text: "aaaa"},
        {difficulty: 1, length: 5,  text: "aaaaa"},
        {difficulty: 1, length: 6,  text: "aaaaaa"},
        {difficulty: 1, length: 7,  text: "aaaaaaa"},
        {difficulty: 1, length: 8,  text: "aaaaaaaa"},
        {difficulty: 1, length: 9,  text: "aaaaaaaaa"},
        {difficulty: 1, length: 10, text: "aaaaaaaaaa"},
      ];
      lib_0_9 = [
        {difficulty: 1, length: 0,  text: ""},
        {difficulty: 1, length: 1,  text: "a"},
        {difficulty: 1, length: 2,  text: "aa"},
        {difficulty: 1, length: 3,  text: "aaa"},
        {difficulty: 1, length: 4,  text: "aaaa"},
        {difficulty: 1, length: 5,  text: "aaaaa"},
        {difficulty: 1, length: 6,  text: "aaaaaa"},
        {difficulty: 1, length: 7,  text: "aaaaaaa"},
        {difficulty: 1, length: 8,  text: "aaaaaaaa"},
        {difficulty: 1, length: 9,  text: "aaaaaaaaa"}
      ];
      
      lib_2 = [
        {difficulty: 1, length: 3,  text: "aaa"},
        {difficulty: 1, length: 5,  text: "aaaaa"}
      ];

      lib_sample = [
        {difficulty: 1, length: 1,  text: "a"},
        {difficulty: 1, length: 2,  text: "aa"},
        {difficulty: 1, length: 3,  text: "aaa"},
        {difficulty: 1, length: 4,  text: "aaaa"},
        {difficulty: 1, length: 5,  text: "aaaaa"},
        {difficulty: 1, length: 6,  text: "aaaaaa"},
        {difficulty: 1, length: 7,  text: "aaaaaaa"},
        {difficulty: 1, length: 8,  text: "aaaaaaaa"},
        {difficulty: 1, length: 9,  text: "aaaaaaaaa"},
        {difficulty: 1, length: 10, text: "aaaaaaaaaa"},
        {difficulty: 1, length: 11, text: "aaaaaaaaaaa"},
        {difficulty: 1, length: 12, text: "aaaaaaaaaaaa"},
        {difficulty: 1, length: 13, text: "aaaaaaaaaaaaa"},
        {difficulty: 1, length: 14, text: "aaaaaaaaaaaaaa"},
        {difficulty: 1, length: 15, text: "aaaaaaaaaaaaaaa"},
        {difficulty: 1, length: 16, text: "aaaaaaaaaaaaaaaa"}
      ]
    });

    describe(".retrieve", function (){ 
      describe("with a sample library", function (){
        var output;
        it("should return a single string", function (){
          output = TL.retrieve(lib_sample, {length: 10});
          expect(typeof(output)).toEqual("string");
        });
        it("should return a random string", function (){
          o1 = TL.retrieve(lib_sample, {length: 10});
          o2 = TL.retrieve(lib_sample, {length: 10});
          expect(o1).not.toEqual(o2);
        });
      });
    });

    describe(".binarySearchLibrary", function (){
      it("should return an integer", function (){
        var output;
        output = TL.binarySearchLibrary(lib_1_10, 0, 0, lib_1_10.length-1, null);
        expect(parseInt(output)).toEqual(output);
      });

      describe("when the text lib is empty", function (){
        it("should raise an exception", function (){
          var output;
          expect( function (){
            TL.binarySearchLibrary([], 1, 0, lib_1_10.length-1, null);
          }).toThrow();
        });
      });
      describe("when the text lib is of size 2", function (){
        it("should find index 0 when the target is 3", function (){
          var output;
          output = TL.binarySearchLibrary(lib_2, 3, 0, lib_2.length-1, null);
          expect(output).toEqual(0);
        });
        it("should find index 0 when the target is 2", function (){
          var output;
          output = TL.binarySearchLibrary(lib_2, 2, 0, lib_2.length-1, null);
          expect(output).toEqual(0);
        });
        it("should find index 1 when the target is 5", function (){
          var output;
          output = TL.binarySearchLibrary(lib_2, 5, 0, lib_2.length-1, null);
          expect(output).toEqual(1);
        });
        it("should find index 1 when the target is 9", function (){
          var output;
          output = TL.binarySearchLibrary(lib_2, 9, 0, lib_2.length-1, null);
          expect(output).toEqual(1);
        });
      });
      describe("with a text library of 10 items sorted 1-10", function (){
        it("should find index 0 when the target is 1", function (){
          var output;
          output = TL.binarySearchLibrary(lib_1_10, 1, 0, lib_1_10.length-1, null);
          expect(output).toEqual(0);
        });
        it("should find index 4 when the target is 5", function (){
          var output;
          output = TL.binarySearchLibrary(lib_1_10, 5, 0, lib_1_10.length-1, null);
          expect(output).toEqual(4);
        });
        it("should find index 9 when the target is 10", function (){
          var output;
          output = TL.binarySearchLibrary(lib_1_10, 10, 0, lib_1_10.length-1, null);
          expect(output).toEqual(9);
        });
        it("should find index 0 when the target is 0", function (){
          var output;
          output = TL.binarySearchLibrary(lib_1_10, 0, 0, lib_1_10.length-1, null);
          expect(output).toEqual(0);
        });
        it("should find any number 1-10", function (){ 
          var output, curr_target;
          for(curr_target = 1; curr_target <= 10; curr_target++){
            output = TL.binarySearchLibrary(lib_1_10, curr_target, 0, lib_1_10.length-1, null);
            expect(output).toEqual(curr_target-1);
          }
        });
      });
      describe("with a text library of 10 items sorted 0-9", function (){
        it("should find any number 0-9", function (){ 
          var output, curr_target;
          for(curr_target = 0; curr_target <= 9; curr_target++){
            output = TL.binarySearchLibrary(lib_0_9, curr_target, 0, lib_0_9.length-1, null);
            expect(output).toEqual(curr_target);
          }
        });
      });
    });
    
    describe(".findNearestSegments", function (){ 
      describe("with a sample library of more than 10 elements looking for segments closest to length 8 where 8 exists in the library", function (){
        var output;
        beforeEach( function (){
          output = TL.findNearestSegments(lib_sample, 8)
        });

        it("should return 10 items", function (){
          expect(output.length).toEqual(10);
        });
        it("should contain the target segment when it is inside the library", function (){
          expect(_.where(output, {length: 8})[0].length).toEqual(8);
        });
      });

      describe("with a library of 2", function (){
        it("should return all the elements", function (){
          var output = TL.findNearestSegments(lib_2, {length: 3})
          expect(output.length).toEqual(2);
          expect(output).toContain(lib_2[0]);
          expect(output).toContain(lib_2[1]);
        });
      });
    });
  });
});
