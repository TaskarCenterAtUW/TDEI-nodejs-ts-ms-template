/**
 * Reference for the application based controller.
 */

import Koa, { Middleware, ParameterizedContext } from "koa";
import Router from 'koa-router';
import json from "koa-json";
import bodyparser from "koa-body-parser";
import { environment } from "./environment/environment";
import {Core} from "nodets-ms-core";
import {Config} from "nodets-ms-core/lib/models";
// import Config from "applicationinsights/out/Library/Config";

const app = new Koa();
const router = new Router();

let start = Date.now();

router.get('/', async (ctx, next) => {

    ctx.body = { msg: "Hello there" };
    await next();
});

app.use(bodyparser());
app.use(json());
// app.use(requestLogger());

app.use(router.routes()).use(router.allowedMethods());
Core.initialize(Config.from({
    provider:'Azure',
    cloudConfig:{
        connectionString:{
            appInsights:environment.connections.appInsights,
            serviceBus:environment.connections.serviceBus,
            blobStorage:environment.connections.blobStorage
        },
        
    }
}));
const requestLogger = (): Middleware => async (
    ctx: ParameterizedContext,
    next: () => Promise<any>
)=>{
    const start = Date.now();
    try {
        console.debug('Request start', {method: ctx.method, url: ctx.url});
        await next();
    } finally {
        const ms = Date.now() - start;
        console.debug('Request End', {method:ctx.method, url:ctx.url,duration:ms});
        const logger = Core.getLogger();
        logger.recordRequest(ctx.request, ctx.response);
    }
}
app.use(requestLogger());

// app.use()

const anotherRouter = new Router();
anotherRouter.get('/ping',async (ctx,next) => {
    ctx.body = {msg:'Ping successful'};
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
    let logger = Core.getLogger();
    logger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    logger.sendAll();
});
