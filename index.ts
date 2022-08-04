import {
    Matrix4,
    PerspectiveCamera,
    Scene,
    BoxGeometry,
    Mesh,
    InstancedMesh,
    MeshLambertMaterial,
    WebGLRenderer,
    Raycaster,
    Box3,
    RingBufferGeometry
} from 'three'; 
import { IFCWALLSTANDARDCASE, IFCWALL, IFCSLAB, IFCWINDOW, IFCDOOR, IFCPLATE, IFCMEMBER } from 'web-ifc';
import { IFCLoader } from 'web-ifc-three/IFCLoader';
import { acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh';

import * as THREE from 'three';

import { PointerLockControls } from './modules/PointerLockControls.js';
import { Model } from 'web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges.js'
import BCF from './modules/BCF.js';

type xyz = {
    x: number;
    y: number;
    z: number;
}

let camera: PerspectiveCamera, scene: Scene, renderer:WebGLRenderer, controls: PointerLockControls, model: Model, reticleGeometry:RingBufferGeometry;

const objects: Mesh[] = [];

let raycaster: Raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;
let mouseDown = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 0.17;

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 750);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    if (!blocker)
        throw new Error("HTML Element missing: blocker")
    if (!instructions)
        throw new Error("HTML Element missing: instructions")

    instructions.addEventListener('click', function () {

        controls.lock();

    });

    controls.addEventListener('lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    });

    scene.add(controls.getObject());

    const onKeyDown = function (event:KeyboardEvent) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                if (canJump === true) velocity.y += 100;
                canJump = false;
                break;

        }

    };

    const onKeyUp = function (event:KeyboardEvent) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

        }

    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    document.addEventListener('mousedown', function () {
        mouseDown = true;
    });

    document.addEventListener('mouseup', function () {
        mouseDown = false;
    });

    raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, - 1, 0), 0, 10);
    

    for (let i = 0; i < 500; i++) {

        const boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
        boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

        const box = new THREE.Mesh(
            new THREE.RingBufferGeometry(100 * i, 110 * i, 32),
            new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide })
        );
        box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

        scene.add(box);
        objects.push(box);

    }

    reticleGeometry = new THREE.RingBufferGeometry(0.005, 0.01, 3)
    var reticle = new THREE.Mesh(
        reticleGeometry,
        new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide, depthTest: false, depthWrite: false })
    );
    // asserts drawing on top
    reticle.renderOrder = 999;
    reticle.onBeforeRender = function (renderer) { renderer.clearDepth(); };

    reticle.position.z = -1.1;
    reticle.lookAt(camera.position)
    camera.add(reticle)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //

    window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    const time = performance.now();
    if (reticleGeometry) {
        reticleGeometry.parameters.thetaStart = Math.floor(time*10)
    }

    if (controls.isLocked === true) {

        raycaster.setFromCamera({ x: 0, y: 0 }, camera)

        const intersections = raycaster.intersectObjects(objects, false);

        const found = intersections[1];

        const selectionMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        if (found) {
            const index = found.faceIndex;
            const geometry = (found.object as Mesh).geometry;
            const ifc = ifcLoader.ifcManager;
            let id = -1
            if (index) id = ifc.getExpressId(geometry, index)

            if (mouseDown) {
                console.log("clicked")
                ifcLoader.ifcManager.createSubset({ scene: scene, modelID: model.modelID, ids: [id], material: selectionMaterial, removePrevious: true})
                const input = document.createElement("input");  
                input.type = "text"
                input.className = "css-class-name"
                input.addEventListener('keypress', function (e) {
                    if (e.key === 'Enter') {
                        var element = document.createElement('a');
                        element.setAttribute('href','data:text/plain;charset=utf-8, ' + encodeURIComponent(input.value));
                        element.setAttribute('download', "comment.txt");
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element)
                        document.body.removeChild(input)
                    }
                });
                document.body.appendChild(input);
                controls.unlock()
                input.focus()

                let bcf = new BCF()
                bcf.initBcf()
                bcf.downloadBcf()
            }

            // oldColorObject[found.object] = found.object.material.color
            // found.material.color.set('orange')
            console.log(id);
        }

        const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        velocity.y -= 9.8 * 70.0 * delta; // 10.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // this ensures consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

        if (onObject === true) {
            // console.log("looking at object")
            // console.log(intersections)
            velocity.y = Math.max(0, velocity.y);
            canJump = true;

        }

        controls.moveRight(- velocity.x * delta);
        controls.moveForward(- velocity.z * delta);

        controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 1) {

            velocity.y = 0;
            controls.getObject().position.y = 1;

            canJump = true;

        }

    }

    prevTime = time;

    renderer.render(scene, camera);

}

const ifcLoader = new IFCLoader();

async function loadIFC() {
    await ifcLoader.ifcManager.setWasmPath('../../../');
    await ifcLoader.ifcManager.applyWebIfcConfig({
        USE_FAST_BOOLS: true,
        COORDINATE_TO_ORIGIN: true,
    });

    // Sets up optimized picking
    await ifcLoader.ifcManager.setupThreeMeshBVH(
        computeBoundsTree,
        disposeBoundsTree,
        acceleratedRaycast);

    model = await ifcLoader.loadAsync('IFC/01.ifc');
    scene.add(model);
    objects.push(model)

    console.log(model);

    const walls = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCWALL, false);
    const wallsStandard = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCWALLSTANDARDCASE, false);
    const slabs = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCSLAB, false);
    const doors = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCDOOR, false);
    const windows = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCWINDOW, false);
    const members = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCMEMBER, false);
    const plates = await ifcLoader.ifcManager.getAllItemsOfType(0, IFCPLATE, false);

    const subset = await ifcLoader.ifcManager.createSubset({
        ids: [...walls, ...wallsStandard, ...slabs, ...doors, ...windows, ...members, ...plates],
        scene,
        removePrevious: true,
        modelID: 0,
        applyBVH: true
    })

    // Voxelize
    const resolution = 0.5;
    const { min, max } = subset.geometry.boundingBox || {min:{x:0, y:0, z:0}, max:{x:0, y:0,z:0}};

    const voxelCollider = new Box3();
    voxelCollider.min.set(-resolution / 2, -resolution / 2, -resolution / 2);
    voxelCollider.max.set(resolution / 2, resolution / 2, resolution / 2);

    const voxelizationSize: xyz = {
        x: Math.ceil((max.x - min.x) / resolution),
        y: Math.ceil((max.y - min.y) / resolution),
        z: Math.ceil((max.z - min.z) / resolution)
    }

    // 0 is not visited, 1 is empty, 2 is filled
    const voxels: Uint8Array[][] = newVoxels(voxelizationSize);


    const voxelGeometry = new BoxGeometry(resolution, resolution, resolution);
    const green = new MeshLambertMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 });
    const voxelMesh = new Mesh(voxelGeometry, green);
    scene.add(voxelMesh);

    const transformMatrix = new Matrix4();

    const origin = [min.x + resolution / 2, min.y + resolution / 2, min.z + resolution / 2];

    const filledVoxelsMatrices: Matrix4[] = [];
    const emptyVoxelsMatrices: Matrix4[] = [];

    // Compute voxels
    for (let i = 0; i < voxelizationSize.x; i++) {
        for (let j = 0; j < voxelizationSize.y; j++) {
            for (let k = 0; k < voxelizationSize.z; k++) {

                voxelMesh.position.set(origin[0] + i * resolution,
                    origin[1] + j * resolution,
                    origin[2] + k * resolution);

                voxelMesh.updateMatrixWorld();
                transformMatrix.copy(subset.matrixWorld).invert().multiply(voxelMesh.matrixWorld);
                const hit = subset.geometry.boundsTree?.intersectsBox(voxelCollider, transformMatrix);


                voxels[i][j][k] = hit ? 2 : 1;

                const array = hit ? filledVoxelsMatrices : emptyVoxelsMatrices;
                array.push(voxelMesh.matrixWorld.clone());
            }
        }
    }

    // Representation
    const filledVoxels = new InstancedMesh(voxelGeometry, green, filledVoxelsMatrices.length);

    let counter = 0;
    for (let matrix of filledVoxelsMatrices) {
        filledVoxels.setMatrixAt(counter++, matrix);
    }

    scene.add(filledVoxels);


    function newVoxels(voxelizationSize:xyz) {
        const newVoxels = [];
        for (let i = 0; i < voxelizationSize.x; i++) {
            const newArray: Uint8Array[] = [];
            newVoxels.push(newArray);
            for (let j = 0; j < voxelizationSize.y; j++) {
                newArray.push(new Uint8Array(voxelizationSize.z));
            }
        }
        return newVoxels;
    }

}


// function getContextTrueNorthRotation(context, rotation = {value: 0}) {
//
//     if (context.TrueNorth.DirectionRatios) {
//         const ratios = context.TrueNorth.DirectionRatios.map(item => item.value);
//         rotation.value += (Math.atan2(ratios[1], ratios[0]) - Math.PI / 2);
//     }
//
//     if (context.ParentContext) {
//         getContextTrueNorthRotation(context.ParentContext, rotation);
//     }
//
//     return rotation.value;
// }

loadIFC();