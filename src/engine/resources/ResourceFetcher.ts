import { RessourceError } from "./ResourceError";


export { ResourceFetcher };

const ResourceFetcher = Object.freeze({

    async fetchArrayBuffer(url: string): Promise<ArrayBuffer> {
        return fetch(url).then((resp) => {
            if (resp.ok) {
                return resp.arrayBuffer();
            }
            else {
                throw new RessourceError(`Array buffer '${url}' not found.`);
            }
        });
    },

    async fetchTextFile(url: string): Promise<string> {
        return fetch(url).then((resp) => {
            if (resp.ok) {
                return resp.text();
            }
            else {
                throw new RessourceError(`Text file '${url}' not found.`);
            }
        });
    },

    async fetchJSON<T>(url: string): Promise<T> {
        return fetch(url).then((resp) => {
            if (resp.ok) {
                return resp.json();
            }
            else {
                throw new RessourceError(`JSON file '${url}' not found.`);
            }
        });
    },

    async fetchImage(url: string): Promise<HTMLImageElement> {
        return fetch(url).then((resp) => {
            if (resp.ok) {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.onload = () => {
                        resolve(img);
                    };
                    img.src = url;
                })
            }
            else {
                throw new RessourceError(`Image '${url}' not found.`);
            }
        });
    }
});