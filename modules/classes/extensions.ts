/***********
generated template classes for ./xsd/extensions.xsd 4.8.2022, 15:16:15
***********/


import { NonEmptyOrBlankString } from "./shared-types";



export class Extensions {
    public extensions?: Extensions;
    public TopicTypes?: NonEmptyOrBlankString[];
    public TopicStatuses?: NonEmptyOrBlankString[];
    public Priorities?: NonEmptyOrBlankString[];
    public TopicLabels?: NonEmptyOrBlankString[];
    public Users?: NonEmptyOrBlankString[];
    public SnippetTypes?: NonEmptyOrBlankString[];
    public Stages?: NonEmptyOrBlankString[];

    public constructor(props?: Extensions) {
        this["@class"] = ".Extensions";


        if (props) {

        	this.extensions = (props.extensions) ? new Extensions(props.extensions): undefined;
        	this.TopicTypes = props.TopicTypes?.map(o => o);
        	this.TopicStatuses = props.TopicStatuses?.map(o => o);
        	this.Priorities = props.Priorities?.map(o => o);
        	this.TopicLabels = props.TopicLabels?.map(o => o);
        	this.Users = props.Users?.map(o => o);
        	this.SnippetTypes = props.SnippetTypes?.map(o => o);
        	this.Stages = props.Stages?.map(o => o);
        }
    }
}
