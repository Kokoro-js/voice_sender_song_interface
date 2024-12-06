import "reflect-metadata";
import { ContainerBuilder } from "diod";
import LoggerService from "./LoggerService";
import HonoService from "./HonoService";
import DatabaseService from "./PrismaService";
import DataSource from "./DataSource";
import { serve } from "@hono/node-server";
import { MusicSourceService } from "@/music";
import { musicSourceConfigs } from "@/Config";

export const builder = new ContainerBuilder();

builder.registerAndUse(LoggerService).asSingleton();
builder.registerAndUse(DatabaseService).asSingleton();
builder
  .register(MusicSourceService)
  .useFactory((c) => {
    return new MusicSourceService(c, musicSourceConfigs);
  })
  .asSingleton();
builder
  .register(DataSource)
  .useFactory((c) => {
    return new DataSource(
      { address: "tcp://127.0.0.1:5557", subAddr: "tcp://127.0.0.1:5556" },
      c.get(MusicSourceService),
      c.get(LoggerService)
    );
  })
  .asSingleton();
builder
  .register(HonoService)
  .useFactory((c) => {
    return new HonoService(c.get(DataSource));
  })
  .asSingleton();

const container = builder.build();

serve(container.get(HonoService).getApp());

export default container;
