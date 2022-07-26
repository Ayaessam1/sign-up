const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname))

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
});
app.post("/",function(req,res){
    const FN = req.body.firstname;
    const LN = req.body.lastname;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: FN,
                    LNAME: LN
                }
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    const url = "https://us8.api.mailchimp.com/3.0/lists/08c68af34e";

    const options = {
        method: "post",
        auth: "Aya:48ad95f5631e2b15d518e115de2cff5a-us8"
    }

    const request = https.request(url , options , function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

     request.write(jsonData);
     request.end();

})

app.post("/failure", function(req,res){
    res.redirect("/");
});



//URL
//https://us8.api.mailchimp.com/3.0/
//API key
//48ad95f5631e2b15d518e115de2cff5a-us8
//list ID
//08c68af34e


app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000")
})