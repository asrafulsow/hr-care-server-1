const express = require('express')
const app = express();
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.o0i8x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const usersCollection = client.db("hr-care").collection("user");
        const employeeRequestCollection = client.db("hr-care").collection("employeeRequest");

        //User Post API
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user)
            res.send(result)
            console.log(user)
        })

        //Employee Request Get API
        app.get('/employeeRequest', async (req, res) => {
            const getemployeeRequest = employeeRequestCollection.find({});
            const result = await getemployeeRequest.toArray();
            res.send(result)
            console.log(getemployeeRequest)
        })

        //Employee Request Post API
        app.post('/employeeRequest', async (req, res) => {
            const employeeRequest = req.body;
            const result = await employeeRequestCollection.insertOne(employeeRequest)
            res.send(result)
            console.log(employeeRequest)
        })













    }
    finally {
        // await  client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})