/***********
generated template classes for ./xsd/version.xsd 4.8.2022, 15:16:17
***********/

export class Version {
  public version?: Version;
  public VersionId: string;

  public constructor(props?: Version) {
    this["@class"] = ".Version";

    if (props) {
      this.version = props.version ? new Version(props.version) : undefined;
      this.VersionId = props.VersionId;
    }
  }
}
