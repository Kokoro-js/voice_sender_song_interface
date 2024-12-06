import { Hono } from "hono";
import { seekSecond, skipCurrent } from "api";
import { type } from "arktype";
import { arktypeValidator } from "@hono/arktype-validator";
import { switchState } from "api/src/updateStream";

const app = new Hono<{ Variables: Variables }>();

const skipRoute = app.post(
  "/skip",
  arktypeValidator("json", type({ "next?": "string" })),
  async (c) => {
    const data = c.req.valid("json");
    const generated = await skipCurrent(c.get("instanceId"), data.next);
    const dealer = c.get("dealer");
    await dealer.send(generated);
    return c.json({ success: true });
  }
);

const seekRoute = app.post(
  "/seek",
  arktypeValidator("json", type({ second: "number" })),
  async (c) => {
    const data = c.req.valid("json");
    const generated = await seekSecond(c.get("instanceId"), data.second);
    const dealer = c.get("dealer");
    await dealer.send(generated);
    return c.json({ success: true });
  }
);

const switchRoute = app.post(
  "/switch",
  arktypeValidator("json", type({ state: "number" })),
  async (c) => {
    const data = c.req.valid("json");
    const generated = await switchState(c.get("instanceId"), data.state);
    const dealer = c.get("dealer");
    await dealer.send(generated);
    return c.json({ success: true });
  }
);

export default app;
export type { skipRoute, seekRoute, switchRoute };
