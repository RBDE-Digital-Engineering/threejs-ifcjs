import { NonEmptyOrBlankString, Guid } from './shared-types';
/***********
generated template classes for ./xsd/markup.xsd 4.8.2022, 15:16:17
***********/
export declare class Markup {
    markup?: Markup;
    Header?: File[];
    Topic?: Topic;
    constructor(props?: Markup);
}
export declare abstract class FileAttributes {
    $IfcProject: IfcGuid;
    $IfcSpatialStructureElement: IfcGuid;
    $IsExternal: boolean;
    constructor(props?: FileAttributes);
}
export declare abstract class DocumentReferenceAttributes {
    $Guid: Guid;
    constructor(props?: DocumentReferenceAttributes);
}
export declare class ViewPoint {
    Viewpoint?: NonEmptyOrBlankString;
    Snapshot?: NonEmptyOrBlankString;
    Index?: number;
    $Guid: Guid;
    constructor(props?: ViewPoint);
}
export declare class BimSnippet {
    Reference: NonEmptyOrBlankString;
    ReferenceSchema: NonEmptyOrBlankString;
    $SnippetType: NonEmptyOrBlankString;
    $IsExternal: boolean;
    constructor(props?: BimSnippet);
}
export declare class Topic {
    ReferenceLinks?: NonEmptyOrBlankString[];
    Title: NonEmptyOrBlankString;
    Priority?: NonEmptyOrBlankString;
    Index?: number;
    Labels?: NonEmptyOrBlankString[];
    CreationDate: Date;
    CreationAuthor: NonEmptyOrBlankString;
    ModifiedDate?: Date;
    ModifiedAuthor?: NonEmptyOrBlankString;
    DueDate?: Date;
    AssignedTo?: NonEmptyOrBlankString;
    Stage?: NonEmptyOrBlankString;
    Description?: NonEmptyOrBlankString;
    BimSnippet?: BimSnippet;
    DocumentReferences?: DocumentReference[];
    RelatedTopics?: RelatedTopics;
    Comments?: Comment[];
    Viewpoints?: ViewPoint[];
    $Guid: Guid;
    $ServerAssignedId: NonEmptyOrBlankString;
    $TopicType: NonEmptyOrBlankString;
    $TopicStatus: NonEmptyOrBlankString;
    constructor(props?: Topic);
}
export declare class RelatedTopics {
    constructor(props?: RelatedTopics);
}
export declare class File {
    Filename?: NonEmptyOrBlankString;
    Date?: Date;
    Reference?: NonEmptyOrBlankString;
    constructor(props?: File);
}
export declare class DocumentReference {
    Description?: NonEmptyOrBlankString;
    DocumentGuid?: Guid;
    Url?: NonEmptyOrBlankString;
    set setDocumentGuid(arg: Guid);
    set setUrl(arg: NonEmptyOrBlankString);
    constructor(props?: DocumentReference);
}
export declare class Comment {
    Date: Date;
    Author: NonEmptyOrBlankString;
    Comment?: NonEmptyOrBlankString;
    ModifiedDate?: Date;
    ModifiedAuthor?: NonEmptyOrBlankString;
    $Guid: Guid;
    constructor(props?: Comment);
}
export declare type IfcGuid = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "_" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z";
