// IMusicSourceConstructor.ts
import { MusicSource } from "./MusicSource";
import { Container } from "@/service";

// Interface for classes without createInstance
export interface IMusicSourceConstructor {
  new (...args: any[]): MusicSource;
}

// Interface for classes with a static createInstance method
export interface IAsyncMusicSourceConstructor {
  createInstance(container: Container, config?: any): Promise<MusicSource>;
}
