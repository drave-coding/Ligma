
import React, { useCallback, useEffect, useState } from 'react'
import LiveCursors from './cursor/LiveCursors';
import { useBroadcastEvent, useEventListener, useMyPresence,  } from '@liveblocks/react/suspense';
import { CursorMode, CursorState, Reaction } from '@/types/type';
import CursorChat from './cursor/CursorChat';
import ReactionSelector from './reaction/ReactionButton';
import FlyingReaction from './reaction/FlyingReaction';
import useInterval from '@/hooks/useInterval';
import { Comments } from './comments/Comments';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { shortcuts } from '@/constants';


type Props = {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  redo : () => void;
  undo : () => void;
}

const Live = ({canvasRef ,undo , redo}:Props) => {
  
    const [{cursor},updateMyPresence] = useMyPresence() ;

    const [cursorState, setCursorState] = useState<CursorState>({
      mode: CursorMode.Hidden,
    });

    const [reactions, setReactions] = useState<Reaction[]>([]);
    const broadcast = useBroadcastEvent();

    const setReaction = useCallback((reaction:string)=>{
      setCursorState({mode:CursorMode.Reaction, reaction,isPressed:false});
    },[]);

  useInterval(() => {
    setReactions((reactions) => reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000));
  }, 1000);

    useInterval(() => {
      if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor){
        setReactions((reactions) => reactions.concat([
          {
            point:{x:cursor.x,y:cursor.y},
            value: cursorState.reaction,
            timestamp: Date.now(),
          }
        ]))
        broadcast({
          x: cursor.x,
          y: cursor.y,
          value: cursorState.reaction,
        });
      }

      
    },100);

    useEventListener((eventData) => {
      const event = eventData.event;
      setReactions((reactions) => reactions.concat([
        {
          point:{x:event.x,y:event.y},
          value: event.value,
          timestamp: Date.now(),
        }
      ]))
    })

    useEffect(() => {
      const onKeyUp = (e:KeyboardEvent) => {
        if(e.key === '/'){
          setCursorState({
            mode: CursorMode.Chat,
            previousMessage: null,
            message: '',
          })
        } else if(e.key === 'Escape'){
          updateMyPresence({message:''})
          setCursorState({mode: CursorMode.Hidden});
        } else if (e.key === 'e'){
          setCursorState({
            mode: CursorMode.ReactionSelector
          });
        }
      }

      const onKeyDown = (e:KeyboardEvent) => {
        if(e.key === '/'){
          e.preventDefault();
        }
      }

      window.addEventListener('keyup',onKeyUp);
      window.addEventListener('keydown',onKeyDown);
      return () => {
        window.removeEventListener('keyup',onKeyUp);
        window.removeEventListener('keydown',onKeyDown);
      }
    },[updateMyPresence]);

   

    const handlePointerMove = useCallback((event:React.PointerEvent) => {
      event.preventDefault();
      if(cursor===null || cursorState.mode !== CursorMode.ReactionSelector){

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
        updateMyPresence({cursor: {x, y}});
      }
    },[]);

    const handlePointerLeave = useCallback((event:React.PointerEvent) => {
      setCursorState({mode: CursorMode.Hidden});
      
      updateMyPresence({cursor: null,message:null});
    },[]);

    const handlePointerDown = useCallback((event:React.PointerEvent) => {
      
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({cursor: {x, y}});

      setCursorState((state:CursorState) => 
        cursorState.mode === CursorMode.Reaction?{...state,isPressed: true} : state
      );

    },[cursorState.mode, setCursorState]);

    const handlePointerUp = useCallback(() => {
      setCursorState((state:CursorState) => 
        cursorState.mode === CursorMode.Reaction?{...state,isPressed: false} : state
      );
    },[cursorState.mode, setCursorState]);

    const handleContextMenuClick = useCallback((key: string) => {
    switch (key) {
      case "Chat":
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
        break;

      case "Reactions":
        setCursorState({ mode: CursorMode.ReactionSelector });
        break;

      case "Undo":
        undo();
        break;

      case "Redo":
        redo();
        break;

      default:
        break;
    }
  }, []);


  return (
    <ContextMenu>
    <ContextMenuTrigger id="canvas" className=" relative h-full w-full flex flex-1 justify-center items-center "
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerUp={handlePointerUp}
    >
      <canvas ref={canvasRef}/>

      {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            x={reaction.point.x}
            y={reaction.point.y}
            timestamp={reaction.timestamp}
            value={reaction.value}
          />
        ))}

      {cursor && (
        <CursorChat 
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      {cursorState.mode === CursorMode.ReactionSelector && (
        <ReactionSelector
        setReaction={(reaction) => {
          setReaction(reaction);
        }}
        />
      )}
        <LiveCursors  />
        <Comments />
    </ContextMenuTrigger>
    <ContextMenuContent className='right-menu-content'>
      {shortcuts.map((item) => (
        <ContextMenuItem key={item.name} onClick={() => handleContextMenuClick(item.name)} className='right-menu-item' >
          <p>
            {item.name}
          </p>
          <p className='text-xs text-primary-grey-300'>
            {item.shortcut}
          </p>
        </ContextMenuItem>
      ))}
    </ContextMenuContent>
    </ContextMenu>
  )
}

export default Live