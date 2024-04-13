import prisma from "@/app/lib/prismadb";
import getCurrentUser from "@/app/services/getCurrentUser";
import { NextResponse, userAgent } from "next/server";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { name, image } = body;

    if (!currentUser?.id) {
      return new NextResponse("Unathorized", { status: 401 });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data:{
        image,
        name
        
      }
    });
    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.log(error, "Settings error");
    return new NextResponse("Internal server error", { status: 500 });
  }
}
