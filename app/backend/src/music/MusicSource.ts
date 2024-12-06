import { SongInfo, ListResult, UnsupportedActionError } from "./type";
// MusicSource.ts
export abstract class MusicSource {
  abstract NAME: string;

  extractId(fullId: string): string {
    return fullId.substring(this.NAME.length);
  }

  abstract getById(id: string): SongInfo | Promise<SongInfo>;
  abstract getUrl(id: string): string | Promise<string>;

  async getByIds<T extends readonly string[]>(
    ids: T
  ): Promise<ListResult<SongInfo, T>> {
    const success: { [K in T[number]]?: SongInfo } = {};
    const errors: Array<{ input: string; error: Error }> = [];

    await Promise.all(
      ids.map(async (id) => {
        try {
          success[id as T[number]] = await this.getById(id);
        } catch (error) {
          errors.push({
            input: id,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      })
    );

    return { success, errors };
  }

  async searchByName(name: string): Promise<SongInfo[]> {
    throw new UnsupportedActionError(
      `${this.NAME}: No support for searchByName.`
    );
  }

  async getSongList(listId: string): Promise<SongInfo[]> {
    throw new UnsupportedActionError(
      `${this.NAME}: No support for getSongList.`
    );
  }
}
