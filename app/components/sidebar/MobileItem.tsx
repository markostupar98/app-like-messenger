'use client'

import clsx from "clsx"
import Link from "next/link"

interface MobileItemProps{
    href:string;
    onClick:() => void;
    active?:boolean;
    icon:any
}

const MobileItem = ({href,onClick,active,icon:Icon}:MobileItemProps) => {
const handleClick = () => {
    if(onClick) {
        return onClick()
    }
}

    return <Link onClick={handleClick} className={clsx(`
    group 
    flex
    gap-x-3
    text-sm
    leading-6
    font-semibold
    w-full justify-center p-4 text-gray-500 hover:text-black hover:bg-gray-200
    `,
    active && 'bg-gray-100 text-black'
    )} href={href}>
        <Icon className='h-6 w-6' /></Link>
}

export default MobileItem