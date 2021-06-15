import { ResourceFetcher } from 'engine/resources/ResourceFetcher';
import { Logger } from 'engine/core/logger/Logger';

export { Resources };

type ResourcesList = {list: string[]};

function extractExtension(filename: string): string {
  return filename.substring(filename.lastIndexOf('.') + 1);
}

const imageExtensions = ['png', 'jpg'];
const textExtensions = ['txt', 'md', 'vert', 'frag', 'glsl', 'json', 'html', 'css'];

interface Resources {
  readonly folder: string;
  get<T>(path: string): T | null;
  toString(): string;
  load(path: string): Promise<void>;
  loadList(path: string): Promise<void>;
}

interface ResourcesConstructor {
  readonly prototype: Resources;
  new(folder?: string): Resources;
}

class ResourcesBase implements Resources {

  public readonly folder: string;
  private readonly resources: Map<string, any>;

  constructor(folder?: string) {
    this.folder = folder || '';
    this.resources = new Map<string, any>();
  }

  public get<T>(file: string): T | null {
    const resource = this.resources.get(file);

    if (typeof resource === 'undefined') {
      Logger.error(`Unknown resource '${file}'.`);
      return null;
    }

    return resource as T;
  }

  public toString(): string {
    return `[\n\t\'${Array.from(this.resources.keys()).join("\',\n\t\'")}\'\n]`;
  }

  public async load(path: string): Promise<void> {
    let url = this.folder.concat(path);
    const fetchResource = async function(path: string, url: string, map: Map<string, any>) {
      const fileExt = extractExtension(path);
      let file;
      try {
        if (imageExtensions.includes(fileExt)) {
          file = await ResourceFetcher.fetchImage(url);
        }
        else if (textExtensions.includes(fileExt)) {
          file = await ResourceFetcher.fetchTextFile(url);
        }
      }
      catch (e) {
        Logger.error(`Resource item '${url}' not found.`);
        return;
      }
      map.set(path, file);
    }
    await fetchResource(path, url, this.resources);
  }

  public async loadList(path: string): Promise<void> {
    let url = this.folder.concat(path);
    let resources;
    try {
      resources = await ResourceFetcher.fetchJSON<ResourcesList>(url);
    }
    catch (e) {
      Logger.error(`Resources list '${url}' not found.`);
      return;
    }

    const fetchResource = async function(resource: string, folder: string, map: Map<string, any>) {
      const fileExt = extractExtension(resource);
      let file;
      try {
        if (imageExtensions.includes(fileExt)) {
          file = await ResourceFetcher.fetchImage(folder.concat(resource));
        }
        else if (textExtensions.includes(fileExt)) {
          file = await ResourceFetcher.fetchTextFile(folder.concat(resource));
        }
      }
      catch (e) {
        Logger.error(`Resource item '${url}' not found.`);
        return;
      }
      map.set(resource, file);
    }

    for (const resource of resources.list) {
      await fetchResource(resource, this.folder, this.resources);
    }
  }
}

const Resources: ResourcesConstructor = ResourcesBase;