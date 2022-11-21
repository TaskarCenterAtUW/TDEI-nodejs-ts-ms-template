/**
 * Reference for the application based controller.
 */

import express, { Express, Request, Response } from 'express';


import {Core} from "nodets-ms-core";


require('dotenv').config();

const app =  express();

let start = Date.now();


app.get('/',(req:Request, res:Response)=>{
    res.send(JSON.stringify({msg:"Hello there"}));
});
app.get('/ping',(req:Request, res: Response)=>{
    res.format({json () {
        res.send({msg:'Ping Successfull'})
      }});
});

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

Core.initialize();

const requestLogger = (req:Request, res:Response, next) => {
    console.log('Request start');
    next();
    console.log('request end');
}

app.use(requestLogger);


const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log('Express started');
    let duration = Date.now() - start;
    let logger = Core.getLogger();
    logger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    logger.sendAll();
});
