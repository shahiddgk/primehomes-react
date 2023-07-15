const { MongoClient } = require('mongodb');


//const uri = "mongodb+srv://" + process.env.MONGODB_USERNAME + ":" + process.env.MONGODB_PASSWORD + "@" + process.env.MONGODB_CLUSTER_URL + "/" + process.env.MONGODB_DATABASE + "?retryWrites=true&w=majority";
const uri = `mongodb://0.0.0.0:27017`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export { client }
