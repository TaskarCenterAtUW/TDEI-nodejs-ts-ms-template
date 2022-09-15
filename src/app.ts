/**
 * Reference for the application based controller.
 */

import Koa from "koa";
import Router from 'koa-router';
import json from "koa-json";
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

app.use(json());
app.use(requestLogger());

app.use(router.routes()).use(router.allowedMethods());

// app.use()

app.listen(3000, () => {
    console.log('Koa started');
    let duration = Date.now() - start;
    tdeiLogger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    tdeiLogger.sendAll();
});
