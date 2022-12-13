import "module-alias/register";
import config from "config";
import App from "./app";
import UserController from "./controllers/user.controller";
import SessionController from "./controllers/session.controller";
import ProductController from "./controllers/product.controller";

const { port } = config.get<{ port: number }>("server");
const app = new App(
    [new UserController(), new SessionController(), new ProductController()],
    port
);
app.listen();
