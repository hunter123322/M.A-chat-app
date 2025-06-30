import { Request, Response } from "express";
import messaging from "../model/messaging.js";

async function getConversation(req: Request, res: Response) {
  try {
    const conversationList = await messaging.conversationModel.find();

    if (!conversationList) {
      res.render("emptyConversation");
    }

    res.render("conversation");
  } catch (error) {
    res.status(404);
  }
}

async function getConversationByID(req: Request, res: Response) {
  try {
    const messageId = req.params.id;

  } catch (error) {
    res.status(500);
  }
}

async function searchConversation(req: Request, res: Response) {
  try {
    const userName = req.query.name;
    const conversationList = await messaging.conversationModel.find({ users: userName });

    if (!conversationList) {
      res.render("emptyConversation");
    }

    res.render("conversation", { conversation: conversationList });
  } catch (error) {
    res.status(404);
  }
}

async function getMessage(req: Request, res: Response) {
  try {
    const user = req.query.user;
  } catch (error) {
    res.status(404);
  }
}
// async function newContact(req: Request, res: Response) {}
