/***********
generated template classes for ./xsd/visinfo.xsd 4.8.2022, 15:16:19
***********/
import { NonEmptyOrBlankString } from "./shared-types";
export declare class Visinfo {
    visualizationInfo: VisualizationInfo | undefined;
    constructor(props?: Visinfo);
}
export declare class VisualizationInfo {
    Components?: Components;
    Lines?: Line[];
    ClippingPlanes?: ClippingPlane[];
    Bitmaps?: Bitmap[];
    OrthogonalCamera(arg: OrthogonalCamera): void;
    PerspectiveCamera(arg: PerspectiveCamera): void;
    constructor(props?: VisualizationInfo);
}
export declare class OrthogonalCamera {
    CameraViewPoint: Point | undefined;
    CameraDirection: Direction | undefined;
    CameraUpVector: Direction | undefined;
    ViewToWorldScale: number;
    AspectRatio: PositiveDouble;
    constructor(props?: OrthogonalCamera);
}
export declare class PerspectiveCamera {
    CameraViewPoint: Point | undefined;
    CameraDirection: Direction | undefined;
    CameraUpVector: Direction | undefined;
    FieldOfView: FieldOfView;
    AspectRatio: PositiveDouble;
    constructor(props?: PerspectiveCamera);
}
export declare class Point {
    X: number;
    Y: number;
    Z: number;
    constructor(props?: Point);
}
export declare class Direction {
    X: number;
    Y: number;
    Z: number;
    constructor(props?: Direction);
}
export declare class FieldOfView extends Number {
    private fov;
    set value(v: number);
    get value(): number;
}
export declare class PositiveDouble extends Number {
    private pd;
    set value(v: number);
    get value(): number;
}
export declare class Components {
    Selection?: Component[];
    Visibility?: ComponentVisibility;
    Coloring?: Color;
    constructor(props?: Components);
}
export declare class ComponentVisibility {
    ViewSetupHints?: ViewSetupHints;
    $DefaultVisibility: boolean;
    constructor(props?: ComponentVisibility);
}
export declare class ViewSetupHints {
    $SpacesVisible: boolean;
    $SpaceBoundariesVisible: boolean;
    $OpeningsVisible: boolean;
    constructor(props?: ViewSetupHints);
}
export declare class Color {
    Components: Component[];
    constructor(props?: Color);
}
export declare class Component {
    OriginatingSystem?: NonEmptyOrBlankString;
    AuthoringToolId?: NonEmptyOrBlankString;
    $undefined: any;
    constructor(props?: Component);
}
export declare class Line {
    StartPoint: Point | undefined;
    EndPoint: Point | undefined;
    constructor(props?: Line);
}
export declare class ClippingPlane {
    Location: Point | undefined;
    Direction: Direction | undefined;
    constructor(props?: ClippingPlane);
}
export declare class Bitmap {
    Format: BitmapFormat;
    Reference: NonEmptyOrBlankString;
    Location: Point | undefined;
    Normal: Direction | undefined;
    Up: Direction | undefined;
    Height: number;
    constructor(props?: Bitmap);
}
declare enum BitmapFormat {
    png = "png",
    jpg = "jpg"
}
export {};
