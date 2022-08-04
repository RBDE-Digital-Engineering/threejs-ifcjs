/***********
generated template classes for ./xsd/project.xsd 4.8.2022, 15:16:17
***********/
import { NonEmptyOrBlankString } from "./shared-types";
export declare class Project {
    projectInfo: ProjectInfo | undefined;
    Name?: NonEmptyOrBlankString;
    $ProjectId: NonEmptyOrBlankString;
    constructor(props?: Project);
}
export declare class ProjectInfo {
    Project: Project | undefined;
    constructor(props?: ProjectInfo);
}
