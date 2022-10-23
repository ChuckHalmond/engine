export { ResourceFetcher };
declare const ResourceFetcher: Readonly<{
    fetchArrayBuffer(url: string): Promise<ArrayBuffer>;
    fetchTextFile(url: string): Promise<string>;
    fetchJSON<T>(url: string): Promise<T>;
    fetchImage(url: string): Promise<HTMLImageElement>;
}>;
