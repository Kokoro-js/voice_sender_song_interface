import { UrlSourceService } from "@/music/UrlSourceService";
import { NeteaseSourceService } from "@/music/netease";
import { MusicSourceConfig } from "@/music";

export const musicSourceConfigs: MusicSourceConfig[] = [
  {
    class: UrlSourceService, // Implements IMusicSourceConstructor
    config: {}, // No special config needed for UrlSourceService
  },
];
