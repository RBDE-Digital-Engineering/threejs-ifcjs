import { NonEmptyOrBlankString, Guid } from './shared-types';
/***********
generated template classes for ./xsd/markup.xsd 4.8.2022, 15:16:17
***********/





export class Markup {
    public markup?: Markup;
    public Header?: File[];
    public Topic?: Topic;

    public constructor(props?: Markup) {
        this["@class"] = ".Markup";


        if (props) {

        	this.markup = new Markup(props.markup);
        	this.Header = props.Header?.map(o => new File(o));
        	this.Topic = (props.Topic) ? new Topic(props.Topic): undefined;
        }
    }
}

export abstract class FileAttributes {
    public $IfcProject: IfcGuid;
    public $IfcSpatialStructureElement: IfcGuid;
    public $IsExternal: boolean;

    public constructor(props?: FileAttributes) {
        this["@class"] = ".FileAttributes";


        if (props) {

        	this.$IfcProject = props.$IfcProject;
        	this.$IfcSpatialStructureElement = props.$IfcSpatialStructureElement;
        	this.$IsExternal = props.$IsExternal;
        }
    }
}

export abstract class DocumentReferenceAttributes {
    public $Guid: Guid;

    public constructor(props?: DocumentReferenceAttributes) {
        this["@class"] = ".DocumentReferenceAttributes";


        if (props) {

        	this.$Guid = props.$Guid;
        }
    }
}

export class ViewPoint {
    public Viewpoint?: NonEmptyOrBlankString;
    public Snapshot?: NonEmptyOrBlankString;
    public Index?: number;
    public $Guid: Guid;

    public constructor(props?: ViewPoint) {
        this["@class"] = ".ViewPoint";


        if (props) {

        	this.Viewpoint = props.Viewpoint;
        	this.Snapshot = props.Snapshot;
        	this.Index = props.Index;
        	this.$Guid = props.$Guid;
        }
    }
}

export class BimSnippet {
    public Reference: NonEmptyOrBlankString;
    public ReferenceSchema: NonEmptyOrBlankString;
    public $SnippetType: NonEmptyOrBlankString;
    public $IsExternal: boolean;

    public constructor(props?: BimSnippet) {
        this["@class"] = ".BimSnippet";


        if (props) {

        	this.Reference = props.Reference;
        	this.ReferenceSchema = props.ReferenceSchema;
        	this.$SnippetType = props.$SnippetType;
        	this.$IsExternal = props.$IsExternal;
        }
    }
}

export class Topic {
    public ReferenceLinks?: NonEmptyOrBlankString[];
    public Title: NonEmptyOrBlankString;
    public Priority?: NonEmptyOrBlankString;
    public Index?: number;
    public Labels?: NonEmptyOrBlankString[];
    public CreationDate: Date;
    public CreationAuthor: NonEmptyOrBlankString;
    public ModifiedDate?: Date;
    public ModifiedAuthor?: NonEmptyOrBlankString;
    public DueDate?: Date;
    public AssignedTo?: NonEmptyOrBlankString;
    public Stage?: NonEmptyOrBlankString;
    public Description?: NonEmptyOrBlankString;
    public BimSnippet?: BimSnippet;
    public DocumentReferences?: DocumentReference[];
    public RelatedTopics?: RelatedTopics;
    public Comments?: Comment[];
    public Viewpoints?: ViewPoint[];
    public $Guid: Guid;
    public $ServerAssignedId: NonEmptyOrBlankString;
    public $TopicType: NonEmptyOrBlankString;
    public $TopicStatus: NonEmptyOrBlankString;

    public constructor(props?: Topic) {
        this["@class"] = ".Topic";


        if (props) {

        	this.ReferenceLinks = props.ReferenceLinks?.map(o => o);
        	this.Title = props.Title;
        	this.Priority = props.Priority;
        	this.Index = props.Index;
        	this.Labels = props.Labels?.map(o => o);
        	this.CreationDate = props.CreationDate;
        	this.CreationAuthor = props.CreationAuthor;
        	this.ModifiedDate = props.ModifiedDate;
        	this.ModifiedAuthor = props.ModifiedAuthor;
        	this.DueDate = props.DueDate;
        	this.AssignedTo = props.AssignedTo;
        	this.Stage = props.Stage;
        	this.Description = props.Description;
        	this.BimSnippet = (props.BimSnippet) ? new BimSnippet(props.BimSnippet): undefined;
        	this.DocumentReferences = props.DocumentReferences?.map(o => new DocumentReference(o));
        	this.RelatedTopics = (props.RelatedTopics) ? new RelatedTopics(props.RelatedTopics): undefined;
        	this.Comments = props.Comments?.map(o => new Comment(o));
        	this.Viewpoints = props.Viewpoints?.map(o => new ViewPoint(o));
        	this.$Guid = props.$Guid;
        	this.$ServerAssignedId = props.$ServerAssignedId;
        	this.$TopicType = props.$TopicType;
        	this.$TopicStatus = props.$TopicStatus;
        }
    }
}

export class RelatedTopics {
    public constructor(props?: RelatedTopics) {
        this["@class"] = ".RelatedTopics";
        props
    }
}

export class File {
    public Filename?: NonEmptyOrBlankString;
    public Date?: Date;
    public Reference?: NonEmptyOrBlankString;

    public constructor(props?: File) {
        this["@class"] = ".File";


        if (props) {

        	this.Filename = props.Filename;
        	this.Date = props.Date;
        	this.Reference = props.Reference;
        }
    }
}

export class DocumentReference {
    public Description?: NonEmptyOrBlankString;

    public DocumentGuid?: Guid
    public Url?: NonEmptyOrBlankString

    //choice

    public set setDocumentGuid(arg: Guid) {
        delete(this.Url);
        this.DocumentGuid = arg;
    }

    //choice

    public set setUrl(arg: NonEmptyOrBlankString) {
        delete(this.DocumentGuid);
        this.Url = arg;
    }

    public constructor(props?: DocumentReference) {
        this["@class"] = ".DocumentReference";


        if (props) {

        	this.Description = props.Description;
        }
    }
}

export class Comment {
    public Date: Date;
    public Author: NonEmptyOrBlankString;
    public Comment?: NonEmptyOrBlankString;
    public ModifiedDate?: Date;
    public ModifiedAuthor?: NonEmptyOrBlankString;
    public $Guid: Guid;

    public constructor(props?: Comment) {
        this["@class"] = ".Comment";


        if (props) {

        	this.Date = props.Date;
        	this.Author = props.Author;
        	this.Comment = props.Comment;
        	this.ModifiedDate = props.ModifiedDate;
        	this.ModifiedAuthor = props.ModifiedAuthor;
        	this.$Guid = props.$Guid;
        }
    }
}

export type IfcGuid = "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"|"A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|"N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"|"_"|"a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|"n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z";
