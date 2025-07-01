import mongoose from "mongoose";


type ConnectionObject =  {
    isConnected?: number
}

const connection : ConnectionObject = {}

async function dbConnect(){
    if(connection.isConnected){
        console.log("Already Connected To MongoDB Atlas")
        return;
    }
    try {
        const db = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        // console.log(db);
        connection.isConnected = db.connections[0].readyState
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1);
    }
    
}

export default dbConnect;
