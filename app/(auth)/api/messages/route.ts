import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/services/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: {
            id: conversationId,
          },
        },
        sender: {
          connect: {
            id: currentUser.id,
          },
        },
        seen: {
          connect: {
            id: currentUser.id,
          },
        },
      },
      include:{
        seen:true,
        sender:true
      }
    });
    const updatedConversation = await prisma.conversation.update({
        where:{
            id:conversationId
        },
        data:{
            lastMessageAt:new Date(),
            messages:{
                connect:{
                    id:newMessage.id
                }
            }
        },
        include:{
            users:true,
            messages:{
                include:{
                    seen:true
                }
            }
        }
    })
    return NextResponse.json(newMessage)
  } catch (error: any) {
    console.log(error, "Err message");
    return new NextResponse("Internal error", { status: 500 });
  }
}