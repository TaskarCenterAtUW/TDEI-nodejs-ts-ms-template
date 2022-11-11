/**
 * Reference for the application based controller.
 */

import express, { Express, Request, Response } from 'express';


import {Core} from "nodets-ms-core";
require('dotenv').config();

const app =  express();

let start = Date.now();

// router.get('/', async (ctx, next) => {

//     ctx.body = { msg: "Hello there" };
//     await next();
// });

app.get('/',(req:Request, res:Response)=>{
    res.send(JSON.stringify({msg:"Hello there"}));
});
app.get('/ping',(req:Request, res: Response)=>{
    res.send(JSON.stringify({msg:'Ping Successfull'}));
});
// app.use(bodyparser());
// app.use(json());
// app.use(requestLogger());

// app.use(router.routes()).use(router.allowedMethods());
Core.initialize();

const requestLogger = (req:Request, res:Response, next) => {
    console.log('Request start');
    next();
}

// const requestLogger = (): Middleware => async (
//     ctx: ParameterizedContext,
//     next: () => Promise<any>
// )=>{
//     const start = Date.now();
//     try {
//         console.debug('Request start', {method: ctx.method, url: ctx.url});
//         await next();
//     } finally {
//         const ms = Date.now() - start;
//         console.debug('Request End', {method:ctx.method, url:ctx.url,duration:ms});
//         const logger = Core.getLogger();
//         logger.recordRequest(ctx.request, ctx.response);
//     }
// }
// app.use(requestLogger());
// app.use((req,res,next)=>{

// })

app.use(requestLogger);

// const anotherRouter = new Router();
// anotherRouter.get('/ping',async (ctx,next) => {
//     ctx.body = {msg:'Ping successful'};
//     await next();

// });

// anotherRouter.post('/ping',async (ctx,next)=>{

//     const requestBody = ctx.request.body;
//     console.debug("Request body");
//     console.log(requestBody);
//     ctx.body = {msg:'Post Ping successful'};
//     await next();

// });

// app.use(anotherRouter.routes()).use(anotherRouter.allowedMethods());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log('Express started');
    let duration = Date.now() - start;
    let logger = Core.getLogger();
    // logger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    // logger.sendAll();
});
