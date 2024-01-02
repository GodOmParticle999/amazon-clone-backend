import mongoose from "mongoose"

const dbConnect=async()=>{
    mongoose.connect(process.env.MONGO_URL).then((con)=>{
        console.log("database connected",con.connection.host)
        
    }).catch((error)=>{

        console.log("mongo_db connection failed",error)
        process.exit(1)
    })
}

export default dbConnect