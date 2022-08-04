/***********
generated template classes for ./xsd/documents.xsd 4.8.2022, 15:16:15
***********/

import { Guid, NonEmptyOrBlankString } from "./shared-types";

export class Documents {
    public documentInfo: Document[];

    public constructor(props?: Documents) {
        this["@class"] = ".Documents";


        if (props) {

        	this.documentInfo = props.documentInfo?.map(o => new Document(o));
        }
    }
}

export abstract class DocumentAttributes {
    public $Guid: Guid;

    public constructor(props?: DocumentAttributes) {
        this["@class"] = ".DocumentAttributes";


        if (props) {

        	this.$Guid = props.$Guid;
        }
    }
}

export class Document {
    public Filename: NonEmptyOrBlankString;
    public Description?: NonEmptyOrBlankString;

    public constructor(props?: Document) {
        this["@class"] = ".Document";


        if (props) {

        	this.Filename = props.Filename;
        	this.Description = props.Description;
        }
    }
}
