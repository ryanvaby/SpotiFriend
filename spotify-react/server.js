const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors"); // LOOK INTO CORS

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    database: "test",
});

// // A simple SELECT query
// db.query(
//     'SELECT * FROM `artists`',
//     function (err, results, fields) {
//         console.log(results); // results contains rows returned by server
//         console.log(fields); // fields contains extra meta data about results, if available
//     }
// );

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// INSERT ARTISTS
app.post("/insertartists", (req, res) => {
    const name = req.body.name;
    const artists = req.body.artists;

    db.query(
        "INSERT INTO artists (name, artists) VALUES (?,?)",
        [name, artists],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send("You have registered " + name + " successfully with " + artists);
            }
        }
    );
});

// SAME FOR INSERT TRACKS
app.post("/inserttracks", (req, res) => {
    const name = req.body.name;
    const tracks = req.body.tracks;

    db.query(
        "INSERT INTO tracks (name, tracks) VALUES (?,?)",
        [name, tracks],
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send("You have registered " + name + " successfully with " + tracks);
            }
        }
    );
});

// GET ARTISTS
app.get("/artists", (req, res) => {
    db.query("SELECT * FROM artists", 
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

// GET TRACKS

app.get("/tracks", (req, res) => {
    db.query("SELECT * FROM tracks", 
        function (err, result) {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        }
    );
});

app.listen(3001, () => {
    console.log("Yey, your server is running on port 3001");
});