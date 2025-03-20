/**
 * Reference for the application based controller.
 */

import express, { Express, Request, Response } from 'express';
import {Core} from "nodets-ms-core";


// Load the environment variables
require('dotenv').config();

// Create the express app
const app =  express();

// Define the routes

// Base route
app.get('/',(req:Request, res:Response)=>{
    res.send(JSON.stringify({msg:"Hello there"}));
});

// Ping route
app.get('/ping',(req:Request, res: Response)=>{
    res.format({json () {
        res.send({msg:'Ping Successfull'})
      }});
});

// Route to test the download of file from the storage
app.get('/downloadTest', async (req:Request, res:Response) =>{
    
    const storageClient = Core.getStorageClient();
    const storageContainer = await storageClient?.getContainer('gtfspathways');
    const filesList = await storageContainer?.listFiles();
    console.log(filesList);
    const firstFile = filesList![0];
    // Give this one for download
    console.log(firstFile.fileName);
    res.attachment(firstFile.fileName);
    const stream = await firstFile.getStream();
    stream.pipe(res);
    
});

// Initialize the Core
Core.initialize();


// Start the express server
const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log('Express started');
});
