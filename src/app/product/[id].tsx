import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS } from '@/constants/colors';

export default function ProductDetail() {
  const { id } = useLocalSearchParams();

  console.log('✅ ProductDetail rendered with ID:', id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: '600' }}>‹ Back</Text>
      </TouchableOpacity>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Product Detail</Text>
        <Text style={{ fontSize: 14 }}>ID: {id}</Text>
      </View>
    </SafeAreaView>
  );
}
