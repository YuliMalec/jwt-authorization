require('dotenv').config({})
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT=process.env.PORT|| 5000;
const mongoose = require('mongoose')
const app = express();
const router = require('./router/index')
const errorMiddleware = require('./middleware/error-middleware')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}))
app.use('/api',router)
app.use(errorMiddleware)

const start = async()=>{
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
app.listen(PORT,()=>console.log(`Server stared on ${PORT} port.`))
    }catch(e){
        console.log(e)
    }
}
start()