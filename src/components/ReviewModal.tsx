import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button, Snackbar } from '@/components';
import { storage } from '@/utils/storage';
import type { Review } from '@/types';

interface ReviewModalProps {
  productId: string;
  visible: boolean;
  onClose: () => void;
  onSubmit?: (review: Review) => void;
}

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ productId, visible, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const resetForm = () => {
    setRating(5);
    setReviewText('');
    setPhotoUri(null);
  };

  const handleAddPhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        showSnackbar('Camera roll permission required', 'error');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      showSnackbar('Failed to pick image', 'error');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUri(null);
  };

  const handleSubmit = async () => {
    if (reviewText.trim().length < 5) {
      showSnackbar('Review must be at least 5 characters', 'error');
      return;
    }

    try {
      setLoading(true);
      const review: Review = {
        id: Date.now().toString(),
        userId: 'guest',
        productId,
        rating,
        text: reviewText,
        images: photoUri ? [photoUri] : undefined,
        date: new Date().toISOString(),
      };

      await storage.addReview(review);
      showSnackbar('Review submitted successfully!', 'success');

      setTimeout(() => {
        if (onSubmit) onSubmit(review);
        onClose();
        resetForm();
      }, 500);
    } catch (error) {
      showSnackbar('Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Write a Review</Text>
              <View style={{ width: 30 }} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Text style={styles.star}>{star <= rating ? '⭐' : '☆'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>{rating} / 5 stars</Text>

              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={styles.reviewInput}
                placeholder="Share your thoughts about this product..."
                placeholderTextColor={COLORS.lightText}
                multiline
                numberOfLines={5}
                value={reviewText}
                onChangeText={setReviewText}
                editable={!loading}
              />

              <Text style={styles.label}>Add Photo (Optional)</Text>
              {photoUri ? (
                <View style={styles.photoPreviewContainer}>
                  <Image source={{ uri: photoUri }} style={styles.photoPreview} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={handleRemovePhoto}
                    disabled={loading}
                  >
                    <Text style={styles.removePhotoText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addPhotoButton}
                  onPress={handleAddPhoto}
                  disabled={loading}
                >
                  <Text style={styles.addPhotoText}>📷 Add Photo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View style={styles.footer}>
              <Button
                label={loading ? 'Submitting...' : 'Submit Review'}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: SIZES.borderRadius.lg,
    borderTopRightRadius: SIZES.borderRadius.lg,
    maxHeight: '90%',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  label: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.md,
    marginTop: SIZES.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: SIZES.lg,
    marginBottom: SIZES.md,
  },
  star: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: SIZES.xl,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
    textAlignVertical: 'top',
    marginBottom: SIZES.lg,
  },
  addPhotoButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: SIZES.borderRadius.md,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  addPhotoText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.primary,
  },
  photoPreviewContainer: {
    marginBottom: SIZES.xl,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.md,
  },
  removePhotoButton: {
    backgroundColor: COLORS.lightGray,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.borderRadius.md,
    alignItems: 'center',
  },
  removePhotoText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
