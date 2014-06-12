

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
            request.get("signup")
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
                .send(json)
                .expect(200, function(err, res) {
                    if (err) throw err;
                    done();
                });
        });

        it("request to signup with form", function(done) {
            var username = "test" + 100000000000000000*Math.random()
                ,formData = "username="+username+"&email=123@stonybrook.edu&password=11&password2=11";
            console.log("this is sent from form: " + formData);

            request.post("register")
                .send(formData)
                .timeout(3000)
                .expect(200, function(err, res) {
                    if (err) throw err;
                    done();
                });
        });
        
    });

    describe("login page", function() {

        beforeEach(function() {
            this.username = "test";
            this.password = "123456";
        });
        
        it("request login page", function(done) {
            request.get("login")
                .expect(200, function(err, res) {
                    if (err) return "has err: " + err;
                    done();
                });
        });
        
        it("try to login", function(done) {
            var data = "username="+this.username+"&password="+this.password;
            request.post("login2")
                .send(data)
                .timeout(3000)
                .expect(200, function(err, res) {
                    if (err) throw err;
                    if (res.body.success == "no" || res.body.success != "yes") return "login failed";
                    done();
                });
            
        });
    });

    describe("confirm page", function() {

        beforeEach(function() {
            this.conformationCode = 7328793865162879;
            this.username = "chaoddd";
            console.log("chaoddd will be activated with 7328793865162879");
        });

        it("request activation", function(done) {
            request.get("confirmation")
                .query({username: this.username, activateSequence: this.conformationCode})
                .timeout(3000)
                .expect(200, function(err, res){
                    if (err) throw err;
                    done();
                });
        });
        
    });

    /*
     TODO
     profile, cart, market, logout, error, about, infoDisplay tests
     */
     
    

});

            
           
           
