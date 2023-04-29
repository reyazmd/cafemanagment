const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer')
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static("./public"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors())

/**DB Connection */
const db = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  db.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    console.log('Connected to the MySQL server.');
})

let storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/logos/')     
  },
  filename: (req, file, callBack) => {
      callBack(null, Date.now() + "-" + file.originalname)
  }
})

let upload = multer({
  storage: storage
});

 /**Get all cafes list*/
 app.get("/cafeslist", (req, res) => {
  const q = "SELECT c.cafeId,c.name,c.description, c.logo, c.location, COUNT(e.id) as total_employees FROM cafedata as c LEFT JOIN employeedata as e ON c.cafeId = e.cafeId GROUP BY e.cafeId ORDER BY count(e.id) DESC";
  db.query(q, (err, data) => {
   // console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

/**Get all cafes list by id*/
app.get("/cafe/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * from cafedata WHERE cafeId=?";
  db.query(q, [id],(err, data) => {
   // console.log(err, data);
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

/**Get all employees list by id*/
app.get("/getemployees/:id", (req, res) => {
  const id = req.params.id;
  const q = "SELECT * from employeedata WHERE id=?";
  db.query(q, [id],(err, data) => {
    if (err) return res.json({ error: err.sqlMessage });
    else return res.json({ data });
  });
});

  /**Search cafes list based on location */
  app.get("/searchcafes/:location", (req, res) => {
    const location = req.params.location;
    const q = `SELECT c.cafeId,c.name,c.description, c.logo, c.location, COUNT(e.id) as total_employees FROM cafedata as c LEFT JOIN employeedata as e ON c.cafeId = e.cafeId  where location like '%${location}%' GROUP BY e.cafeId ORDER BY count(e.id) DESC`;
    db.query(q, (err, data) => {
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

   /**Get all employees */
   app.get("/employeeslist", (req, res) => {
    const cafename = req.params.cafename;
    const q = "SELECT e.id, e.name, e.email_address, e.phone_number, cafedata.name as cafeId, e.days_worked FROM employeedata as e LEFT JOIN cafedata ON cafedata.cafeId=e.cafeId";
    db.query(q, [cafename], (err, data) => {
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

   /**Search employees based on cafe location */
   app.get("/searchemployees/:name", (req, res) => {
    const empname = req.params.name;
    const q = `SELECT e.id, e.name, e.email_address, e.phone_number, cafedata.name as cafeId, e.days_worked FROM employeedata as e LEFT JOIN cafedata ON cafedata.cafeId=e.cafeId where e.name like '%${empname}%'`;
    db.query(q, (err, data) => {
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

  /**Add employee data */
  app.post("/newemployee", (req, res) => {
    const q = `insert into employeedata(name, email_address, phone_number, gender, cafeId, days_worked)
      values(?)`;
    const values = [...Object.values(req.body)];
    db.query(q, [values], (err, data) => {
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

   /**Add cafe data */
   app.post("/newcafe", upload.single('image'), (req, res) => {
    const q = `insert into cafedata(name, description, logo, location )
      values(?, ?, ?, ?)`;
      let imgsrc = ''
      if(req.file)  imgsrc = 'http://127.0.0.1:3001/logos/' + req.file.filename;
     const {name, description, location } = req.body;
    db.query(q, [name, description, imgsrc, location], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

   /**Update cafe data */
   app.post("/updatecafe/:Id", upload.single('image'), (req, res) => {
    const id = req.params.Id;
    const q = `update cafedata set name=?, description=?, logo=?, location=? where cafeId=${id}`;
      let imgsrc = ''
      if(req.file)  imgsrc = 'http://127.0.0.1:3001/logos/' + req.file.filename;
     const {name, description, location } = req.body;
    db.query(q, [name, description, imgsrc, location], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else return res.json({ data });
    });
  });

  /** update employee data */

  app.put("/updateemployee/:Id", (req, res) => {
    const id = req.params.Id;
    const data = req.body;
    const q =
      "update employeedata set " +
      Object.keys(data)
        .map((k) => `${k} = ?`)
        .join(",") +
      " where id='" +
      id +
      "'";
    db.query(q, [...Object.values(data)], (err, out) => {
      if (err) return res.json({ error: err.message });
      else {
        return res.json({ data: out });
      }
    });
  });



/**Delete employee data */
app.delete("/deleteemployee/:Id", (req, res) => {
    const id = req.params.Id;
    console.log("deleting " + id, req.body);
    const q = `DELETE FROM employeedata WHERE id= ?`;
    db.query(q, [id], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
});  

/**Delete cafe data */
app.delete("/deletecafe/:Id", (req, res) => {
    const id = req.params.Id;
    console.log("deleting " + id, req.body);
    const q = `DELETE FROM cafedata WHERE cafeId= ?`;
    db.query(q, [id], (err, data) => {
      console.log(err, data);
      if (err) return res.json({ error: err.sqlMessage });
      else res.json({data})
    })
}); 


app.listen(5000, () => console.log(`Server listening at port 5000`))