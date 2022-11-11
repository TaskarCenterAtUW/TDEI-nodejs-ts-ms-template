"use strict";
/**
 * Reference for the application based controller.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_json_1 = __importDefault(require("koa-json"));
const koa_body_parser_1 = __importDefault(require("koa-body-parser"));
const nodets_ms_core_1 = require("nodets-ms-core");
require('dotenv').config();
const app = new koa_1.default();
const router = new koa_router_1.default();
let start = Date.now();
router.get('/', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: "Hello there" };
    yield next();
}));
app.use((0, koa_body_parser_1.default)());
app.use((0, koa_json_1.default)());
// app.use(requestLogger());
app.use(router.routes()).use(router.allowedMethods());
nodets_ms_core_1.Core.initialize();
const requestLogger = () => (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const start = Date.now();
    try {
        console.debug('Request start', { method: ctx.method, url: ctx.url });
        yield next();
    }
    finally {
        const ms = Date.now() - start;
        console.debug('Request End', { method: ctx.method, url: ctx.url, duration: ms });
        const logger = nodets_ms_core_1.Core.getLogger();
        logger.recordRequest(ctx.request, ctx.response);
    }
});
app.use(requestLogger());
// app.use()
const anotherRouter = new koa_router_1.default();
anotherRouter.get('/ping', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = { msg: 'Ping successful' };
    yield next();
}));
anotherRouter.post('/ping', (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const requestBody = ctx.request.body;
    console.debug("Request body");
    console.log(requestBody);
    ctx.body = { msg: 'Post Ping successful' };
    yield next();
}));
app.use(anotherRouter.routes()).use(anotherRouter.allowedMethods());
const port = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(port, () => {
    console.log('Koa started');
    let duration = Date.now() - start;
    let logger = nodets_ms_core_1.Core.getLogger();
    // logger.recordMetric("server startup time "+process.env.npm_package_name,duration);
    // logger.sendAll();
});
