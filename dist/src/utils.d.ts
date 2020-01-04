/// <reference types="node" />
export declare function generatePDF(html: string): Promise<Buffer>;
export declare function imgToBase64(img: string): Promise<string>;
export declare function mergePDFs(pdfs: Buffer[]): Promise<Buffer>;
