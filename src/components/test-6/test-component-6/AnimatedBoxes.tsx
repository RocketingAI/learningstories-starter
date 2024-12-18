"use client"

import React from 'react'

export const AnimatedBoxes: React.FC = () => {
  return (
    <div className="relative w-[200px] h-[200px] animate-bigBox">
      <div className="absolute top-[60%] left-1/2 w-[40px] h-[40px] -mt-[20px] -ml-[20px] animate-box">
        <div className="absolute top-0 left-0 w-[6px] h-[6px] bg-white rounded-full animate-span shadow-glow"></div>
      </div>
      <div className="absolute top-[60%] left-1/2 w-[40px] h-[40px] -mt-[20px] -ml-[20px] animate-box2">
        <div className="absolute top-0 left-0 w-[6px] h-[6px] bg-white rounded-full animate-span shadow-glow"></div>
      </div>
    </div>
  )
}

