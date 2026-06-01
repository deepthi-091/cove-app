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

interface FormErrors {
  name?: string;
  email?: string;
  username?: string;
  phone?: string;
  website?: string;
  company?: string;
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
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

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
    try {
      const response = await getUsers();

      if (response.success && response.data) {
        setUsers(response.data as User[]);
      } else {
        const errorMsg = response.message || 'Failed to load users';
        showSnackbar(errorMsg, 'error');
        console.error('Error loading users:', errorMsg);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      showSnackbar(
        error instanceof Error ? error.message : 'Failed to load users. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
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
    setFormErrors({});
  };

  // Validation functions
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone: string): boolean => {
    // Simple phone validation: at least 10 digits
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const isValidURL = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    }

    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.trim().length > 30) {
      errors.username = 'Username must not exceed 30 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    } else if (formData.email.trim().length > 100) {
      errors.email = 'Email must not exceed 100 characters';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && formData.phone.trim()) {
      if (!isValidPhone(formData.phone)) {
        errors.phone = 'Phone must contain at least 10 digits';
      }
    }

    // Website validation (optional but if provided, must be valid)
    if (formData.website && formData.website.trim()) {
      if (!isValidURL(formData.website)) {
        errors.website = 'Please enter a valid website URL';
      }
    }

    // Company name validation (optional but if provided, max length)
    if (formData.company?.name && formData.company.name.length > 100) {
      errors.company = 'Company name must not exceed 100 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    // Validate form
    if (!validateForm()) {
      showSnackbar('Please fix the errors in the form', 'error');
      return;
    }

    setSubmitting(true);

    try {
      if (editingUser) {
        // Update user
        const response = await updateUser(Number(editingUser.id), formData);

        if (response.success) {
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...u, ...formData } : u
            )
          );
          setShowModal(false);
          resetForm();
          setTimeout(() => showSnackbar('User updated successfully', 'success'), 350);
        } else {
          showSnackbar(response.message || 'Failed to update user', 'error');
        }
      } else {
        // Create user
        // Check for duplicate email
        if (users.some(u => u.email.toLowerCase() === formData.email.toLowerCase())) {
          setFormErrors({ email: 'A user with this email already exists' });
          showSnackbar('Email already exists', 'error');
          return;
        }

        const response = await createUser(formData);

        if (response.success && response.data) {
          setUsers([...users, response.data as User]);
          setShowModal(false);
          resetForm();
          setTimeout(() => showSnackbar('User added successfully', 'success'), 350);
        } else {
          const errorMsg = response.message || 'Failed to add user';
          if (errorMsg.toLowerCase().includes('email')) {
            setFormErrors({ email: errorMsg });
          }
          showSnackbar(errorMsg, 'error');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showSnackbar(
        error instanceof Error ? error.message : 'An error occurred while saving',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const response = await deleteUser(Number(user.id));
              if (response.success) {
                setUsers(users.filter((u) => u.id !== user.id));
                showSnackbar('User deleted successfully', 'success');
              } else {
                const errorMsg = response.message || 'Failed to delete user';
                showSnackbar(errorMsg, 'error');
                console.error('Error deleting user:', errorMsg);
              }
            } catch (error) {
              console.error('Error deleting user:', error);
              showSnackbar(
                error instanceof Error ? error.message : 'Failed to delete user',
                'error'
              );
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
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text });
                  if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                }}
              />
              {formErrors.name && <Text style={styles.errorText}>{formErrors.name}</Text>}

              <Text style={styles.fieldLabel}>Username *</Text>
              <Input
                placeholder="Enter username"
                value={formData.username}
                onChangeText={(text) => {
                  setFormData({ ...formData, username: text });
                  if (formErrors.username) setFormErrors({ ...formErrors, username: undefined });
                }}
              />
              {formErrors.username && <Text style={styles.errorText}>{formErrors.username}</Text>}

              <Text style={styles.fieldLabel}>Email *</Text>
              <Input
                placeholder="Enter email"
                value={formData.email}
                keyboardType="email-address"
                onChangeText={(text) => {
                  setFormData({ ...formData, email: text });
                  if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                }}
              />
              {formErrors.email && <Text style={styles.errorText}>{formErrors.email}</Text>}

              <Text style={styles.fieldLabel}>Phone</Text>
              <Input
                placeholder="Enter phone number"
                value={formData.phone}
                keyboardType="phone-pad"
                onChangeText={(text) => {
                  setFormData({ ...formData, phone: text });
                  if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                }}
              />
              {formErrors.phone && <Text style={styles.errorText}>{formErrors.phone}</Text>}

              <Text style={styles.fieldLabel}>Website</Text>
              <Input
                placeholder="Enter website"
                value={formData.website}
                onChangeText={(text) => {
                  setFormData({ ...formData, website: text });
                  if (formErrors.website) setFormErrors({ ...formErrors, website: undefined });
                }}
              />
              {formErrors.website && <Text style={styles.errorText}>{formErrors.website}</Text>}

              <Text style={styles.fieldLabel}>Company Name</Text>
              <Input
                placeholder="Enter company name"
                value={formData.company?.name}
                onChangeText={(text) => {
                  setFormData({
                    ...formData,
                    company: { name: text },
                  });
                  if (formErrors.company) setFormErrors({ ...formErrors, company: undefined });
                }}
              />
              {formErrors.company && <Text style={styles.errorText}>{formErrors.company}</Text>}

              <Text style={styles.requiredNote}>* Required fields</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                label={submitting ? 'Saving...' : (editingUser ? 'Update User' : 'Add User')}
                onPress={handleSaveUser}
                disabled={submitting}
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
  errorText: {
    fontSize: SIZES.fontSize.xs,
    color: COLORS.error,
    marginTop: SIZES.xs,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  modalFooter: {
    paddingHorizontal: SIZES.screenPadding,
    paddingVertical: SIZES.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
