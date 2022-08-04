/***********
generated template classes for ./xsd/project.xsd 4.8.2022, 15:16:17
***********/



import {  NonEmptyOrBlankString } from "./shared-types";


export class Project {
    public projectInfo: ProjectInfo|undefined;
    public Name?: NonEmptyOrBlankString;
    public $ProjectId: NonEmptyOrBlankString;

    public constructor(props?: Project) {
        this["@class"] = ".Project";


        if (props) {

        	this.projectInfo = (props.projectInfo) ? new ProjectInfo(props.projectInfo): undefined;
        	this.Name = props.Name;
        	this.$ProjectId = props.$ProjectId;
        }
    }
}

export class ProjectInfo {
    public Project: Project|undefined;

    public constructor(props?: ProjectInfo) {
        this["@class"] = ".ProjectInfo";


        if (props) {

        	this.Project = (props.Project) ? new Project(props.Project): undefined;
        }
    }
}
