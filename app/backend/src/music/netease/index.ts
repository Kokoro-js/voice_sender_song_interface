// NeteaseSourceService.ts
import * as netease from "NeteaseCloudMusicApi";
import { Service, Container } from "@/service";
import HonoService from "@/HonoService";
import { MusicSource } from "../MusicSource";
import { SongInfo } from "../type";
import DatabaseService from "@/PrismaService";
import { Netease } from "./netease";

export interface INeteaseLogin {
  cookie: string[];
  real_ip: string;
  email?: string;
  pwd?: string;
}

@Service()
export class NeteaseSourceService extends MusicSource {
  NAME = "NETEASE";
  private netease: Netease;

  constructor(
    private loginInfo: INeteaseLogin,
    private hono: HonoService,
    private database: DatabaseService
  ) {
    super();
    this.netease = new Netease(loginInfo.cookie[0], loginInfo.real_ip);
  }

  static async createInstance(
    container: Container,
    config: INeteaseLogin
  ): Promise<NeteaseSourceService> {
    const loginInfo: INeteaseLogin = config;

    if (!loginInfo?.cookie?.length) {
      if (loginInfo.email === undefined || loginInfo.pwd === undefined) {
        throw new Error("Insufficient login information provided");
      }
      const data = await netease.login({
        email: loginInfo.email,
        password: loginInfo.pwd,
      });
      if (data.status !== 200) {
        throw new Error(`Request returned status ${data.status}`);
      }
      loginInfo.cookie = data.cookie;
    }
    const hono = container.get(HonoService);
    const database = container.get(DatabaseService);
    return new NeteaseSourceService(loginInfo, hono, database);
  }

  async getById(fullId: string): Promise<SongInfo> {
    const songId = this.extractId(fullId);
    let data = await this.database.prisma.musicInfo.findUnique({
      where: { musicId_platform: { platform: this.NAME, musicId: songId } },
    });
    if (!data) {
      const info = await this.netease.getSong(songId);
      data = await this.database.createSongData({
        musicId: fullId,
        platform: this.NAME,
        title: info.name,
        artist: info.ar.map((i) => i.name).join(" / "),
        cover: info.al.picUrl,
        cachedUrl: null,
      });
    }
    return {
      musicId: data.musicId,
      title: data.title,
      artist: data.artist,
      cover: data.cover,
    };
  }

  async getUrl(fullId: string): Promise<string> {
    const songId = this.extractId(fullId);
    return await this.netease.getSongUrl(songId);
  }

  async searchByName(name: string): Promise<SongInfo[]> {
    const data = await this.netease.cloudsearch(name);
    return data.map((i) => ({
      musicId: `${this.NAME}${i.id}`,
      title: i.name,
      artist: i.ar.map((artist) => artist.name).join(" / "),
      cover: i.al.picUrl,
    }));
  }

  async getSongList(listId: string): Promise<SongInfo[]> {
    const neteaseListId = this.extractId(listId);
    const data = await this.netease.getPlaylist(neteaseListId);
    return data.map((i) => ({
      musicId: `${this.NAME}${i.id}`,
      title: i.name,
      artist: i.ar.map((artist) => artist.name).join(" / "),
      cover: i.al.picUrl,
    }));
  }
}
