 import express from 'express'
 import App from './services/ExpressApp'
 import dbConnection from './services/Database'


 const StartServer = async() =>{
    const app = express();

    await dbConnection();

    await App(app);

    app.listen('3000',()=>{
        console.clear();
        console.log("Listening to port : 3000");
    });
 }

 StartServer();