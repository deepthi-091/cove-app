import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '@/constants';
import { Button, Input, Snackbar } from '@/components';
import commentsApiService, { Comment, CommentPayload } from '@/api/comments/commentsApi';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CommentsSectionProps {
  productId: number;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const [formData, setFormData] = useState<CommentPayload>({
    name: '',
    email: '',
    body: '',
    postId: productId,
  });

  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    setLoading(true);
    const response = await commentsApiService.getCommentsByProduct(productId);

    if (response.success && response.data) {
      setComments(response.data.slice(0, 5)); // Show only first 5 comments
    } else {
      showSnackbar(response.message, 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      body: '',
      postId: productId,
    });
    setEditingComment(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (comment: Comment) => {
    setEditingComment(comment);
    setFormData({
      name: comment.name,
      email: comment.email,
      body: comment.body,
      postId: comment.postId,
    });
    setShowModal(true);
  };

  const handleSaveComment = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.body.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    if (editingComment) {
      // Update comment
      const response = await commentsApiService.updateComment(
        Number(editingComment.id),
        formData
      );
      if (response.success) {
        showSnackbar(response.message, 'success');
        setComments(
          comments.map((c) =>
            c.id === editingComment.id ? { ...c, ...formData } : c
          )
        );
      } else {
        showSnackbar(response.message, 'error');
      }
    } else {
      // Create comment
      const response = await commentsApiService.createComment(formData);
      if (response.success && response.data) {
        showSnackbar(response.message, 'success');
        setComments([response.data, ...comments]);
      } else {
        showSnackbar(response.message, 'error');
      }
    }
    setShowModal(false);
    resetForm();
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View>
          <Text style={styles.commentName}>{item.name}</Text>
          <Text style={styles.commentEmail}>{item.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.commentBody}>{item.body}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      <View style={styles.header}>
        <Text style={styles.title}>💬 Comments ({comments.length})</Text>
        <TouchableOpacity style={styles.addCommentButton} onPress={openAddModal}>
          <Text style={styles.addCommentButtonText}>+ Add Comment</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>
          <Button label="Add Comment" onPress={openAddModal} />
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          scrollEnabled={false}
          nestedScrollEnabled={false}
        />
      )}

      {/* Add/Edit Comment Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingComment ? 'Edit Comment' : 'Add Comment'}
              </Text>
              <View style={{ width: 30 }} />
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.fieldLabel}>Name *</Text>
              <Input
                placeholder="Your name"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />

              <Text style={styles.fieldLabel}>Email *</Text>
              <Input
                placeholder="Your email"
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />

              <Text style={styles.fieldLabel}>Comment *</Text>
              <Input
                placeholder="Write your comment here..."
                value={formData.body}
                onChangeText={(text) => setFormData({ ...formData, body: text })}
                multiline
                numberOfLines={4}
                style={styles.textAreaInput}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                label={editingComment ? 'Update Comment' : 'Post Comment'}
                onPress={handleSaveComment}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.lg,
    paddingHorizontal: SIZES.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  title: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  addCommentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  addCommentButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.fontSize.xs,
  },
  loadingContainer: {
    paddingVertical: SIZES.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: SIZES.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  commentCard: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.md,
    marginBottom: SIZES.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.sm,
  },
  commentName: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  commentEmail: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
  },
  editButton: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.borderRadius.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editButtonText: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '500',
    color: COLORS.text,
  },
  commentBody: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
    lineHeight: 18,
    marginTop: SIZES.sm,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.borderRadius.lg,
    borderTopRightRadius: SIZES.borderRadius.lg,
    maxHeight: '90%',
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  formContainer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  fieldLabel: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  textAreaInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
