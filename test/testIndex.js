

describe("testing index.js", function() {
    var request = require("supertest");
    request = request("http://localhost:3000/");
    
    describe("home page", function() {
        
        it("should request home page successfully.", function(done) {
            request.get("/")
                .expect(200, function(err, res) {
                    if (err) return "has err";
                    else console.log("the res is\n" + res);
                    done();
                });
        });
    });
});

            
           
           
