const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.o0i8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// const client = new MongoClient(uri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

mongoose
    .connect(uri, {
        useNewUrlParser: true, useUnifiedTopology: true,
        dbName: 'hr-care'
    })
    .then(() => console.log("connection successful"))
    .catch((err) => console.log(err));

// async function run() {
//     try {
//         await client.connect();
//         const usersCollection = client.db("hr-care").collection("user");
//         const employeeRequestCollection = client.db("hr-care").collection("employeeRequest");

//         //User Post API
//         app.post("/users", async (req, res) => {
//             const user = req.body;
//             const result = await usersCollection.insertOne(user);
//             res.send(result);
//             console.log(user);
//         });
//         //  make admin
//         app.put("/makeAdmin", async (req, res) => {
//             const filter = { email: req.body.email };
//             const result = await usersCollection.find(filter).toArray();
//             if (result) {
//                 const documents = await usersCollection.updateOne(filter, {
//                     $set: { role: "admin" },
//                 });
//                 console.log(documents);
//             }
//         });

//         // check admin or not
//         app.get("/checkAdmin/:email", async (req, res) => {
//             const result = await usersCollection
//                 .find({ email: req.params.email })
//                 .toArray();
//             console.log(result);
//             res.send(result);
//         });

//         //Employee Request Get API
//         app.get("/employeeRequest", async (req, res) => {
//             const getemployeeRequest = employeeRequestCollection.find({});
//             const result = await getemployeeRequest.toArray();
//             res.send(result);
//             console.log(getemployeeRequest);
//         });

//         //Employee Request Post API
//         app.post("/employeeRequest", async (req, res) => {
//             const employeeRequest = req.body;
//             const result = await employeeRequestCollection.insertOne(employeeRequest);
//             res.send(result);
//             console.log(employeeRequest);
//         });
//     } finally {
//         // await  client.close();
//     }
// }

// run().catch(console.dir);

// application routes
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).json({ error: err });
}

app.use(errorHandler);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
