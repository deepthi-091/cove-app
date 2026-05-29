import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { COLORS } from '@/constants/colors';
import { SIZES } from '@/constants/sizes';
import { Button, Input, Snackbar, LoginBadge } from '@/components';
import { getUsers, createUser, updateUser, deleteUser, UserPayload } from '@/api/users/usersApi';
import { User } from '@/types';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Form state
  const [formData, setFormData] = useState<UserPayload>({
    name: '',
    email: '',
    username: '',
    phone: '',
    website: '',
    company: { name: '' },
  });

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const loadUsers = async () => {
    setLoading(true);
    const response = await getUsers();

    if (response.success && response.data) {
      setUsers(response.data as User[]);
    } else {
      showSnackbar(response.message, 'error');
    }
    setLoading(false);
  };

  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      username: '',
      phone: '',
      website: '',
      company: { name: '' },
    });
    setEditingUser(null);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      username: user.username || '',
      phone: user.phone || '',
      website: user.website || '',
      company: user.company || { name: '' },
    });
    setShowModal(true);
  };

  const handleSaveUser = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    if (editingUser) {
      // Update user
      const response = await updateUser(Number(editingUser.id), formData);
      setShowModal(false);
      if (response.success) {
        setUsers(
          users.map((u) =>
            u.id === editingUser.id ? { ...u, ...formData } : u
          )
        );
        setTimeout(() => showSnackbar(response.message, 'success'), 350);
      } else {
        setTimeout(() => showSnackbar(response.message, 'error'), 350);
      }
    } else {
      // Create user
      const response = await createUser(formData);
      setShowModal(false);
      if (response.success && response.data) {
        setUsers([...users, response.data as User]);
        setTimeout(() => showSnackbar(response.message, 'success'), 350);
      } else {
        setTimeout(() => showSnackbar(response.message, 'error'), 350);
      }
    }
    resetForm();
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}?`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            const response = await deleteUser(Number(user.id));
            if (response.success) {
              showSnackbar('User deleted successfully', 'success');
              setUsers(users.filter((u) => u.id !== user.id));
            } else {
              showSnackbar(response.message, 'error');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name: string): string => {
    const colors = [
      '#FF6B5B', // primary
      '#FF8C42',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
    ];
    const hash = name.charCodeAt(0) + name.length;
    return colors[hash % colors.length];
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View
        style={[
          styles.avatarCircle,
          { backgroundColor: getColorFromName(item.name) },
        ]}
      >
        <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userUsername}>@{item.username || 'N/A'}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        {item.phone && <Text style={styles.userDetail}>📱 {item.phone}</Text>}
        {item.company?.name && (
          <Text style={styles.userDetail}>🏢 {item.company.name}</Text>
        )}
      </View>
      <View style={styles.userActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteUser(item)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Users</Text>
          <View style={styles.headerStats}>
            <Text style={styles.statsText}>{users.length} users</Text>
            <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>
        <LoginBadge />
      </View>

      <FlatList
        data={users}
        renderItem={renderUserCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.1}
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingUser ? 'Edit User' : 'Add New User'}
              </Text>
              <View style={{ width: 30 }} />
            </View>

            <ScrollView
              style={styles.formContainer}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.fieldLabel}>Name *</Text>
              <Input
                placeholder="Enter user name"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
              />

              <Text style={styles.fieldLabel}>Username *</Text>
              <Input
                placeholder="Enter username"
                value={formData.username}
                onChangeText={(text) =>
                  setFormData({ ...formData, username: text })
                }
              />

              <Text style={styles.fieldLabel}>Email *</Text>
              <Input
                placeholder="Enter email"
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />

              <Text style={styles.fieldLabel}>Phone</Text>
              <Input
                placeholder="Enter phone number"
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) =>
                  setFormData({ ...formData, phone: text })
                }
              />

              <Text style={styles.fieldLabel}>Website</Text>
              <Input
                placeholder="Enter website"
                value={formData.website}
                onChangeText={(text) =>
                  setFormData({ ...formData, website: text })
                }
              />

              <Text style={styles.fieldLabel}>Company Name</Text>
              <Input
                placeholder="Enter company name"
                value={formData.company?.name}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    company: { name: text },
                  })
                }
              />

              <Text style={styles.requiredNote}>* Required fields</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                label={editingUser ? 'Update User' : 'Add User'}
                onPress={handleSaveUser}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.md,
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
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
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  statsText: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.borderRadius.md,
  },
  addButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: SIZES.fontSize.sm,
  },
  listContent: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.md,
  },
  userCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius.md,
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.lg,
  },
  avatarText: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '700',
    color: COLORS.white,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: SIZES.fontSize.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  userUsername: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.primary,
    fontWeight: '500',
    marginBottom: SIZES.xs,
  },
  userEmail: {
    fontSize: SIZES.fontSize.sm,
    color: COLORS.lightText,
    marginBottom: SIZES.xs,
  },
  userDetail: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginTop: SIZES.xs,
  },
  userActions: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#FFF3E0',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
  },
  actionButtonText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: SIZES.fontSize.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  closeButton: {
    fontSize: 24,
    color: COLORS.text,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
  },
  fieldLabel: {
    fontSize: SIZES.fontSize.sm,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: SIZES.sm,
    marginTop: SIZES.md,
  },
  requiredNote: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.lightText,
    marginTop: SIZES.lg,
    fontStyle: 'italic',
  },
  modalFooter: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
