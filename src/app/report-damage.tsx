import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button, Input } from '@/components';

const DAMAGE_CATEGORIES = [
  { id: 'structural', label: '🏚️ Structural' },
  { id: 'water', label: '💧 Water Damage' },
  { id: 'electrical', label: '⚡ Electrical' },
  { id: 'cosmetic', label: '🎨 Cosmetic' },
  { id: 'mechanical', label: '⚙️ Mechanical' },
  { id: 'other', label: '📦 Other' },
];

const schema = Yup.object({
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),
  category: Yup.string().required('Please select a damage category'),
});

type FormValues = {
  description: string;
  category: string;
};

export default function ReportDamage() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { description: '', category: '' },
  });

  const handleTakePhoto = async () => {
    setPhotoError('');
    setPhotoLoading(true);
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        setPhotoError('Camera permission is required');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch {
      setPhotoError('Failed to open camera');
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleUploadFromLibrary = async () => {
    setPhotoError('');
    setPhotoLoading(true);
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        setPhotoError('Media library permission is required');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });
      if (!result.canceled) setPhotoUri(result.assets[0].uri);
    } catch {
      setPhotoError('Failed to open gallery');
    } finally {
      setPhotoLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (!photoUri) {
      setPhotoError('Please add a photo of the damage');
      return;
    }
    // Simulate submission — replace with actual API call
    await new Promise(r => setTimeout(r, 800));
    alert(`Report submitted!\n\nCategory: ${values.category}\nDescription: ${values.description}`);
    router.replace('/tabs' as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
            <Text style={styles.backButton}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report Damage</Text>
          <View style={styles.space} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.step}>Step 1 of 2 — Add Photo</Text>
          <Text style={styles.instruction}>Take or upload a clear photo of the damage</Text>

          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <View style={styles.frameBorder} />
              {photoLoading ? (
                <ActivityIndicator size="large" color={COLORS.primary} />
              ) : (
                <Text style={styles.cameraIcon}>📸</Text>
              )}
            </View>
          )}
          {!!photoError && <Text style={styles.errorText}>{photoError}</Text>}

          <View style={styles.photoButtonGroup}>
            <TouchableOpacity style={styles.photoBtn} onPress={handleTakePhoto} disabled={photoLoading}>
              <Text style={styles.photoBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={handleUploadFromLibrary} disabled={photoLoading}>
              <Text style={styles.photoBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
            {photoUri && (
              <TouchableOpacity style={styles.clearBtn} onPress={() => setPhotoUri(null)}>
                <Text style={styles.clearBtnText}>✕ Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.step}>Step 2 of 2 — Describe the Damage</Text>

          {/* Category picker */}
          <Controller
            control={control}
            name="category"
            render={({ field: { value, onChange } }) => (
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Damage Category *</Text>
                <View style={styles.categoryGrid}>
                  {DAMAGE_CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, value === cat.id && styles.categoryChipSelected]}
                      onPress={() => onChange(cat.id)}
                    >
                      <Text style={[styles.categoryChipText, value === cat.id && styles.categoryChipTextSelected]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.category && <Text style={styles.errorText}>{errors.category.message}</Text>}
              </View>
            )}
          />

          {/* Description */}
          <Controller
            control={control}
            name="description"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Description *"
                placeholder="Describe the damage in detail (min. 20 characters)..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.description?.message}
                multiline
                numberOfLines={5}
                style={styles.textArea}
              />
            )}
          />

          <View style={styles.submitArea}>
            <Button
              label={isSubmitting ? 'Submitting...' : 'Submit Report'}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.lg,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backButton: { fontSize: SIZES.fontSize.xl, color: COLORS.text },
  headerTitle: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  space: { width: 24 },
  scrollContent: { paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.xl },
  step: { fontSize: SIZES.fontSize.xs, fontWeight: '700', color: COLORS.primary, marginBottom: SIZES.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  instruction: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text, marginBottom: SIZES.lg },
  cameraPlaceholder: {
    width: '100%', aspectRatio: 4 / 3, backgroundColor: '#F0D8D0',
    borderRadius: SIZES.borderRadius.lg, justifyContent: 'center', alignItems: 'center',
    marginBottom: SIZES.md, borderWidth: 2, borderColor: '#E0C0B0', borderStyle: 'dashed',
  },
  frameBorder: { ...StyleSheet.absoluteFill, borderWidth: 2, borderColor: 'rgba(200, 150, 120, 0.3)', borderRadius: SIZES.borderRadius.lg, margin: 30 },
  cameraIcon: { fontSize: 64 },
  photoPreview: { width: '100%', height: 240, borderRadius: SIZES.borderRadius.lg, marginBottom: SIZES.md },
  photoButtonGroup: { flexDirection: 'row', gap: SIZES.md, marginBottom: SIZES.lg },
  photoBtn: { flex: 1, paddingVertical: SIZES.md, backgroundColor: COLORS.lightGray, borderRadius: SIZES.borderRadius.md, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  photoBtnText: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.text },
  clearBtn: { paddingVertical: SIZES.md, paddingHorizontal: SIZES.lg, backgroundColor: COLORS.lightGray, borderRadius: SIZES.borderRadius.md, borderWidth: 1, borderColor: '#E0C0B0', alignItems: 'center' },
  clearBtnText: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.primary },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SIZES.xl },
  field: { marginBottom: SIZES.lg },
  fieldLabel: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SIZES.md },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SIZES.sm },
  categoryChip: { paddingVertical: SIZES.sm, paddingHorizontal: SIZES.md, borderRadius: SIZES.borderRadius.lg, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  categoryChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryChipText: { fontSize: SIZES.fontSize.sm, color: COLORS.text, fontWeight: '500' },
  categoryChipTextSelected: { color: COLORS.white, fontWeight: '600' },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  errorText: { fontSize: SIZES.fontSize.xs, color: '#e53e3e', marginTop: SIZES.xs, marginBottom: SIZES.sm },
  submitArea: { marginTop: SIZES.md, marginBottom: SIZES.xxxl },
});
