"use client";
import {fabric}  from "fabric";

import Live from "@/components/Live";
import Navbar from "@/components/Navbar";
import RightSideBar from "@/components/RightSideBar";
import { useEffect, useRef, useState } from "react";
import { handleCanvaseMouseMove, handleCanvasMouseDown, handleResize, initializeFabric, handleCanvasMouseUp, renderCanvas, handleCanvasObjectModified, handleCanvasSelectionCreated, handleCanvasObjectScaling, handlePathCreated } from "@/lib/canvas";
import { ActiveElement, Attributes } from "@/types/type";

import { useMutation, useRedo, useStorage, useUndo } from "@liveblocks/react/suspense";
import { defaultNavElement } from "@/constants";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { handleImageUpload } from "@/lib/shapes";
import LeftSideBar from "@/components/LeftSideBar";





export default function Page() {

  const undo = useUndo();
  const redo = useRedo();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const isEditingRef = useRef(false);

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width:'',
    height:'',
    fontSize:'',
    fontFamily:'',
    fontWeight:'',
    fill:'#aabbcc',
    stroke:'#aabbcc',
  })

  const canvasObjects = useStorage((root) => root.canvasObjects);
  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: '',
    value: '',
    icon: '',
  })

  const syncShapeInStorage = useMutation(({ storage },object)=>{
    if(!object) return;
    
    const { objectId } = object;
    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.set(objectId,shapeData);
  },[]);

  const deleteAllShapes = useMutation(({storage})=>{
    const canvasObjects = storage.get('canvasObjects');
    if(!canvasObjects || canvasObjects.size === 0){
      return true;
    }
    for(const [key,value] of canvasObjects.entries()){
      canvasObjects.delete(key);
    }
    return canvasObjects.size === 0;

  },[])

  const deleteShapeFromStorage = useMutation(({storage},objectId)=>{
    const canvasObjects = storage.get('canvasObjects');
    canvasObjects.delete(objectId);
  },[])
  

  const handleActiveElement = (elem:ActiveElement) =>{
    setActiveElement(elem);

    switch(elem?.value){

      case 'reset':
        deleteAllShapes();
        fabricRef.current?.clear();
        setActiveElement(defaultNavElement);
        break;
      
      case 'delete':
        handleDelete(fabricRef.current as any, deleteShapeFromStorage);
        setActiveElement(defaultNavElement);
        break;

      case 'image':
        imageInputRef.current?.click();
        isDrawing.current = false;

        if(fabricRef.current){
          fabricRef.current.isDrawingMode = false;
        }
        break;

      default:
        break;
    }


    selectedShapeRef.current = elem?.value as string;
  }

 
  // now we create the canvas and the fabric instance
  useEffect(()=>{
    const canvas = initializeFabric({canvasRef, fabricRef});


    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });
    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage,
      });
    });
    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage,
        setActiveElement,
        activeObjectRef,
      });
    });
    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    });
    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    })
    canvas.on("object:scaling",(options)=> {
      handleCanvasObjectScaling({
        options, 
        setElementAttributes,
      })
    })
    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,syncShapeInStorage
      })
    })
 
    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keydown",(e)=>{
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
        
      })
    });



    return () => {
      canvas.dispose();
    }

  },[]);

  // Re render the canvas on Any change to canvasObjects
  useEffect(()=>{
    renderCanvas({
     fabricRef,
     canvasObjects,
     activeObjectRef,
    })
   },[canvasObjects]);
  
  
  
  return (
    

    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        handleActiveElement={handleActiveElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(e:any) => {
          e.stopPropagation();
          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef, 
            syncShapeInStorage
          })
        }}
      />
      <section className="flex h-full flex-row">
      <LeftSideBar allShapes={Array.from(canvasObjects)}/>
      <Live canvasRef={canvasRef} undo={undo} redo={redo} />
      <RightSideBar
        elementAttributes={elementAttributes}
        setElementAttributes={setElementAttributes}
        fabricRef={fabricRef}
        isEditingRef={isEditingRef}
        activeObjectRef={activeObjectRef}
        syncShapeInStorage={syncShapeInStorage}
      />
      </section>
    </main>
  ); 
}
