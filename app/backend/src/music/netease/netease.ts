import * as netease from "NeteaseCloudMusicApi";

export class Netease {
  constructor(public cookie: string, public REAL_IP: string) {}

  async search(keywords: string, page = 1, limit = 5): Promise<Netease.song[]> {
    const res = await netease.search({
      keywords,
      offset: (page - 1) * limit,
      limit,
      cookie: this.cookie,
      realIP: this.REAL_IP,
    });
    return (res.body.result as any).songs;
  }
  async cloudsearch(
    keywords: string,
    page = 1,
    limit = 5
  ): Promise<Netease.songDetail[]> {
    const res = await netease.cloudsearch({
      keywords,
      offset: (page - 1) * limit,
      limit,
      cookie: this.cookie,
      realIP: this.REAL_IP,
    });
    return (res.body.result as any).songs;
  }
  async getAlbum(id: string): Promise<{
    songs: Netease.song[];
    album: Netease.album;
    artist: Netease.artist;
  }> {
    const res = await netease.album({
      id,
      cookie: this.cookie,
      realIP: this.REAL_IP,
    });
    return {
      songs: (res.body as any).songs,
      album: (res.body as any).album,
      artist: (res.body as any).artist,
    };
  }
  async getSong(id: string): Promise<Netease.songDetail> {
    return (
      (
        await netease.song_detail({
          ids: id.toString(),
          cookie: this.cookie,
          realIP: this.REAL_IP,
        })
      ).body.songs as any
    )[0];
  }
  async getSongMultiple(ids: string): Promise<Netease.songDetail[]> {
    return (
      await netease.song_detail({
        ids,
        cookie: this.cookie,
        realIP: this.REAL_IP,
      })
    ).body.songs as any;
  }
  async getSongUrl(id: string): Promise<string> {
    return (
      (
        await netease.song_url({
          id,
          cookie: this.cookie,
          realIP: this.REAL_IP,
        })
      ).body.data as any
    )[0].url;
  }
  async getLyric(id: string): Promise<Netease.lyric> {
    return (
      await netease.lyric({
        id,
        cookie: this.cookie,
        realIP: this.REAL_IP,
      })
    ).body as any;
  }
  async getPlaylist(id: string): Promise<Netease.playlist> {
    return ((await netease.playlist_track_all({ id })).body as any).songs;
  }
}

export namespace Netease {
  export interface artist {
    name: string;
    id: string;
    picid: string;
    img1v1id: string;
    briefDisc: string;
    picUrl: string;
    img1v1Url: string;
    albumSize: number;
    alias: string[];
    trans: string;
    musicSize: number;
  }
  export interface albumArtist {
    id: string;
    name: string;
    picUrl: string | null;
    alias: string[];
    albumSize: number;
    picid: string;
    fansGroup: null;
    img1v1Url: string;
    img1v1: number;
    trans: null;
  }
  export interface album {
    id: string;
    name: string;
    artist: albumArtist;
    publishTime: number;
    blurPicUrl?: string;
    size: number;
    copyrightid: string;
    status: number;
    picid: string;
    mark: number;
  }
  export interface song {
    id: string;
    name: string;
    artists: artist[];
    album: album;
    duration: number;
    copyrightid: string;
    status: number;
    alias: string[];
    rtype: number;
    ftype: number;
    mvid: string;
    fee: number;
    rUrl: null;
    mark: number;
  }
  export interface songDetail {
    /**
     * Song name
     */
    name: string;
    /**
     * Song ID
     */
    id: string;
    ar: {
      /**
       * Artist ID
       */
      id: string;
      /**
       * Artist name
       */
      name: string;
      tns: any[];
      alias: any[];
    }[];
    al: {
      /**
       * Album ID
       */
      id: string;
      /**
       * Album name
       */
      name: string;
      /**
       * Album cover
       */
      picUrl: string;
      tns: any[];
      pic_str: string;
      pic: number;
    };
    /**
     * Song duration
     */
    dt: number;
    // [key: string]: any
  }
  export interface lyric {
    sgc: boolean;
    sfy: boolean;
    qfy: boolean;
    lyricUser: {
      id: string;
      status: number;
      demand: number;
      userid: string;
      nickname: string;
      uptime: number;
    };
    lrc?: lyricContent;
    klyric?: lyricContent;
    tlyric?: lyricContent;
    romalrc?: lyricContent;
  }
  export type playlist = songDetail[];
  export interface lyricContent {
    version: number;
    lyric: string;
  }
}
