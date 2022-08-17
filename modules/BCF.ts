import { Version } from "./classes/version";
// import JSZip from "jszip";
import { generateUUID } from "three/src/math/MathUtils";
import { downloadZip } from "client-zip";

export default class BCF {
  private version: Version;
  private filelist: any[] = [];
  /*
        File structure
        - extensions.xml
        - bcf.version
        - {topic-guid}
        - markup.bcf
        - {viewpointelement}.bcfv
        - {snapshotelement}.png (<1500px sides)
        
        
        markup also describes viewpoints & snapshots
    */
  /*
        Create instances of BCF Files
        projectId

        Markups: IFCGuid


        Make Typescript declaration for elements -> translate to xml at entry/exit

        allow fileupload
    */

  private makeChildren(xml_root: XMLDocument, parent_xml: HTMLElement | null, jsobject: Object): HTMLElement[]{
    let newEles: HTMLElement[] = []
    for (const [key, value] of Object.entries(jsobject)){
       if (key == "_text" && parent_xml){
        parent_xml.innerHTML = value as string
       }else
       if (key == "_attributes" && parent_xml){
        for (const [vkey, vvalue] of Object.entries(value as Object)){
          parent_xml.setAttribute(vkey, vvalue)
        }
       }else {
        let newEle = xml_root.createElement(key)
        
        for (let child of this.makeChildren(xml_root, newEle, value))
          newEle.appendChild(child)
          newEles.push(newEle)
       }

    }
    return newEles
  }

  private js2xml(jsobject: Object): XMLDocument{
    var doc = document.implementation.createDocument("", "", null);
    for (let child of this.makeChildren(doc, null, jsobject))
      doc.appendChild(child)
    return doc
  }


  public initBcf() {

    /*
        <!-- STATIC -->
        <Version VersionId="2.1" xsi:noNamespaceSchemaLocation="version.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
            <DetailedVersion>2.1</DetailedVersion>
        </Version>
    */
    let jsversion = {
      Version: {
        _attributes: {
          VersionId: "2.1",
          "xsi:noNamespaceSchemaLocation": "version.xsd",
          "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
        },
        DetailedVersion: {
          _text: "2.1",
        },
      },
    };

    let versionXML = this.js2xml(jsversion);
    var serializer = new XMLSerializer();
    let versionXMLText = serializer.serializeToString(versionXML)
    this.filelist.push({name:"bcf.version", input:versionXMLText})
    // <!-- DYNAMIC -->
    // <Markup>
    //     <Topic Guid="488580A4-D2BB-4CB1-8F35-E4253E255757" TopicType="Issue" TopicStatus="In Progress">
    //         <Title>Fahrbahnoberfläche</Title>
    //         <Index>0</Index>
    //         <CreationDate>2022-07-29T08:34:16</CreationDate>
    //         <CreationAuthor>Floris Piso</CreationAuthor>
    //         <Description>Muss mindestens 2° Neigung aufweisen. Wie schaffen wir das?</Description>
    //     </Topic>
    // </Markup>
  }


  public createMarkup(topicTitle: string, author: string, description: string = "", topicType: string = "Issue", topicStatus: string = "In Progress", ifcProjectGuid = "", ifcObjectGuid = "", ifcpath = "", ifcfilename = "", fileIsoTimeString = ""){
    var serializer = new XMLSerializer();
    let markupUUID = generateUUID();
    let today = new Date()
    let datestring = today.toLocaleDateString("de-DE", { // you can use undefined as first argument
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    let jsmarkup = {
      Markup: {
        Header: {
          File: {
            _attributes: {
              IfcProject: ifcProjectGuid,
              IfcSpatialStructureElement: ifcObjectGuid,
              isExternal: true
            },
            Filename: {
              _text: ifcfilename
            },
            Date: {
              _text: fileIsoTimeString
            },
            Reference: {
              _text: ifcpath
            }
          }
        },
        Topic: {
          _attributes: {
            Guid: markupUUID,
            TopicType: topicType || "Issue",
            TopicStatus: topicStatus || "In Progress"
          },
          Title: {
            _text: topicTitle
          },
          Index: {
            _text: "0"
          },
          CreationDate: {
            _text: datestring
          },
          CreationAuthor: {
            _text: author
          },
          Description: {
            _text: description
          },
        },
      },
    };

    let markupXML = this.js2xml(jsmarkup);
    let markupXMLText = serializer.serializeToString(markupXML)
    this.filelist.push({name:`${markupUUID}/markup.bcf`, input:markupXMLText})
  }

  public async loadBcf(): Promise<string> {
    // return project id
    // this.zip = await JSZip.loadAsync("zipdata");
    // for (let filename of Object.keys(this.zip.files)) {
    //   let filecontent = this.zip.files[filename];
    //   filecontent.async("string").then((textcontent) => {
    //     console.log(xmljs.xml2js(textcontent));
    //     // do something with textcontent by filename
    //   });
    // }
    throw Error("Not implemented")
    return "success";
  }

  public async downloadBcf() {
  /*
    Iterate filelist (filestructure)
    Collect BCF by project
    Group markups in folder
  */

    // this.zip.file("hello.txt", "Hello[p my)6cxsw2q");
    // this.zip.folder("uuid")?.file("hello.txt", "Hello World\n");

    const blob = await downloadZip(this.filelist).blob()

    // make and click a temporary link to download the Blob
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "test.bcf"
    link.click()
    link.remove()
      // write to file & download
    //   var a = document.createElement("a");
    //   document.body.appendChild(a);
    //   let blob = content;
    //   let url = window.URL.createObjectURL(blob);
    //   a.href = url;
    //   a.download = "example.bcf";
    //   a.click();
    //   window.URL.revokeObjectURL(url);
    //   document.body.removeChild(a);
    // });
    //create files
    //zip
  }

  public writeSnapshot() {}

  public writeTopic() {}

  public getTopics() {
    // return map from ifc-guid to text
  }
}