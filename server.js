const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config()

const imgRouter = require('./src/router/imgRouter')
const userRouter = require('./src/router/userRouter')

const app = express()
const PORT = process.env.PORT || 4001;

// midlewares

app.use(express.json())
app.use(fileUpload({useTempFiles: true}))
app.use(express.urlencoded({extended: true}))
app.use(cors());

app.use('/img', imgRouter)
app.use('/user', userRouter)


app.get('/', (req, res) => {
    res.send("ok")
})

const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
}).catch(err => console.log(err))