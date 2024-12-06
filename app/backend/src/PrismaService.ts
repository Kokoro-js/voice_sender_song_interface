import { Service } from "./service";
import { PrismaClient, MusicInfo } from "@prisma/client";

@Service()
export class DatabaseService {
  public readonly prisma = new PrismaClient();

  constructor() {
    this.prisma.$connect().then(async () => {
      const instances = await this.prisma.instance.findMany({
        where: {
          running: true,
        },
      });
    });
  }

  getSongData(ids: string[]) {
    return this.prisma.musicInfo.findMany({
      where: { musicId: { in: ids } },
    });
  }

  createSongData(song: Omit<MusicInfo, "updateAt">) {
    return this.prisma.musicInfo.create({
      data: {
        musicId: song.musicId,
        platform: song.platform,
        title: song.title,
        artist: song.artist,
        cover: song.cover,
      },
    });
  }
}

export default DatabaseService;
