import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  const _user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(_user._id);
  const foundUser = await UserModel.findById(userId);
  console.log("foundUser", foundUser);
  console.log("foundUser.messages", foundUser?.messages);

  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not Found",
        },
        { status: 401 }
      );
    } else if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "No Messages Found for the user",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("an unexpected error", error);
    return Response.json(
      {
        success: false,
        message: "Error in database",
      },
      { status: 500 }
    );
  }
}
