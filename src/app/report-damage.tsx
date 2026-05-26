import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { STRINGS } from '@/constants/strings';
import { Button } from '@/components';

export default function ReportDamage() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTakePhoto = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      alert('Failed to take photo');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFromLibrary = async () => {
    try {
      setLoading(true);
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert('Media library permission is required');
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
      alert('Failed to pick photo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!photoUri) {
      alert('Please capture or upload a photo');
      return;
    }
    alert(`Damage report submitted with photo`);
    router.replace('/tabs' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
          <Text style={styles.backButton}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Damage</Text>
        <View style={styles.space} />
      </View>

      <View style={styles.content}>
        <Text style={styles.step}>{STRINGS.report_damage_subtitle}</Text>
        <Text style={styles.instruction}>{STRINGS.report_damage_instruction}</Text>

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <View style={styles.frameBorder} />
            {loading ? (
              <ActivityIndicator size="large" color={COLORS.primary} />
            ) : (
              <Text style={styles.cameraIcon}>📸</Text>
            )}
          </View>
        )}

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleTakePhoto} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleUploadFromLibrary} disabled={loading}>
            <Text style={styles.secondaryButtonText}>Gallery</Text>
          </TouchableOpacity>
          {photoUri && (
            <TouchableOpacity style={styles.clearButton} onPress={() => setPhotoUri(null)}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          label={photoUri ? 'Submit Report' : 'Take Photo'}
          onPress={photoUri ? handleSubmit : handleTakePhoto}
        />
      </View>
    </SafeAreaView>
  );
}

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
  photoPreview: {
    width: '100%',
    height: 300,
    borderRadius: SIZES.borderRadius.lg,
    marginBottom: SIZES.xl,
  },
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  clearButton: {
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.borderRadius.md,
    borderWidth: 1,
    borderColor: '#E0C0B0',
  },
  clearButtonText: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
