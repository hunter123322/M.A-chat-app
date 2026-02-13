import axios from "axios";
import { CommentModel } from "../../model/post/comment.mongo.model";
import { PostModel } from "../../model/post/post.mongo.model";
import type { CommentType } from "../../types/post/comment.type";
import { NotificationService } from "../notification/notification.service";

export class Comment {
    static async create(commentData: CommentType): Promise<CommentType> {
        try {
            if (!commentData) throw new Error("Retry the comment!");
            // Create the comment
            const data = await CommentModel.insertOne(commentData);
            if (!data) throw new Error("Failed to create comment(s)");
            // Increment commentCount
            const updatedPostDoc = await PostModel.findByIdAndUpdate(
                data.postID,
                { $inc: { commentCount: 1 } },
                { new: true }
            );
            if (!updatedPostDoc || !updatedPostDoc.author?.id) {
                console.warn("Updated post not found or missing author — skipping notification");
                return data;
            }
            // Skip if author comments on their own post
            if (updatedPostDoc.author.id === commentData.author.id) return data;
            // Prepare notification payload
            const notificationData = {
                userID: updatedPostDoc.author.id,
                engagementID: data._id,
                actor: commentData.author,
                categories: "comment" as const,
                content: "",
                read: false
            };
            // Create notification in your DB or service
            const newNotification = await NotificationService.create(notificationData);
            /**
             * Attempt to send notification to server:3001 (non-blocking)
             * 
             * So the reason why i separate this is when im making the CRUD opperation
             * in REST APIs, the server for notification is off.
             */
            (async () => {
                try {
                    await axios.post("http://localhost:3001/internal/notify",
                        { notificationData, newNotification },
                        { headers: { "x-api-key": process.env.INTERNAL_API_KEY } }
                    );
                } catch (notifyErr: any) {
                    console.warn("⚠ Failed to send notification to server 3001:", notifyErr.message);
                }
            })();

            return data;
        } catch (error: any) {
            console.error("❌ Error in create comment:", error.message);
            throw new Error("Failed to create comment(s)");
        }
    }


    static async delete(commentID: string, userID: number): Promise<void> {
        if (!commentID || !userID) {
            throw new Error("Invalid delete parameters");
        }
        try {
            const result = await CommentModel.deleteOne({ _id: commentID, "user.userID": userID });
            if (result.deletedCount === 0) {
                throw new Error("Comment not found or unauthorized");
            }
        } catch (error: any) {
            throw new Error("Failed to delete comment");
        }
    }

    static async getByPost(postID: string, lastCommentTimestamp?: string): Promise<CommentType[]> {
        if (!postID) {
            throw new Error("Post ID is required");
        }

        try {
            const query: any = { postID };

            if (lastCommentTimestamp) {
                query.createdAt = { $lt: new Date(lastCommentTimestamp) }; // ✅ older than the last loaded
            }

            const comments: CommentType[] = await CommentModel.find(query)
                .sort({ createdAt: -1 }) // newest first
                .limit(5);

            return comments;
        } catch (error: any) {
            console.error("Error in getByPost:", error);
            throw new Error("Failed to fetch comments");
        }
    }

    static async getByID(commentID: string): Promise<CommentType | null> {
        if (!commentID) {
            throw new Error("Comment ID is required");
        }

        try {
            const comment = await CommentModel.findById(commentID);

            if (!comment) {
                throw new Error("Comment not found");
            }

            return comment;
        } catch (error: any) {
            console.error("Error in getByID:", error);
            throw new Error("Failed to fetch comment by ID");
        }
    }

}
