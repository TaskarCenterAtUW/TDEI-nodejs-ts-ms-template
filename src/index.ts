/**
 * Reference for the application based controller.
 */

import Koa from "koa";
import Router from 'koa-router';
import json from "koa-json";
import bodyparser from "koa-body-parser";
import { tdeiLogger, TDEILogger } from "./core/logger/tdei_logger";
import { environment } from "./environment/environment";
import { requestLogger } from "./core/logger/request_logger";

const app = new Koa();
const router = new Router();

let start = Date.now();

router.get('/', async (ctx, next) => {

    ctx.body = { msg: "Hello there" };
    await next();
});

app.use(bodyparser());
app.use(json());
app.use(requestLogger());

app.use(router.routes()).use(router.allowedMethods());


// app.use()

const anotherRouter = new Router();
anotherRouter.get('/ping',async (ctx,next) => {
    ctx.body = {msg:'Ping successful',envvars:process.env};
    await next();

});

anotherRouter.post('/ping',async (ctx,next)=>{

    const requestBody = ctx.request.body;
    console.debug("Request body");
    console.log(requestBody);
    ctx.body = {msg:'Post Ping successful'};
    await next();

});

app.use(anotherRouter.routes()).use(anotherRouter.allowedMethods());

const port = process.env.PORT ?? 3000;

app.listen(port, () => {
    console.log('Koa started');
    let duration = Date.now() - start;
    tdeiLogger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    tdeiLogger.sendAll();
});
