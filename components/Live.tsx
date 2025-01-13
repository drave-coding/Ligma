
import React, { useCallback } from 'react'
import LiveCursors from './cursor/LiveCursors';
import { useMyPresence, useOthers } from '@liveblocks/react/suspense';

const Live = () => {
    const others = useOthers();
    const [{cursor},updateMyPresence] = useMyPresence() as any;

    const handlePointerMove = useCallback((event:React.PointerEvent) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({cursor: {x, y}});
    },[]);

    const handlePointerLeave = useCallback((event:React.PointerEvent) => {
      event.preventDefault();
      
      updateMyPresence({cursor: null,message:null});
    },[]);

    const handlePointerDown = useCallback((event:React.PointerEvent) => {
      event.preventDefault();
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientY - event.currentTarget.getBoundingClientRect().y;
      updateMyPresence({cursor: {x, y}});
    },[]);

  return (
    <div className="h-[100vh] w-full flex justify-center items-center text-center"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <h1 className="text-2xl text-white">
        This is a room
      </h1>
        <LiveCursors others={others} />
    </div>
  )
}

export default Live