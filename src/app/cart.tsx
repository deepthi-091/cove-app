import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  LayoutAnimation,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRef, useCallback } from 'react';
import { router } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button, LoginBadge } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { removeFromCart, updateQuantity, clearCart } from '@/redux/cart/cartActions';

function animatedLayout() {
  LayoutAnimation.configureNext({
    duration: 250,
    create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    update: { type: LayoutAnimation.Types.spring, springDamping: 0.7 },
    delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
  });
}

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  const { items, totalPrice, totalItems } = useAppSelector(state => state.cart);

  // Animated value for the checkout button press effect
  const checkoutScale = useRef(new Animated.Value(1)).current;

  const animateCheckoutPress = useCallback(() => {
    Animated.sequence([
      Animated.spring(checkoutScale, { toValue: 0.95, useNativeDriver: true, speed: 50 }),
      Animated.spring(checkoutScale, { toValue: 1, useNativeDriver: true, speed: 20 }),
    ]).start(() => router.push('/checkout'));
  }, [checkoutScale]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <LoginBadge />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={styles.emptyText}>Login Required</Text>
          <Text style={styles.emptySubtext}>Please login to view your cart</Text>
          <Button label="Go to Login" onPress={() => router.replace('/login' as any)} />
        </View>
      </SafeAreaView>
    );
  }

  const handleRemove = (id: string) => {
    animatedLayout();
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemove(id);
    } else {
      animatedLayout();
      dispatch(updateQuantity(id, quantity));
    }
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          animatedLayout();
          dispatch(clearCart());
        },
      },
    ]);
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
            <Text style={styles.backButton}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <LoginBadge />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Add items to get started</Text>
          <Button label="Start Shopping" onPress={() => router.replace('/tabs' as any)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView testID="cartScreen" style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/tabs' as any)}>
          <Text style={styles.backButton}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({totalItems})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearButton}>Clear</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }) => (
          <Animated.View style={styles.cartItem}>
            <Image
              source={{ uri: item.image || 'https://via.placeholder.com/80' }}
              style={styles.itemImage}
            />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              {(item.color || item.size) && (
                <Text style={styles.itemVariant}>
                  {item.color && `Color: ${item.color}`}
                  {item.color && item.size && ' · '}
                  {item.size && `Size: ${item.size}`}
                </Text>
              )}
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.itemRight}>
              <TouchableOpacity testID={`removeButton-${index}`} onPress={() => handleRemove(item.id)}>
                <Text style={styles.removeButton}>🗑️</Text>
              </TouchableOpacity>
              <View style={styles.quantityControl}>
                <TouchableOpacity
                  onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>
                <Text testID={`quantity-${index}`} style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity
                  testID={`increaseQuantity-${index}`}
                  onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>${totalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{totalItems}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text testID="cartTotal" style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
          </View>
        </View>
        {/* Animated checkout button press effect */}
        <Animated.View style={{ transform: [{ scale: checkoutScale }] }}>
          <TouchableOpacity
            testID="checkoutButton"
            style={styles.checkoutButton}
            onPressIn={() => Animated.spring(checkoutScale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start()}
            onPressOut={animateCheckoutPress}
            activeOpacity={1}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
  backButton: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  headerTitle: { fontSize: SIZES.fontSize.lg, fontWeight: 'bold', color: COLORS.text },
  clearButton: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.primary },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SIZES.screenPadding },
  emptyIcon: { fontSize: 64, marginBottom: SIZES.xl },
  emptyText: { fontSize: SIZES.fontSize.lg, fontWeight: '600', color: COLORS.text, marginBottom: SIZES.sm },
  emptySubtext: { fontSize: SIZES.fontSize.sm, color: COLORS.lightText, marginBottom: SIZES.xl },
  listContent: { paddingHorizontal: SIZES.screenPadding, paddingVertical: SIZES.lg },
  cartItem: {
    flexDirection: 'row', paddingVertical: SIZES.lg,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  itemImage: { width: 80, height: 80, borderRadius: SIZES.borderRadius.md, backgroundColor: COLORS.lightGray, marginRight: SIZES.lg },
  itemInfo: { flex: 1 },
  itemName: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text, marginBottom: SIZES.xs },
  itemVariant: { fontSize: SIZES.fontSize.xs, color: COLORS.lightText, marginBottom: SIZES.xs },
  itemPrice: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.primary },
  itemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  removeButton: { fontSize: 18 },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border, borderRadius: SIZES.borderRadius.md, paddingHorizontal: SIZES.xs,
  },
  quantityButton: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { fontSize: SIZES.fontSize.base, fontWeight: '600', color: COLORS.text },
  quantity: { marginHorizontal: SIZES.sm, fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.text },
  footer: { paddingHorizontal: SIZES.screenPadding, paddingBottom: SIZES.xl, paddingTop: SIZES.lg, borderTopWidth: 1, borderTopColor: COLORS.border },
  summary: { marginBottom: SIZES.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SIZES.sm },
  summaryLabel: { fontSize: SIZES.fontSize.sm, color: COLORS.lightText },
  summaryValue: { fontSize: SIZES.fontSize.sm, fontWeight: '600', color: COLORS.text },
  totalRow: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: SIZES.md },
  totalLabel: { fontSize: SIZES.fontSize.base, fontWeight: 'bold', color: COLORS.text },
  totalValue: { fontSize: SIZES.fontSize.base, fontWeight: 'bold', color: COLORS.primary },
  checkoutButton: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.borderRadius.md,
    paddingVertical: SIZES.lg, alignItems: 'center',
  },
  checkoutButtonText: { color: COLORS.white, fontSize: SIZES.fontSize.base, fontWeight: '700' },
});
