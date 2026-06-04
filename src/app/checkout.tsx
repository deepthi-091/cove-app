import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button } from '@/components';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { clearCart } from '@/redux/cart/cartActions';
import { api } from '@/utils/api';

export default function Checkout() {
  const dispatch = useAppDispatch();
  const { items, totalPrice } = useAppSelector(state => state.cart);
  const [selectedAddress, setSelectedAddress] = useState('0');
  const [selectedPayment, setSelectedPayment] = useState('0');
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [addresses, setAddresses] = useState([
    { id: '0', title: 'Home', address: '123 Main St, New York, NY 10001' },
    { id: '1', title: 'Office', address: '456 Business Ave, New York, NY 10002' },
  ]);

  const handleDetectLocation = async () => {
    try {
      setDetectingLocation(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Error', 'Location permission required');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const geo = reverseGeocode[0];
        const parts = [];
        if (geo.street) parts.push(geo.street);
        if (geo.city) parts.push(geo.city);
        if (geo.postalCode) parts.push(geo.postalCode);
        const detectedAddress = parts.join(', ') || 'Current location';

        const newAddressId = Date.now().toString();
        const newAddresses = [
          ...addresses,
          { id: newAddressId, title: 'Current Location', address: detectedAddress },
        ];
        setAddresses(newAddresses);
        setSelectedAddress(newAddressId);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to detect location');
    } finally {
      setDetectingLocation(false);
    }
  };

  const payments = [
    { id: '0', type: 'card', brand: 'Visa', last4: '4421', isDefault: true },
    { id: '1', type: 'card', brand: 'Mastercard', last4: '5555', isDefault: false },
  ];

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert('Error', 'Please select delivery address and payment method');
      return;
    }

    setLoading(true);
    try {
      const order = await api.createOrder(items);
      dispatch(clearCart());
      setOrderId(order.id);
      setOrderConfirmed(true);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (orderConfirmed) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>✅</Text>
          <Text style={styles.confirmTitle}>Order Confirmed!</Text>
          <Text style={styles.confirmText}>Thank you for your order</Text>
          <View style={styles.orderInfoBox}>
            <Text style={styles.orderLabel}>Order Number</Text>
            <Text testID="orderNumber" style={styles.orderNumber}>{orderId}</Text>
            <Text style={styles.orderSubtext}>Save this for your records</Text>
          </View>
          <Button
            label="Continue Shopping"
            onPress={() => router.replace('/tabs' as any)}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            label="Continue Shopping"
            onPress={() => router.replace('/tabs' as any)}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/cart')}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.orderSummary}>
            <Text style={styles.summaryText}>Items: {items.length}</Text>
            <Text style={styles.summaryText}>Subtotal: ${totalPrice.toFixed(2)}</Text>
            <Text style={styles.summaryText}>Delivery: $5.00</Text>
            <View style={styles.divider} />
            <Text style={styles.totalText}>
              Total: ${(totalPrice + 5).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={handleDetectLocation} disabled={detectingLocation}>
              <Text style={styles.addLink}>
                {detectingLocation ? '📍 Detecting...' : '📍 Detect'}
              </Text>
            </TouchableOpacity>
          </View>
          {addresses.map((addr) => (
            <TouchableOpacity
              key={addr.id}
              style={[
                styles.addressCard,
                selectedAddress === addr.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedAddress(addr.id)}
            >
              <View style={styles.radioButton}>
                {selectedAddress === addr.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressTitle}>{addr.title}</Text>
                <Text style={styles.addressText}>{addr.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <TouchableOpacity>
              <Text style={styles.addLink}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          {payments.map((payment) => (
            <TouchableOpacity
              key={payment.id}
              style={[
                styles.paymentCard,
                selectedPayment === payment.id && styles.selectedCard,
              ]}
              onPress={() => setSelectedPayment(payment.id)}
            >
              <View style={styles.radioButton}>
                {selectedPayment === payment.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <View style={styles.paymentContent}>
                <Text style={styles.paymentBrand}>{payment.brand}</Text>
                <Text style={styles.paymentText}>•••• {payment.last4}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoInput}>
            <Text style={styles.promoPlaceholder}>Enter promo code</Text>
            <TouchableOpacity>
              <Text style={styles.applyLink}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          label={loading ? 'Processing...' : 'Place Order'}
          onPress={handlePlaceOrder}
          disabled={loading}
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
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerRight: {
    width: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.screenPadding,
  },
  section: {
    marginVertical: SIZES.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  sectionTitle: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  addLink: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  orderSummary: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderRadius: SIZES.borderRadius.md,
  },
  summaryText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SIZES.sm,
  },
  totalText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.md,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: '#F0F8FF',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
    marginTop: SIZES.sm,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  addressContent: {
    flex: 1,
  },
  addressTitle: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  addressText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  paymentContent: {
    flex: 1,
  },
  paymentBrand: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  paymentText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  promoInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius.md,
  },
  promoPlaceholder: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  applyLink: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SIZES.md,
  },
  emptyText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  confirmTitle: {
    fontSize: SIZES.fontSize['2xl'],
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.md,
  },
  confirmText: {
    fontSize: SIZES.fontSize.base,
    color: COLORS.lightText,
    marginBottom: SIZES.xl,
  },
  orderInfoBox: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.xl,
    borderRadius: SIZES.borderRadius.md,
    marginBottom: SIZES.xl,
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: SIZES.xs,
  },
  orderNumber: {
    fontSize: SIZES.fontSize.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  orderSubtext: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
  },
});
