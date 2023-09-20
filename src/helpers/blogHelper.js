exports.populateReplies = async (comment) => {
    if (comment.replies && comment.replies.length > 0) {
        const populatedReplies = await Promise.all(
            comment.replies.map(async (replyId) => {
                const replyComment = await Comment.findById(replyId);
                if (replyComment) {
                    if (replyComment.level < MAX_LEVEL) {
                        replyComment.replies = await populateReplies(
                            replyComment,
                        );
                    }
                }
                return replyComment;
            }),
        );
        return populatedReplies;
    }
    return [];
};

exports.mergeComments = (comments) => {
    const commentMap = new Map();

    // Tạo một bản đồ với key là _id của comment và value là comment đó
    comments.forEach((comment) => {
        commentMap.set(comment._id.toString(), comment);
    });

    // Duyệt qua từng comment để gán reply vào comment cha tương ứng
    comments.forEach((comment) => {
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach((reply) => {
                if (reply.parent && reply.parent.toString()) {
                    const parentComment = commentMap.get(
                        reply.parent.toString(),
                    );
                    if (parentComment) {
                        if (!parentComment.replies) {
                            parentComment.replies = [];
                        }
                        parentComment.replies.push(reply);
                    }
                }
            });
        }
    });

    // Lọc ra các comment cha (type === 'comment') và trả về kết quả
    const mergedComments = comments.filter(
        (comment) => comment.type === 'comment',
    );

    return mergedComments;
};
