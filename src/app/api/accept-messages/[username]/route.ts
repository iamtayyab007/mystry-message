import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { NextRequest } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  await dbConnect();

  const { username } = params;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json({
        success: false,
        message: "user not found with this username",
      });
    }
    return Response.json({
      success: true,
      isAcceptingMessage: user.isAcceptingMessage,
    });
  } catch (error) {
    console.log("failed to get user status to accept message");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
