/***********
generated template classes for ./xsd/visinfo.xsd 4.8.2022, 15:16:19
***********/

import { NonEmptyOrBlankString } from "./shared-types";

export class Visinfo {
  public visualizationInfo: VisualizationInfo | undefined;

  public constructor(props?: Visinfo) {
    this["@class"] = ".Visinfo";

    if (props) {
      this.visualizationInfo = props.visualizationInfo
        ? new VisualizationInfo(props.visualizationInfo)
        : undefined;
    }
  }
}

export class VisualizationInfo {
  public Components?: Components;
  public Lines?: Line[];
  public ClippingPlanes?: ClippingPlane[];
  public Bitmaps?: Bitmap[];

  //choice

  public OrthogonalCamera(arg: OrthogonalCamera) {
    delete (this as any).PerspectiveCamera;
    (this as any).OrthogonalCamera = arg;
  }

  //choice

  public PerspectiveCamera(arg: PerspectiveCamera) {
    delete (this as any).OrthogonalCamera;
    (this as any).PerspectiveCamera = arg;
  }

  public constructor(props?: VisualizationInfo) {
    this["@class"] = ".VisualizationInfo";

    if (props) {
      this.Components = props.Components
        ? new Components(props.Components)
        : undefined;
      this.Lines = props.Lines?.map((o) => new Line(o));
      this.ClippingPlanes = props.ClippingPlanes?.map(
        (o) => new ClippingPlane(o)
      );
      this.Bitmaps = props.Bitmaps?.map((o) => new Bitmap(o));
    }
  }
}

export class OrthogonalCamera {
  public CameraViewPoint: Point | undefined;
  public CameraDirection: Direction | undefined;
  public CameraUpVector: Direction | undefined;
  public ViewToWorldScale: number;
  public AspectRatio: PositiveDouble;

  public constructor(props?: OrthogonalCamera) {
    this["@class"] = ".OrthogonalCamera";

    if (props) {
      this.CameraViewPoint = props.CameraViewPoint
        ? new Point(props.CameraViewPoint)
        : undefined;
      this.CameraDirection = props.CameraDirection
        ? new Direction(props.CameraDirection)
        : undefined;
      this.CameraUpVector = props.CameraUpVector
        ? new Direction(props.CameraUpVector)
        : undefined;
      this.ViewToWorldScale = props.ViewToWorldScale;
      this.AspectRatio = props.AspectRatio;
    }
  }
}

export class PerspectiveCamera {
  public CameraViewPoint: Point | undefined;
  public CameraDirection: Direction | undefined;
  public CameraUpVector: Direction | undefined;
  public FieldOfView: FieldOfView;
  public AspectRatio: PositiveDouble;

  public constructor(props?: PerspectiveCamera) {
    this["@class"] = ".PerspectiveCamera";

    if (props) {
      this.CameraViewPoint = props.CameraViewPoint
        ? new Point(props.CameraViewPoint)
        : undefined;
      this.CameraDirection = props.CameraDirection
        ? new Direction(props.CameraDirection)
        : undefined;
      this.CameraUpVector = props.CameraUpVector
        ? new Direction(props.CameraUpVector)
        : undefined;
      this.FieldOfView = props.FieldOfView;
      this.AspectRatio = props.AspectRatio;
    }
  }
}

export class Point {
  public X: number;
  public Y: number;
  public Z: number;

  public constructor(props?: Point) {
    this["@class"] = ".Point";

    if (props) {
      this.X = props.X;
      this.Y = props.Y;
      this.Z = props.Z;
    }
  }
}

export class Direction {
  public X: number;
  public Y: number;
  public Z: number;

  public constructor(props?: Direction) {
    this["@class"] = ".Direction";

    if (props) {
      this.X = props.X;
      this.Y = props.Y;
      this.Z = props.Z;
    }
  }
}

export class FieldOfView extends Number {
  private fov: number;
  public set value(v: number) {
    if (v <= 0 || v >= 180) throw Error("FieldOfView is out of bounds");
    this.fov = v;
  }

  public get value(): number {
    return this.fov;
  }
}

export class PositiveDouble extends Number {
  private pd: number;
  public set value(v: number) {
    if (v <= 0) throw Error("FieldOfView is out of bounds");
    this.pd = v;
  }

  public get value(): number {
    return this.pd;
  }
}

export class Components {
  public Selection?: Component[];
  public Visibility?: ComponentVisibility;
  public Coloring?: Color;

  public constructor(props?: Components) {
    this["@class"] = ".Components";

    if (props) {
      this.Selection = props.Selection?.map((o) => new Component(o));
      this.Visibility = props.Visibility
        ? new ComponentVisibility(props.Visibility)
        : undefined;
      this.Coloring = props.Coloring ? new Color(props.Coloring) : undefined;
    }
  }
}

export class ComponentVisibility {
  public ViewSetupHints?: ViewSetupHints;
  public $DefaultVisibility: boolean;

  public constructor(props?: ComponentVisibility) {
    this["@class"] = ".ComponentVisibility";

    if (props) {
      this.ViewSetupHints = props.ViewSetupHints
        ? new ViewSetupHints(props.ViewSetupHints)
        : undefined;
      this.$DefaultVisibility = props.$DefaultVisibility;
    }
  }
}

export class ViewSetupHints {
  public $SpacesVisible: boolean;
  public $SpaceBoundariesVisible: boolean;
  public $OpeningsVisible: boolean;

  public constructor(props?: ViewSetupHints) {
    this["@class"] = ".ViewSetupHints";

    if (props) {
      this.$SpacesVisible = props.$SpacesVisible;
      this.$SpaceBoundariesVisible = props.$SpaceBoundariesVisible;
      this.$OpeningsVisible = props.$OpeningsVisible;
    }
  }
}

export class Color {
  public Components: Component[];

  public constructor(props?: Color) {
    this["@class"] = ".Color[]";

    if (props) {
      this.Components = props.Components?.map((o) => new Component(o));
    }
  }
}

export class Component {
  public OriginatingSystem?: NonEmptyOrBlankString;
  public AuthoringToolId?: NonEmptyOrBlankString;
  public $undefined: any;

  public constructor(props?: Component) {
    this["@class"] = ".Component";

    if (props) {
      this.OriginatingSystem = props.OriginatingSystem;
      this.AuthoringToolId = props.AuthoringToolId;
      this.$undefined = props.$undefined;
    }
  }
}

export class Line {
  public StartPoint: Point | undefined;
  public EndPoint: Point | undefined;

  public constructor(props?: Line) {
    this["@class"] = ".Line";

    if (props) {
      this.StartPoint = props.StartPoint
        ? new Point(props.StartPoint)
        : undefined;
      this.EndPoint = props.EndPoint ? new Point(props.EndPoint) : undefined;
    }
  }
}

export class ClippingPlane {
  public Location: Point | undefined;
  public Direction: Direction | undefined;

  public constructor(props?: ClippingPlane) {
    this["@class"] = ".ClippingPlane";

    if (props) {
      this.Location = props.Location ? new Point(props.Location) : undefined;
      this.Direction = props.Direction
        ? new Direction(props.Direction)
        : undefined;
    }
  }
}

export class Bitmap {
  public Format: BitmapFormat;
  public Reference: NonEmptyOrBlankString;
  public Location: Point | undefined;
  public Normal: Direction | undefined;
  public Up: Direction | undefined;
  public Height: number;

  public constructor(props?: Bitmap) {
    this["@class"] = ".Bitmap";

    if (props) {
      this.Format = props.Format;
      this.Reference = props.Reference;
      this.Location = props.Location ? new Point(props.Location) : undefined;
      this.Normal = props.Normal ? new Direction(props.Normal) : undefined;
      this.Up = props.Up ? new Direction(props.Up) : undefined;
      this.Height = props.Height;
    }
  }
}

enum BitmapFormat {
  png = "png",
  jpg = "jpg",
}
