package org.project.services;

import org.project.models.Comment;
import org.project.repositories.CommentRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public Comment createComment(Comment comment) {
        comment.setCreatedAt(new Date());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByTaskId(String taskId) {
        return commentRepository.findByTaskId(taskId);
    }

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Comment getCommentById(String id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + id));
    }

    public Comment updateComment(String id, Comment newComment) {
        Comment existing = getCommentById(id);
        existing.setContent(newComment.getContent());
        existing.setCreatedBy(newComment.getCreatedBy());
        existing.setTaskId(newComment.getTaskId());
        existing.setCreatedAt(new Date());
        return commentRepository.save(existing);
    }

    public void deleteComment(String id) {
        if (!commentRepository.existsById(id)) {
            throw new IllegalArgumentException("Comment not found with ID: " + id);
        }
        commentRepository.deleteById(id);
    }
}
