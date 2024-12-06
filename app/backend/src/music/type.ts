import { PlayState } from "api/src/generated/Base";

declare enum PlatformName {
  NETEAST = "netease",
  QQ = "qq",
}

export class UnsupportedActionError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export type ListResult<T, Ids extends readonly string[]> = {
  success: { [K in Ids[number]]?: T }; // 动态绑定 success 的键到 Ids
  errors: Array<{ input: string; error: Error }>;
};

export interface SongInfo {
  musicId: string;
  title: string | null;
  artist: string | null;
  cover: string | null;
}

export interface IPlayerState extends SongInfo {
  currentMS: number;
  totalMS: number;
  volume: number;
  state: PlayState;
}
