import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { COLORS, SIZES } from '@/constants';
import { Button, Input, Snackbar } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { getCommentsByProduct, createComment, updateComment } from '@/api/comments/commentsApi';
import { realtimeComments } from '@/services/realtimeDb';
import { firestoreComments } from '@/services/firestore';
import { isFirebaseConfigured } from '@/lib/firebase';
import { storage } from '@/utils/storage';
import type { Comment, CommentPayload } from '@/types/comments';
import type { DatabaseReference } from 'firebase/database';

const DRAFT_KEY_PREFIX = 'draft_comment_';

// Only validate comment body - name and email come from authenticated user
const commentSchema = Yup.object({
  body: Yup.string()
    .min(10, 'Comment must be at least 10 characters')
    .required('Please write a comment'),
});

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface CommentsSectionProps {
  productId: number;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ productId }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [draftBody, setDraftBody] = useState('');
  const [snackbar, setSnackbar] = useState<SnackbarState>({ visible: false, message: '', type: 'success' });
  const rtdbRef = useRef<DatabaseReference | null>(null);
  const isRealtime = isFirebaseConfigured();

  const draftKey = `${DRAFT_KEY_PREFIX}${productId}`;

  // Show login message if user is not authenticated
  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>💬 Comments ({comments.length})</Text>
        </View>
        <View style={styles.loginPrompt}>
          <Text style={styles.loginPromptText}>Please login to view and add comments</Text>
        </View>
      </View>
    );
  }

  useEffect(() => {
    loadDraft();

    if (isRealtime) {
      setLoading(true);
      rtdbRef.current = realtimeComments.subscribe(productId, (liveComments) => {
        if (liveComments.length > 0) {
          setComments(liveComments.slice(0, 10));
        } else {
          // Fall back to API if RTDB is empty
          loadFromApi();
        }
        setLoading(false);
      });
    } else {
      loadFromApi();
    }

    return () => {
      realtimeComments.unsubscribe(rtdbRef.current);
    };
  }, [productId]);

  const loadDraft = async () => {
    try {
      const drafts = await storage.getReviews();
      const draft = drafts?.find((d: any) => d.key === draftKey);
      if (draft) setDraftBody(draft.body || '');
    } catch { /* ignore */ }
  };

  const saveDraft = async (body: string) => {
    try {
      const drafts = (await storage.getReviews()) || [];
      const filtered = drafts.filter((d: any) => d.key !== draftKey);
      if (body.trim()) {
        filtered.push({ key: draftKey, body, savedAt: Date.now() });
      }
      await storage.setReviews(filtered);
    } catch { /* ignore */ }
  };

  const clearDraft = async () => {
    await saveDraft('');
    setDraftBody('');
  };

  const loadFromApi = async () => {
    setLoading(true);
    const response = await getCommentsByProduct(productId);
    if (response.success && response.data) {
      setComments(response.data.slice(0, 5));
    } else {
      showSnackbar(response.message, 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const openAddModal = () => {
    setEditingComment(null);
    setShowModal(true);
  };

  const openEditModal = (comment: Comment) => {
    setEditingComment(comment);
    setShowModal(true);
  };

  const handleSave = async (values: { body: string }) => {
    // Automatically use authenticated user's name and email
    const payload: CommentPayload = {
      name: user?.name || 'Anonymous',
      email: user?.email || '',
      body: values.body,
      postId: productId,
    };

    if (editingComment) {
      if (isRealtime) {
        const ok = await firestoreComments.update(String(editingComment.id), values);
        if (ok) {
          showSnackbar('Comment updated!', 'success');
        } else {
          // Fallback to REST API
          const res = await updateComment(Number(editingComment.id), payload);
          if (res.success) {
            showSnackbar(res.message, 'success');
            setComments(prev => prev.map(c => c.id === editingComment.id ? { ...c, ...values } : c));
          } else {
            showSnackbar(res.message, 'error');
          }
        }
      } else {
        const res = await updateComment(Number(editingComment.id), payload);
        if (res.success) {
          showSnackbar(res.message, 'success');
          setComments(prev => prev.map(c => c.id === editingComment.id ? { ...c, ...values } : c));
        } else {
          showSnackbar(res.message, 'error');
          return;
        }
      }
    } else {
      if (isRealtime) {
        // Try Realtime DB first for instant update
        const key = await realtimeComments.create(productId, payload);
        if (key) {
          showSnackbar('Comment posted!', 'success');
          await clearDraft();
        } else {
          // Fallback to Firestore
          const doc = await firestoreComments.create(payload);
          if (doc) {
            showSnackbar('Comment posted!', 'success');
            await clearDraft();
          } else {
            // Final fallback to REST API
            const res = await createComment(payload);
            if (res.success && res.data) {
              showSnackbar(res.message, 'success');
              setComments(prev => [res.data!, ...prev]);
              await clearDraft();
            } else {
              showSnackbar(res.message || 'Failed to post comment', 'error');
              return;
            }
          }
        }
      } else {
        const res = await createComment(payload);
        if (res.success && res.data) {
          showSnackbar(res.message, 'success');
          setComments(prev => [res.data!, ...prev]);
          await clearDraft();
        } else {
          showSnackbar(res.message || 'Failed to post comment', 'error');
          return;
        }
      }
    }

    setShowModal(false);
    setEditingComment(null);
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentCard}>
      <View style={styles.commentHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.commentName}>{item.name}</Text>
          <Text style={styles.commentEmail}>{item.email}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
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
        onDismiss={() => setSnackbar(s => ({ ...s, visible: false }))}
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            💬 Comments ({comments.length})
          </Text>
          {isRealtime && (
            <Text style={styles.liveBadge}>🔴 Live</Text>
          )}
        </View>
        <TouchableOpacity style={styles.addCommentButton} onPress={openAddModal} activeOpacity={0.7}>
          <Text style={styles.addCommentButtonText}>+ Add Comment</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
          <Button label="Add Comment" onPress={openAddModal} />
        </View>
      ) : (
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={item => String(item.id)}
          scrollEnabled={false}
        />
      )}

      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => { setShowModal(false); setEditingComment(null); }}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => { setShowModal(false); setEditingComment(null); }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  {editingComment ? 'Edit Comment' : 'Add Comment'}
                </Text>
                <View style={{ width: 30 }} />
              </View>

              <Formik
                initialValues={{
                  body: editingComment?.body || draftBody,
                }}
                enableReinitialize
                validationSchema={commentSchema}
                onSubmit={handleSave}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <>
                    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                      {/* Display authenticated user info */}
                      <View style={styles.userInfoBox}>
                        <Text style={styles.userLabel}>Posting as:</Text>
                        <Text style={styles.userName}>{user?.name || 'Anonymous'}</Text>
                        <Text style={styles.userEmail}>{user?.email}</Text>
                      </View>

                      <Input
                        label="Your Comment *"
                        placeholder="Share your thoughts (min. 10 characters)..."
                        value={values.body}
                        onChangeText={(text) => {
                          handleChange('body')(text);
                          if (!editingComment) saveDraft(text);
                        }}
                        onBlur={handleBlur('body')}
                        error={touched.body ? errors.body : undefined}
                        multiline
                        numberOfLines={5}
                        style={styles.textAreaInput}
                      />

                      {!editingComment && draftBody.length > 0 && values.body === draftBody && (
                        <Text style={styles.draftIndicator}>📝 Draft restored</Text>
                      )}
                    </ScrollView>

                    <View style={styles.modalFooter}>
                      <Button
                        label={isSubmitting ? 'Saving...' : (editingComment ? 'Update Comment' : 'Post Comment')}
                        onPress={() => handleSubmit()}
                      />
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: SIZES.lg, paddingHorizontal: SIZES.screenPadding },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SIZES.md },
  title: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  liveBadge: { fontSize: SIZES.fontSize.xs, color: '#e53e3e', marginTop: 2 },
  addCommentButton: { backgroundColor: COLORS.primary, paddingHorizontal: SIZES.md, paddingVertical: SIZES.sm, borderRadius: SIZES.borderRadius.md },
  addCommentButtonText: { color: COLORS.white, fontWeight: '600', fontSize: SIZES.fontSize.xs },
  loadingContainer: { paddingVertical: SIZES.lg, alignItems: 'center' },
  emptyContainer: { paddingVertical: SIZES.xl, alignItems: 'center' },
  emptyText: { fontSize: SIZES.fontSize.sm, color: COLORS.lightText, marginBottom: SIZES.md },
  commentCard: { backgroundColor: COLORS.lightGray, borderRadius: SIZES.borderRadius.md, padding: SIZES.md, marginBottom: SIZES.md, borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SIZES.sm },
  commentName: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.text, marginBottom: SIZES.xs },
  commentEmail: { fontSize: SIZES.fontSize.xs, color: COLORS.lightText },
  editButton: { backgroundColor: COLORS.white, paddingHorizontal: SIZES.sm, paddingVertical: SIZES.xs, borderRadius: SIZES.borderRadius.sm, borderWidth: 1, borderColor: COLORS.border },
  editButtonText: { fontSize: SIZES.fontSize.xs, fontWeight: '500', color: COLORS.text },
  commentBody: { fontSize: SIZES.fontSize.sm, color: COLORS.text, lineHeight: 18, marginTop: SIZES.sm },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.white, borderTopLeftRadius: SIZES.borderRadius.lg, borderTopRightRadius: SIZES.borderRadius.lg, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.lg, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalTitle: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  closeButton: { fontSize: 24, color: COLORS.text, fontWeight: '600' },
  formContainer: { paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.lg },
  textAreaInput: { minHeight: 100, textAlignVertical: 'top' },
  draftIndicator: { fontSize: SIZES.fontSize.xs, color: COLORS.primary, marginTop: -SIZES.md, marginBottom: SIZES.md },
  modalFooter: { paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
  },
  loginPromptText: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
    textAlign: 'center',
  },
  userInfoBox: {
    backgroundColor: COLORS.lightGray,
    padding: SIZES.lg,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  userLabel: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginBottom: SIZES.xs,
    fontWeight: '500',
  },
  userName: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  userEmail: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
});
