// MusicSourceService.ts
import { Container, Service } from "@/service";
import { MusicSource } from "./MusicSource";
import {
  IAsyncMusicSourceConstructor,
  IMusicSourceConstructor,
} from "./IMusicSourceConstructor";
import LoggerService from "@/LoggerService";

export interface MusicSourceConfig {
  class: IMusicSourceConstructor | IAsyncMusicSourceConstructor;
  config?: any; // Configuration needed for initialization
}

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  name?: string;
}

class PrefixTrie {
  private root = new TrieNode();

  insert(name: string) {
    let node = this.root;
    for (const char of name) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
    }
    node.name = name;
  }

  search(fullId: string): string | null {
    let node = this.root;
    let result: string | null = null;
    for (const char of fullId) {
      if (!node.children.has(char)) {
        break;
      }
      node = node.children.get(char)!;
      if (node.name) {
        result = node.name;
      }
    }
    return result;
  }
}

@Service()
export class MusicSourceService {
  private sources: Map<string, MusicSource> = new Map();
  private trie: PrefixTrie = new PrefixTrie();
  private logger;

  constructor(
    private container: Container,
    private configs: MusicSourceConfig[]
  ) {
    this.logger = container
      .get(LoggerService)
      .createExtendedLogger({ name: "MusicSourceService" });
  }

  async initializeSources() {
    for (const config of this.configs) {
      const { class: SourceClass, config: sourceConfig } = config;
      let instance: MusicSource;

      if (!this.isAsyncMusicSourceConstructor(SourceClass)) {
        instance = new SourceClass();
      } else {
        try {
          instance = await SourceClass.createInstance(
            this.container,
            sourceConfig
          );
        } catch (e) {
          this.logger.error(
            e,
            `实例化 ${
              (SourceClass as unknown as MusicSource)?.NAME || "非标准实现服务"
            } 时遇到错误。`
          );
          continue;
        }
      }

      this.sources.set(instance.NAME, instance);
      this.trie.insert(instance.NAME);
    }
  }

  /**
   * Retrieves a MusicSource by its NAME.
   * @param fullId The ID with specify prefix.
   * @returns The corresponding MusicSource instance.
   */
  getSourceByFullId(fullId: string): MusicSource | undefined {
    const name = this.trie.search(fullId);
    if (!name) {
      return undefined;
    }
    return this.getSource(name);
  }

  /**
   * Type guard to check if a class implements IAsyncMusicSourceConstructor.
   */
  private isAsyncMusicSourceConstructor(
    cls: IMusicSourceConstructor | IAsyncMusicSourceConstructor
  ): cls is IAsyncMusicSourceConstructor {
    return (
      typeof (cls as IAsyncMusicSourceConstructor).createInstance === "function"
    );
  }

  /**
   * Retrieves a MusicSource by its NAME.
   * @param name The NAME of the MusicSource.
   * @returns The corresponding MusicSource instance.
   */
  getSource(name: string): MusicSource | undefined {
    return this.sources.get(name);
  }

  /**
   * Extracts the NAME from the fullId based on the registered sources.
   * @param fullId The full ID containing the source NAME.
   * @returns The extracted NAME.
   * @throws Error if no matching NAME is found.
   */
  private extractName(fullId: string): string {
    for (const name of this.sources.keys()) {
      if (fullId.startsWith(name)) {
        return name;
      }
    }
    throw new Error(`Invalid fullId format or unsupported source: ${fullId}`);
  }
}
