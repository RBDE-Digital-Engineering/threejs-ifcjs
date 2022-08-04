/***********
generated template classes for ./xsd/documents.xsd 4.8.2022, 15:16:15
***********/
import { Guid, NonEmptyOrBlankString } from "./shared-types";
export declare class Documents {
    documentInfo: Document[];
    constructor(props?: Documents);
}
export declare abstract class DocumentAttributes {
    $Guid: Guid;
    constructor(props?: DocumentAttributes);
}
export declare class Document {
    Filename: NonEmptyOrBlankString;
    Description?: NonEmptyOrBlankString;
    constructor(props?: Document);
}
