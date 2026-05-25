import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants';

interface RatingStarsProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  onRatingChange,
  interactive = false,
  size = 'md',
}) => {
  const stars = [1, 2, 3, 4, 5];
  const starSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

  return (
    <View style={styles.container}>
      {stars.map((star) => (
        <Text
          key={star}
          onPress={() => interactive && onRatingChange?.(star)}
          style={{
            fontSize: starSize,
            marginHorizontal: 4,
            color: star <= rating ? COLORS.primary : COLORS.border,
          }}
        >
          ★
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
