import { Camera, EventDispatcher } from 'three';
declare class PointerLockControls extends EventDispatcher {
    domElement: HTMLElement;
    isLocked: boolean;
    minPolarAngle: number;
    pointerSpeed: number;
    maxPolarAngle: number;
    connect: () => void;
    disconnect: () => void;
    dispose: () => void;
    getObject: () => Camera;
    getDirection: (v: any) => any;
    moveForward: (distance: any) => void;
    moveRight: (distance: any) => void;
    lock: () => void;
    unlock: () => void;
    constructor(camera: Camera, domElement: HTMLElement);
}
export { PointerLockControls };
