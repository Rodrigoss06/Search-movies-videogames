import React, { type MouseEventHandler, type ReactNode } from 'react'
interface Props {
  children:ReactNode;
  className?: string | undefined
  handleClick?: MouseEventHandler<HTMLDivElement>
}
function Badge({children, className, handleClick}:Props) {
  return (
    <span onClick={handleClick} className={`relative ${className} flex overflow-hidden rounded-full p-[1px]`}>
    <div className="inline-flex  h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800/60 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
      {children}
    </div>
  </span>
  )
}

export default Badge


