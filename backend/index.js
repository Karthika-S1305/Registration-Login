const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/AuthRoutes');
const app = express();
const db = 'mongodb://localhost:27017/myapp';
app.use(cors());
const PORT = 5000;

mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log('Connected to mongoDB'))
.catch(err=>console.log('Error connecting mongoDB:',err));

app.use('/', authRoutes);

app.listen(PORT, ()=>{  
    console.log(`Server is running on ${PORT}`);
});