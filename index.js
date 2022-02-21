const { request } = require('express')
const express = require('express')
const res = require('express/lib/response')
const mssql = require('mssql')
const { MSSQLError } = require('mssql/lib/base')
require('dotenv').config()
const app = express();
app.use(express.json());


app.listen(4000, () => {
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

mssql.connect(config).then(pool => {

  if (pool.connecting) {
    console.log('connecting to db');
  }

  if (pool.connected) {
    console.log('connected');
  }

}).catch(e => console.log(e))






app.get('/studentss', async (req, res) => {
  await mssql.connect(config)

  const result = await (new mssql.Request().execute('Sselectall'))
  res.json(result.recordset)
  console.log(result.recordset)



});







app.post('/studentss', async (req, res) => {
  const { names, email, password, project } = req.body;
  const id = req.params.id
  try {
    await mssql.connect(config)
    await mssql.connect(config);
    await (new mssql.Request()
      .input('names', mssql.VarChar(20), `${names}`)
      .input('email', mssql.VarChar(200), `${email}`)
      .input('project', mssql.VarChar(50), `${project}`)
      .input('password', mssql.VarChar(200), `${password}`)

      .execute('Setstudentss')
      .then((result) => {
          res.json("User added successfully");
      }).catch((e) => {
          console.log(e);
          res.send(e);
      })
  );
}
catch (e) {
  console.log(e);
}

})

app.put('/studentss/:id', async (req, res) => {
  const { names, email, password, project } = req.body;
  const id = req.params.id
  try {
    await mssql.connect(config)
    await mssql.connect(config);
    await (new mssql.Request()
      .input('names', mssql.VarChar(20), `${names}`)
      .input('email', mssql.VarChar(200), `${email}`)
      .input('project', mssql.VarChar(50), `${project}`)
      .input('password', mssql.VarChar(200), `${password}`)
      .input('id', mssql.VarChar(200), `${id}`)

      .execute('Updatestudentss')
      .then((result) => {
          res.json("User updated successfully");
      }).catch((e) => {
          console.log(e);
          res.send(e);
      })
  );
}
catch (e) {
  console.log(e);
}

})


app.get('/studentss/:id', async (req, res) => {
  await mssql.connect(config)
 const id= req.params.id
  const result = await (new mssql.Request()
  .input('id', mssql.VarChar(200), `${id}`)
  .execute('Sselectone'))
  res.json(result.recordset)
  console.log(result.recordset)
});


app.delete('/studentss/:id', async (req, res) => {
  await mssql.connect(config)
 const id= req.params.id
  const result = await (new mssql.Request()
  .input('id', mssql.VarChar(200), `${id}`)
  .execute('Ssdelete'))
  res.json('user deleted')
  console.log('user deleted')
});















