import { Message } from "./../../../../model/user";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Types } from "mongoose";
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  console.log("params", params);
  const { id: messageId } = params;

  // try {
  //   const deleteMessage = await UserModel.findByIdAndDelete(id);

  //   if (!deleteMessage) {
  //     return Response.json({
  //       success: false,
  //       message: "No Message found",
  //     });
  //   }
  //   return Response.json({
  //     success: true,
  //     message: "message deleted Successfully",
  //   });
  // } catch (error: any) {
  //   console.log("error", error);
  //   return Response.json({
  //     success: false,
  //     message: error.message,
  //   });
  // }

  try {
    if (!Types.ObjectId.isValid(messageId)) {
      return Response.json({ success: false, message: "Invalid message ID" });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { "messages._id": messageId },
      { $pull: { messages: { _id: messageId } } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ success: false, message: "Message not found" });
    }

    return Response.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message });
  }
}
