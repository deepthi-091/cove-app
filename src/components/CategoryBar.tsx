import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { Category } from '../types';
import { COLORS, SIZES } from '../constants';

interface CategoryBarProps {
  categories: Category[];
  selectedId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  categories,
  selectedId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          onPress={() => onSelectCategory(category.id)}
          style={[
            styles.categoryButton,
            selectedId === category.id && styles.active,
          ]}
        >
          <Text
            style={[
              styles.categoryText,
              selectedId === category.id && styles.activeText,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.lg,
  },
  content: {
    paddingHorizontal: SIZES.screenPadding,
  },
  categoryButton: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    marginRight: SIZES.md,
    borderRadius: SIZES.borderRadius.full,
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  active: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  activeText: {
    color: COLORS.white,
  },
});
