import { Hono } from "hono";
import update from "./updateStream";

const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => {
  const instanceId = c.get("instanceId");
  return c.text("你好呀");
});

app.route("/update", update);

export default app;
