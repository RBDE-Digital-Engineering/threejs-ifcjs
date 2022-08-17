export default class BCF {
    private version;
    private filelist;
    private makeChildren;
    private js2xml;
    initBcf(): void;
    createMarkup(topicTitle: string, author: string, description?: string, topicType?: string, topicStatus?: string, ifcProjectGuid?: string, ifcObjectGuid?: string, ifcpath?: string, ifcfilename?: string, fileIsoTimeString?: string): void;
    loadBcf(): Promise<string>;
    downloadBcf(): Promise<void>;
    writeSnapshot(): void;
    writeTopic(): void;
    getTopics(): void;
}
