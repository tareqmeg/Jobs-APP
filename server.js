'use strict';

require('dotenv').config();

// app dependanceies

const express = require('express');
const superagent = require('superagent');
const cors = require('cors');
const pg = require('pg');
const methodOverride = require('method-override');


const PORT = process.env.PORT || 3000;
const server = express();
server.use(cors());
server.set('view engine', 'ejs');

server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.use(express.static('./public'));

const client = new pg.Client( { connectionString: process.env.DATABASE_URL, ssl: process.env.LOCALLY ? false : {rejectUnauthorized: false}} );

server.get('/', (req,res)=>{
    let URL = 'https://jobs.github.com/positions.json?location=usa';
    superagent.get(URL).then((data)=>{
        let jobData = data.body;
        let jobArr = jobData.map((usajob)=>{
            return new Job(usajob);
        });
        
        res.render('index', {jobs:jobArr});
    });
    
    // res.render('index');

})
server.get('/search', (req,res)=>{
    res.render('searchPage');
})

server.get('/jobSearch', (req,res)=>{
    let description = req.query.description;
    let URL= `https://jobs.github.com/positions.json?description=${description}&location=usa`;
    superagent.get(URL).then((data)=>{
        console.log(data.body);
        let jobData = data.body;
        let jobArr = jobData.map((item)=>{
            return new JobDescrption (item);
        })
        // res.send(jobArr);
        res.render('result',{jobs:jobArr});
    })
    
})

server.post('/addtomylist',(req,res)=>{
    const {title,company,location,url,description} = req.body;
    let SQL=`INSERT INTO jobs (title,company,clocation,curl,cdescription) VALUES ($1,$2,$3,$4,$5) RETURNING *;`;
    let saveValues = [title,company,location,url,description];
    client.query(SQL,saveValues).then((result)=>{
        let data = result.rows;
        console.log(data);
        res.render('mylist',{insertedData:data[0]});
    })
})

//(title, company, location, and url)
function Job(data){
    // this.data= data;
    this.title=data.title;
    this.company=data.company;
    this.location=data.location;
    this.url = data.url;
}

function JobDescrption (data){
    this.title=data.title;
    this.company=data.company;
    this.location=data.location;
    this.url = data.url;
    this.description=data.description;
}

client.connect().then(()=>{
    server.listen(PORT,()=>{
        console.log(`listen to port ${PORT}`);

    });
});