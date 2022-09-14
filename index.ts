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
  RingBufferGeometry,
  MaxEquation,
} from "three";
import {
  IFCWALLSTANDARDCASE,
  IFCWALL,
  IFCSLAB,
  IFCWINDOW,
  IFCDOOR,
  IFCPLATE,
  IFCMEMBER,
  IFCOWNERHISTORY
} from "web-ifc";
import { IFCLoader } from "web-ifc-three/IFCLoader";
import {
  acceleratedRaycast,
  computeBoundsTree,
  disposeBoundsTree,
} from "three-mesh-bvh";

import * as THREE from "three";

import { PointerLockControls } from "./modules/PointerLockControls.js";
import { Model } from "web-ifc-viewer/dist/components/display/clipping-planes/clipping-edges.js";
import BCF from "./modules/BCF.js";
import FormDialog from "./modules/BCF";
import { IfcProperties } from "web-ifc-viewer/dist/components/ifc/ifc-properties.js";
import {
  IFCRELDEFINESBYPROPERTIES,
  Vector,
  IFCPROPERTYSET,
  IFCPROPERTY,
  IfcLabel,
  IfcRelDefinesByProperties,
  IfcOwnerHistory,
  IfcPropertySet,
  IfcProperty,
  IfcGloballyUniqueId,
  IfcObjectDefinition,
  IfcPropertySetDefinitionSelect,
  IfcPropertySetDefinition,
  IfcIdentifier,
  IfcText,
} from "web-ifc/web-ifc-api";

type xyz = {
  x: number;
  y: number;
  z: number;
};

type Property = {
  Name: { value: any };
  NominalValue: { value: any };
};

type PropertySet = {
  Name: {
    value: any;
  };
  HasProperties: Property[];
};

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: PointerLockControls,
  model: Model,
  reticleGeometry: RingBufferGeometry;

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
initModal();

function initModal() {
  var modal = document.getElementById("myModal");

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  if (!btn || !modal) return;

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal
  btn.onclick = function () {
    if (!modal) return;
    modal.style.display = "block";
  };

  document.addEventListener("keyup", function (e) {
    if (e.key === "Escape") {
      // escape key maps to keycode `27`
      if (!modal) return;
      modal.style.display = "none";
      controls.lock();
    }
  });

  // When the user clicks on <span> (x), close the modal
  span.addEventListener("click", function () {
    if (!modal) return;
    modal.style.display = "none";
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("onclick", function (event) {
    if (event.target == modal) {
      if (!modal) return;
      modal.style.display = "none";
    }
  });
}

let downloadBlob = function (
  data: Uint8Array,
  fileName: string,
  mimeType: string
) {
  let blob: Blob, url: string;
  blob = new Blob([data], {
    type: mimeType,
  });
  url = window.URL.createObjectURL(blob);
  downloadURL(url, fileName);
  setTimeout(function () {
    return window.URL.revokeObjectURL(url);
  }, 1000);
};

let downloadURL = function (objectURL: string, fileName: string) {
  let a;
  a = document.createElement("a");
  a.href = objectURL;
  a.download = fileName;
  document.body.appendChild(a);
  a.setAttribute("style", "display: none");
  a.click();
  a.remove();
};

function getMaxExpressId() {
  let expressVector = ifcLoader.ifcManager.ifcAPI.GetAllLines(
    model.modelID
  ) as Vector<number>;
  let expressList = [];

  for (let i = 0; i < expressVector.size(); i++) {
    expressList.push(expressVector.get(i));
  }
  return Math.max(...expressList);
}

async function createPSet(
  targetExpressId: number,
  psetName: string
): Promise<number> {
  //everything to be created needs a expressID
  // get list of expressIDs, remember highest (not last)

  let maxExpressID = getMaxExpressId();
  let psetID = ++maxExpressID;

  let owner = (await ifcLoader.ifcManager.getAllItemsOfType(model.modelID, IFCOWNERHISTORY, true))[0] as IfcOwnerHistory

  //create propertyset by name, get id

  let new_property = new IfcProperty(++maxExpressID, IFCPROPERTY, new IfcIdentifier("PropertyIdentifier"), new IfcText("PropertyText"))
  await ifcLoader.ifcManager.ifcAPI.WriteLine(model.modelID, new_property as IfcProperty);

  let relating_propertyset = new IfcPropertySet(
    psetID,
    IFCPROPERTYSET,
    new IfcGloballyUniqueId(crypto.randomUUID()),
    owner,
    new IfcLabel(psetName),
    new IfcText("descirption text pset"), //description
    [
      new_property
    ]
  );
  await ifcLoader.ifcManager.ifcAPI.WriteLine(
    model.modelID,
    relating_propertyset as IfcPropertySet
  );



  // create IfcRelDefinesByProperties to link propertyset to objectid
  let relatedObject = (await ifcLoader.ifcManager.ifcAPI.GetLine(
    model.modelID,
    targetExpressId
  )) as IfcObjectDefinition;

  console.log(relatedObject)

  let ifcrel = new IfcRelDefinesByProperties(
    ++maxExpressID,
    IFCRELDEFINESBYPROPERTIES,
    new IfcGloballyUniqueId(crypto.randomUUID()),
    owner, //owner history
    new IfcLabel("relationfor" + psetName),
    new IfcText("descirption text reldefinesbyproperties"), //description
    [relatedObject],
    relating_propertyset // as IfcPropertySetDefinition] as IfcPropertySetDefinitionSelect
  );

  await ifcLoader.ifcManager.ifcAPI.WriteLine(model.modelID, ifcrel as IfcRelDefinesByProperties);
  return psetID;

  // separate function: pass propertyset expressID
  // create list of properties in propertyset.hasproperties
}

async function downloadIFC() {
  let intarray = ifcLoader.ifcManager.ifcAPI.ExportFileAsIFC(
    model.modelID
  ) as Uint8Array;
  downloadBlob(intarray, "addedpset.ifc", "application/octet-stream");
}

async function createPropertyInPSet(
  targetExpressId: number,
  propertyName: string,
  propertyValue: any
): Promise<number> {
  let targetPSet = (await ifcLoader.ifcManager.ifcAPI.GetLine(
    model.modelID,
    targetExpressId,
    true
  )) as IfcPropertySet;

  let mypsets = await ifcLoader.ifcManager.getAllItemsOfType(
    model.modelID,
    IFCPROPERTYSET,
    true
  );

  // console.log(JSON.parse(JSON.stringify(mypsets)))
  // console.log(JSON.parse(JSON.stringify(mypsets.filter((pset:IfcPropertySet) => pset.expressID === targetExpressId))))

  let new_property_id = getMaxExpressId() + 1;
  targetPSet.HasProperties = [
    ...(targetPSet.HasProperties || []),
    new IfcProperty(
      new_property_id,
      IFCPROPERTY,
      new IfcIdentifier(propertyName),
      new IfcText(propertyValue as string)
    ),
  ];
  await ifcLoader.ifcManager.ifcAPI.WriteLine(model.modelID, targetPSet as IfcPropertySet);
  // ifcLoader.ifcManager.ifcAPI.Init();

  return new_property_id;
}

function displayPSetsInModal(psets: PropertySet[], objectid: number) {
  var modal = document.getElementById("myModal");

  let header = modal?.getElementsByClassName("modal-header")[0];
  if (header) header.getElementsByTagName("h2")[0].textContent = "Objectinfo";

  let footer = modal?.getElementsByClassName("modal-footer")[0];
  if (footer)
    footer.getElementsByTagName("h3")[0].innerHTML =
      "<button onclick='downloadIFC'>Download IFC</button>\n<button onclick='createAndDonwloadBCF'>Download BCF</button>\nObjectinfo";

  let body = document.getElementById("modal-body");
  if (!body || !modal) return;
  body.innerHTML = "";
  for (let pset of psets) {
    let psetDiv = document.createElement("div");
    let title = document.createElement("h3");
    title.textContent = pset?.Name?.value;
    psetDiv.append(title);

    for (let prop of pset.HasProperties) {
      let propField = document.createElement("p");
      propField.textContent = `${prop.Name.value}: ${
        prop.NominalValue?.value || "[UNDEFINIERT]"
      }`;
      psetDiv.append(propField);
    }
    body.append(psetDiv);
  }

  //  create BCF option
  //  public createMarkup(topicTitle: string, author: string, description: string = "", topicType: string = "Issue", topicStatus: string = "In Progress", ifcProjectGuid = "", ifcObjectGuid = "", ifcpath = "", ifcfilename = "", fileIsoTimeString = "")

  //  create pset option
  //

  controls.unlock();
  modal.style.display = "block";
}

function createAndDonwloadBCF(objectid: number) {
  let bcf = new BCF();
  bcf.initBcf();
  // ifcProjectGuid = "", ifcObjectGuid = "", ifcpath = "", ifcfilename = "", fileIsoTimeString = ""
  bcf.createMarkup(
    "Rubi BCF Test",
    "Lukas Schmid",
    "description",
    "topicType",
    "topicStatus",
    "projectGuid",
    `ifcObjectGuid:${objectid}`
  );
  bcf.downloadBcf();
}

function getModalInputListener() {
  // create submit
}

function init() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 0.22;
  camera = camera.rotateY(Math.PI);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 0, 750);

  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  controls = new PointerLockControls(camera, document.body);

  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  if (!blocker) throw new Error("HTML Element missing: blocker");
  if (!instructions) throw new Error("HTML Element missing: instructions");

  instructions.addEventListener("click", function () {
    controls.lock();
  });

  controls.addEventListener("lock", function () {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });

  controls.addEventListener("unlock", function () {
    blocker.style.display = "block";
    instructions.style.display = "";
  });

  scene.add(controls.getObject());

  const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 10;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function (event: KeyboardEvent) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  document.addEventListener("mousedown", function () {
    mouseDown = true;
  });

  document.addEventListener("mouseup", function () {
    mouseDown = false;
  });

  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    200
  );
  raycaster.firstHitOnly = true;

  for (let i = 0; i < 500; i++) {
    const boxMaterial = new THREE.MeshPhongMaterial({
      specular: 0xffffff,
      flatShading: true,
      vertexColors: true,
    });
    boxMaterial.color.setHSL(
      Math.random() * 0.2 + 0.5,
      0.75,
      Math.random() * 0.25 + 0.75
    );

    const box = new THREE.Mesh(
      new THREE.RingBufferGeometry(100 * i, 110 * i, 32),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide })
    );
    box.position.x = Math.floor(Math.random() * 20 - 10) * 20;
    box.position.y = Math.floor(Math.random() * 20) * 20 + 10;
    box.position.z = Math.floor(Math.random() * 20 - 10) * 20;

    scene.add(box);

    // the raycaster shouldn't cosider the reticle
    // objects.push(box);
  }

  reticleGeometry = new THREE.RingBufferGeometry(0.005, 0.01, 3);
  var reticle = new THREE.Mesh(
    reticleGeometry,
    new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      side: THREE.DoubleSide,
      depthTest: false,
      depthWrite: false,
    })
  );
  // asserts drawing on top
  reticle.renderOrder = 999;
  // reticle.onBeforeRender = function (renderer) {
  //   renderer.clearDepth();
  // };

  reticle.position.z = -1.1;
  reticle.lookAt(camera.position);
  camera.add(reticle);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

const selectionMaterial = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.6,
  color: 0xff0000,
  depthTest: false,
  // depthWrite: false,
});
const preSelectionMaterial = new THREE.MeshBasicMaterial({ color: 0x880000 });

let preselectModel = { id: -1 };

function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();
  if (reticleGeometry) {
    reticleGeometry.parameters.thetaStart = Math.floor(time * 10);
  }

  if (controls.isLocked === true) {
    // const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 40.0 * delta;
    velocity.z -= velocity.z * 40.0 * delta;

    velocity.y -= 9.8 * 10.0 * delta; // 10.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    // if (onObject === true) {
    //   // console.log("looking at object")
    //   // console.log(intersections)
    //   velocity.y = Math.max(0, velocity.y);
    //   canJump = true;
    // }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 1) {
      velocity.y = 0;
      controls.getObject().position.y = 1;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}

window.onmousedown = function (event) {
  if (controls.isLocked) {
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);

    // console.log(objects);

    const intersections = raycaster.intersectObjects(objects, true);

    const found = intersections[0];
    console.log(intersections);

    if (found) {
      const index = found.faceIndex;
      const geometry = (found.object as Mesh).geometry;
      const ifc = ifcLoader.ifcManager;
      let id = -1;

      if (mouseDown) {
        if (index) id = ifc.getExpressId(geometry, index);
        // createPSet(id, "LukasTest").then((new_id) => {
        //   // console.log("Creating property....")
        //   createPropertyInPSet(new_id, "TestProperty", "SUCCESS").then(
        //     console.log
        //   );
        // });
        // console.log("clicked");
        console.log(JSON.parse(JSON.stringify(found)));
        let idlist = intersections.map((intersectedObj) =>
          ifc.getExpressId(
            (intersectedObj.object as Mesh).geometry,
            intersectedObj.faceIndex || 0
          )
        );
        // console.log(idlist);
        let new_subset = ifcLoader.ifcManager.createSubset({
          scene: scene,
          modelID: model.modelID,
          // applyBVH: true,
          ids: idlist,
          material: selectionMaterial,
          removePrevious: true,
        });
        // intersections.map((intersectedObj) => scene.remove(intersectedObj.object))

        for (let id of idlist) {
          ifc.getPropertySets(model.modelID, id, true).then((psets) => {
            // console.log(JSON.parse(JSON.stringify(psets)));
            displayPSetsInModal(psets, id);
          });
        }
      }
    }
  }
};

const ifcLoader = new IFCLoader();

async function loadIFC() {
  await ifcLoader.ifcManager.setWasmPath("../../../");
  await ifcLoader.ifcManager.applyWebIfcConfig({
    USE_FAST_BOOLS: true,
    COORDINATE_TO_ORIGIN: true,
  });

  // Sets up optimized picking
  ifcLoader.ifcManager.setupThreeMeshBVH(
    computeBoundsTree,
    disposeBoundsTree,
    acceleratedRaycast
  );

  model = await ifcLoader.loadAsync("IFC/01.ifc");
  scene.add(model);
  objects.push(model);

  // console.log(model);
}

loadIFC();
