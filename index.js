const { request } = require('express')
const express = require ('express')
const res = require('express/lib/response')
const mssql = require ('mssql')
const { MSSQLError } = require('mssql/lib/base')
require('dotenv').config() 
const app = express();
app.use(express.json());


app.listen(5000, ()=>{
    console.log("running...");
})

//connecting to db
let config = {
    server: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
    ,
    options: {

        encrypt: false,


    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
  }

  mssql.connect(config).then(pool =>{

    if(pool.connecting){
        console.log('connecting to db');
    }

    if(pool.connected){
        console.log('connected');
    }

  }).catch(e=>console.log(e))



  app.get('/students', async( req,res)=>{
      await mssql.connect(config)

      const result = await (await mssql.query("SELECT * FROM students")).recordset
         res.json(result)
         console.log(result)

  })
  

  app.get('/students/:id', async( req,res)=>{
      const{id}=req.params.id;
      try {
    await mssql.connect(config)

    const result = await (await mssql.query(`SELECT * FROM students WHERE id=${id}`)).recordset
       res.json(result)
       console.log(result)
           
      } catch (err) {
          console.log(err);     
    }

}) 


app.post('/students', async( req,res)=>{
    const {names, email,passwod,project} =req.body
  try {
    await mssql.connect(config)
    await (await mssql.query(`INSERT INTO students(names, email, passwod, project) VALUES('${names}','${email}','${passwod}','${project}')`))

    res.json("Data Inserted Successfully")
  } catch (error) {
      console.log(error.message);
  }

}) 





app.put('/students/:id', async( req,res)=>{
    const{names,email,passwod,project}=req.body;
    const id = req.params.id
    try {
  await mssql.connect(config)

  await (await mssql.query(`UPDATE students SET names='${names}',email='${email}',passwod='${passwod}',project='${project}' WHERE id=${id} `))

  res.json("Data Updated Successfully")
} catch (error) {
    console.log(error.message);
}


}) 


app.delete('/students/:id', async( req,res)=>{
    //const {names, email} =req.body
    const id = req.params.id
  try {
    await mssql.connect(config)
    await (await mssql.query(`DELETE FROM students WHERE id=${id} `))

    res.json("Record Deleted Successfully")
  } catch (error) {
      console.log(error.message);
  }

}) 


 

   


