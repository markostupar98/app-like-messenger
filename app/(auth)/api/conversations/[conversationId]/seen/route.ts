import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/services/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  conversationId?: string;
}
export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        messages: {
          include: {
            seen: true,
          },
        },
        users:true
      },
    });
    if(!conversation){
        return new NextResponse('Invalid id',{status:400})
    }
    // Finding last message
    const lastMessage = conversation.messages[conversation.messages.length - 1]

    if(!lastMessage){
        return NextResponse.json(conversation)
    }
    // Update seen of the last message
    
    const updatedMessage = await prisma.message.update({
        where:{
            id:lastMessage.id
        },
        include:{
            seen:true,
            sender:true
        },
        data:{
            seen:{
                connect:{
                    id:currentUser.id
                }
            }
        }
    })
    return NextResponse.json(updatedMessage)
  } catch (error: any) {
    console.log(error, "ERr messages seen");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
