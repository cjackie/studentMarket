

describe("testing index.js", function() {
    var request = require("supertest");
    request = request("http://localhost:3000/");
    
    describe("home page", function() {
        
        it("request home page.", function(done) {
            request.get("/")
                .expect(200, function(err, res) {
                    if (err) return "has err: " + err;
                    done();
                });
        });
    });

    describe("signup page", function() {
            
        it("request signup page", function(done) {
            request.get("/signup")
                .expect(200, function(err, res) {
                    if (err) return "has err: " + err;
                    done();
                });
        });

        it("request to signup with json", function(done) {
            var username = "test" + 10000000000000*Math.random()
               ,json = {"username": username,
                   "email": "123@stonybrook.edu",
                   "password": "22",
                   "password2": "22"};
            console.log("this is sent: " + json);
            
            request.post("register")
                .set("Content-Type", "json")
                .send(json)
                .expect(200, function(err, res) {
                    if (err) return "no good!";
                    done();
                });
        });

        it("request to signup with form", function(done) {
            var username = "test" + 10000000000000*Math.random()
                ,formData = "username="+username+"&email=123@stonybrook.edu&password=11&password2=11";
            console.log("this is sent: " + formData);

            request.post("register")
                .type("form")
                .send(formData)
                .expect(200, function(err, res) {
                    if (err) return "no good!";
                    done();
                });
        });
        
    });

    describe("login page", function() {
            
        it("request login page", function(done) {
            request.get("/")
                .expect(200, function(err, res) {
                    if (err) return "has err: " + err;
                    done();
                });
        });
    });
    

});

            
           
           
