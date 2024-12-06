// UrlSourceService.ts
import { MusicSource } from "./MusicSource";
import { Service } from "@/service";
import { SongInfo } from "./type";

@Service()
export class UrlSourceService extends MusicSource {
  NAME = "URL";

  getById(id: string): SongInfo {
    const url = this.extractId(id);
    return {
      musicId: id,
      title: `链接：${url}`,
      artist: "自定义链接",
      cover: null,
    };
  }

  getUrl(id: string): string {
    return this.extractId(id);
  }
}
