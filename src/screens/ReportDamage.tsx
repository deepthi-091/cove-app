import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SIZES, STRINGS } from '../constants';
import { Button } from '../components';

export const ReportDamage: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Damage</Text>
        <View style={styles.space} />
      </View>

      <View style={styles.content}>
        <Text style={styles.step}>{STRINGS.report_damage_subtitle}</Text>
        <Text style={styles.instruction}>{STRINGS.report_damage_instruction}</Text>

        <View style={styles.cameraPlaceholder}>
          <View style={styles.frameBorder} />
          <Text style={styles.cameraIcon}>📸</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Photos</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>📁 Upload from library instead</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Button
          label="Take Photo"
          onPress={() => navigation.navigate('AddReview')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  backButton: {
    fontSize: SIZES.fontSize.xl,
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  space: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.xl,
    justifyContent: 'center',
  },
  step: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.lightText,
    marginBottom: SIZES.sm,
  },
  instruction: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xl,
  },
  cameraPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F0D8D0',
    borderRadius: SIZES.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.xl,
    position: 'relative',
    borderWidth: 2,
    borderColor: '#E0C0B0',
    borderStyle: 'dashed',
  },
  frameBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 2,
    borderColor: 'rgba(200, 150, 120, 0.3)',
    borderRadius: SIZES.borderRadius.lg,
    margin: 30,
  },
  cameraIcon: {
    fontSize: 80,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.md,
    marginBottom: SIZES.xl,
  },
  secondaryButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  uploadButton: {
    paddingVertical: SIZES.lg,
    alignItems: 'center',
  },
  uploadButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.lightText,
  },
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
});
