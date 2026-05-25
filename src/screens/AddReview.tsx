import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';
import { Button, RatingStars } from '../components';

interface ReviewTag {
  id: string;
  label: string;
}

const REVIEW_TAGS: ReviewTag[] = [
  { id: '1', label: 'Quality' },
  { id: '2', label: 'Good value' },
  { id: '3', label: 'As pictured' },
  { id: '4', label: 'Quick delivery' },
];

export const AddReview: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const product = route.params?.product;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.step}>STEP 2 OF 3</Text>
        </View>

        <View style={styles.productInfo}>
          {product?.image && (
            <Image source={{ uri: product.image }} style={styles.productImage} />
          )}
          <View>
            <Text style={styles.productName}>{product?.name}</Text>
            <Text style={styles.orderInfo}>ORDER #C-4421</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{STRINGS.review_title}</Text>
          <Text style={styles.sectionSubtitle}>{STRINGS.review_subtitle}</Text>
          <RatingStars
            rating={rating}
            onRatingChange={setRating}
            interactive
            size="lg"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{STRINGS.review_your_review}</Text>
          <TextInput
            placeholder={STRINGS.review_placeholder}
            placeholderTextColor={COLORS.lightText}
            multiline
            numberOfLines={4}
            value={reviewText}
            onChangeText={setReviewText}
            style={styles.reviewInput}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>WHAT STOOD OUT?</Text>
          <View style={styles.tagsContainer}>
            {REVIEW_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                onPress={() => toggleTag(tag.id)}
                style={[
                  styles.tag,
                  selectedTags.includes(tag.id) && styles.activeTag,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag.id) && styles.activeTagText,
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADD PHOTOS</Text>
          <View style={styles.photoGrid}>
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.photo} />
            ))}
            <TouchableOpacity style={styles.addPhotoButton}>
              <Text style={styles.addPhotoText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            label={STRINGS.review_post}
            onPress={() => navigation.goBack()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  step: {
    fontSize: SIZES.fontSize.xs,
    fontWeight: '600',
    color: COLORS.lightText,
  },
  productInfo: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: SIZES.borderRadius.md,
    marginRight: SIZES.lg,
    backgroundColor: COLORS.lightGray,
  },
  productName: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  orderInfo: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginTop: SIZES.xs,
  },
  section: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  sectionSubtitle: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: SIZES.lg,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    padding: SIZES.lg,
    fontSize: SIZES.fontSize.base,
    color: COLORS.text,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.md,
  },
  tag: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: COLORS.white,
  },
  activeTag: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tagText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeTagText: {
    color: COLORS.white,
  },
  photoGrid: {
    flexDirection: 'row',
    gap: SIZES.md,
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: SIZES.borderRadius.md,
    backgroundColor: COLORS.lightGray,
  },
  addPhotoButton: {
    width: 70,
    height: 70,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: 32,
    color: COLORS.lightText,
  },
  buttonContainer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
  },
});
