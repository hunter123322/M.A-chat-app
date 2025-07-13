import { log } from "console";
import { initUserConversation } from "./model/user/user.mongo.model";
import mongoDBconnection from "./db/mongodb/mongodb.connection";
mongoDBconnection()

const a = await initUserConversation([ "1_14_1752146453348" ])
log(a)