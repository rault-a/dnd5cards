/// <reference types="node" />
export declare type NPCData = {
    name: string;
    role: string;
    image: string;
};
export declare function listToPdf(body: NPCData[]): Promise<Buffer>;
