export default class BCF {
    private version;
    private filelist;
    private makeChildren;
    private js2xml;
    initBcf(): void;
    loadBcf(): Promise<string>;
    downloadBcf(): Promise<void>;
    writeSnapshot(): void;
    writeTopic(): void;
    getTopics(): void;
}
