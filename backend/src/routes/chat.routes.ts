import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.ts";
import { getConversations, getMessages, createConversation } from "../controllers/chat.controller.ts";

const router = Router();

router.get("/conversations", requireAuth, getConversations);
router.post("/conversations", requireAuth, createConversation);
router.get("/messages/:conversationId", requireAuth, getMessages);

export default router;
