export interface Post {
    postId: String;
    userId: String;
    content:String | null;
    fileUrl:String | null;
    fileType: String |null;
    createdAt:String;
    comments: String[],
    likedBy: String[]
}
