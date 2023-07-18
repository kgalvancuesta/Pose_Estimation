const express = require('express')
const fs = require('fs')
const csv=require('csvtojson');
const exec = require('child_process').exec;
// const XMLHttpRequest = require('xhr2');
const request = require('request');



const homeRouter = express.Router()

homeRouter.get('/', (req,res)=>{
    res.render('home')
})

function process_image_and_gen_csv(res){
    request('http://127.0.0.1:5000', function (error, response, body) {
        console.error('error:', error); // Print the error
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the data received
        send_csv_as_response(res)        // res.send(body); //Display the response on the website
      }); }

function send_csv_as_response(res){
    console.log('exec py successfully');
    try{
        if (fs.existsSync('./output.csv')) {
            console.log("found csv");
            csv()
            .fromFile('./output.csv')
            .then((jsonObj)=>{
                jsonObj = JSON.stringify(jsonObj)
                res.send(jsonObj)
            })    
        }
    }catch (err){
        console.log("didn't find csv");
        console.error(err);
    }
}

homeRouter.post('/process', async(req,res)=>{
    let dstring = ''
    let rbody = JSON.parse(JSON.stringify(req.body))
    for(let i=0;i<rbody.length;i++){
        dstring +=rbody[i].base64 +'@'+rbody[i].name +'@'+rbody[i].hg+'\n'
    }

    fs.writeFile('./file.txt', dstring, function (error) {
        if (error) {
          console.log('error')
        } else {
            console.log("trying to call process image...")
            process_image_and_gen_csv(res);
            // exec('python pose_new.py '+ './file.txt ./',function(error,stdout,stderr){
            //     if(error) {
            //         console.info('stderr : '+stderr);
            //     }
                // console.log('exec py successfully');
                // csv()
                //     .fromFile('./output.csv')
                //     .then((jsonObj)=>{
                //         jsonObj = JSON.stringify(jsonObj)
                //         res.send(jsonObj)
                //     })

            //})
        }
      })


})


module.exports = homeRouter
