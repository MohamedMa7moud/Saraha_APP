import * as dbService from "../../DB/DBService.js";
import UserModel from "../../DB/Models/user.model.js";
import MessageModel from "../../DB/Models/message.model.js";
import { SuccessResponse } from "../../Utils/SuccessResponse.utils.js";
export const sendMessage = async (req, res, next) => {
  const { content } = req.body;
  const { receiverId } = req.params;

  const user = await dbService.findById({
    model: UserModel,
    id: receiverId,
  });
  if (!user) return next(new Error("Receiver Not Found", { cause: 404 }));
  const message = await dbService.create({
    model: MessageModel,
    data: [
      {
        content,
        receiverId: user._id,
      },
    ],
  });
  return SuccessResponse({
    res,
    statusCode: 201,
    message: "Message has been Sent Successfully",
    data: { message },
  });
};

export const getMessage = async (req, res, next) => {
  const messages = await dbService.find({
    model: MessageModel,
    populate: [
      { path: "receiverId", select: "firstName middleName email gender -_id" },
    ],
  });
  
  return SuccessResponse({
    res,
    statusCode: 200,
    message: "Messages has been Fetched Successfully",
    data: { messages },
  });
};
