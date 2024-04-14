import prisma from "@/app/lib/prismadb"
import { pusherServer } from "@/app/lib/pusher"
import getCurrentUser from "@/app/services/getCurrentUser"
import { NextResponse } from "next/server"

interface IParams{
    conversationId?:string
}

export async function DELETE(request:Request,{params}:{params:IParams}) {
    try{
        const {conversationId} = params
        const currentUser = await getCurrentUser()

        if(!currentUser?.id) {
            return new NextResponse('Unathorized',{status:401})
        }

        const existingConversation = await prisma.conversation.findUnique({
            where:{
                id:conversationId
            },
            include:{
                users:true
            }
        })
        if(!existingConversation){
            return new NextResponse('Invalid id',{status:400})
        }
        const deletedConversation = await prisma.conversation.deleteMany({
            where:{
                id:conversationId,
                userIds:{
                    hasSome:[currentUser.id]
                }
            }
        })

        existingConversation.users.forEach((user)=>{
            if(user.email){
                pusherServer.trigger(user.email,'conversation:remove', existingConversation)
            }
        })

        return NextResponse.json(deletedConversation)
    }catch(error:any){
        console.log(error,'Conversation error')
        return new NextResponse('Internal error',{status:500})
    }
}