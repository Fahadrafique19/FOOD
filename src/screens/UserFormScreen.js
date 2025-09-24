import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../App';
import Toast from 'react-native-toast-message';

const formJSON = {
  title: 'User Registration Form',
  fields: [
    { id: 'first_name', label: 'First Name', type: 'text', required: true },
    { id: 'age', label: 'Age', type: 'number' },
    {
      id: 'gender',
      label: 'Gender',
      type: 'radio',
      options: ['Male', 'Female', 'Other'],
    },
    {
      id: 'hobbies',
      label: 'Hobbies',
      type: 'checkbox',
      options: ['Reading', 'Sports', 'Music', 'Traveling'],
    },
    {
      id: 'country',
      label: 'Country',
      type: 'dropdown',
      options: ['USA', 'Canada', 'UK', 'India', 'Australia'],
    },
    { id: 'dob', label: 'Date of Birth', type: 'date' },
    { id: 'bio', label: 'Short Bio', type: 'textarea' },
    { id: 'submit', label: 'Save', type: 'button' },
  ],
};

export default function UserFormScreen({ navigation, route }) {
  const { colors } = useContext(ThemeContext);
  const initialState = {};
  formJSON.fields.forEach(f => {
    initialState[f.id] = f.type === 'checkbox' ? [] : '';
  });

  const [formData, setFormData] = useState(
    route.params?.editUser || initialState,
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const handleChange = (id, value) =>
    setFormData(prev => ({ ...prev, [id]: value }));

  const handleSubmit = async () => {
    try {
      for (let field of formJSON.fields) {
        if (field.required && !formData[field.id]) {
          Toast.show({
            type: 'error',
            text1: `${field.label} is required`,
          });
          return;
        }
      }

      let users = await AsyncStorage.getItem('users');
      users = users ? JSON.parse(users) : [];

      if (route.params?.index != null) {
        users[route.params.index] = formData;
        Toast.show({
          type: 'success',
          text1: 'User updated successfully ',
        });
      } else {
        users.push(formData);
        Toast.show({
          type: 'success',
          text1: 'User saved successfully ',
        });
      }

      await AsyncStorage.setItem('users', JSON.stringify(users));

      setTimeout(() => {
        navigation.goBack();
      }, 1200);
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: err.message,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={{ marginBottom: 20, paddingTop: 20 }}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>

        {formJSON.fields.map(field => {
          if (['text', 'number', 'textarea'].includes(field.type)) {
            return (
              <View key={field.id} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: '600',
                    marginBottom: 5,
                    color: colors.text,
                  }}
                >
                  {field.label}
                  {field.required ? '*' : ''}
                </Text>
                <TextInput
                  placeholder={field.placeholder || ''}
                  placeholderTextColor={colors.placeholder || '#888'}
                  keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                  multiline={field.type === 'textarea'}
                  value={formData[field.id]}
                  onChangeText={text => handleChange(field.id, text)}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 10,
                    color: colors.text,
                    backgroundColor:
                      colors.inputBackground || colors.background,
                  }}
                />
              </View>
            );
          }

          if (field.type === 'radio' || field.type === 'dropdown') {
            return (
              <View key={field.id} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: '600',
                    marginBottom: 5,
                    color: colors.text,
                  }}
                >
                  {field.label}
                </Text>
                {field.options.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => handleChange(field.id, opt)}
                  >
                    <Text
                      style={{
                        padding: 5,
                        color:
                          formData[field.id] === opt ? 'green' : colors.text,
                      }}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }

          if (field.type === 'checkbox') {
            return (
              <View key={field.id} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: '600',
                    marginBottom: 5,
                    color: colors.text,
                  }}
                >
                  {field.label}
                </Text>
                {field.options.map(opt => (
                  <View
                    key={opt}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}
                  >
                    <Switch
                      trackColor={{ false: '#ccc', true: '#FFD600' }}
                      thumbColor={
                        formData[field.id].includes(opt) ? '#2f3640' : '#f4f3f4'
                      }
                      value={formData[field.id].includes(opt)}
                      onValueChange={val => {
                        let arr = [...formData[field.id]];
                        val
                          ? arr.push(opt)
                          : (arr = arr.filter(i => i !== opt));
                        handleChange(field.id, arr);
                      }}
                    />
                    <Text style={{ marginLeft: 8, color: colors.text }}>
                      {opt}
                    </Text>
                  </View>
                ))}
              </View>
            );
          }

          if (field.type === 'date') {
            return (
              <View key={field.id} style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontWeight: '600',
                    marginBottom: 5,
                    color: colors.text,
                  }}
                >
                  {field.label}
                </Text>
                <TouchableOpacity
                  onPress={() => setDatePickerVisible(true)}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 8,
                    padding: 10,
                    backgroundColor:
                      colors.inputBackground || colors.background,
                  }}
                >
                  <Text style={{ color: colors.text }}>
                    {formData[field.id]
                      ? new Date(formData[field.id]).toDateString()
                      : 'Select Date'}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={date => {
                    handleChange(field.id, date.toISOString());
                    setDatePickerVisible(false);
                  }}
                  onCancel={() => setDatePickerVisible(false)}
                />
              </View>
            );
          }

          if (field.type === 'button') {
            return (
              <TouchableOpacity
                key={field.id}
                onPress={handleSubmit}
                style={{
                  backgroundColor: colors.buttonBackground || '#FFD600',
                  padding: 15,
                  borderRadius: 8,
                  alignItems: 'center',
                  marginVertical: 10,
                }}
              >
                <Text style={{ color: colors.buttonText || '#000' }}>
                  {field.label}
                </Text>
              </TouchableOpacity>
            );
          }

          return null;
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 50 },
  backButton: { marginBottom: 20, paddingTop: 20 },
  fieldContainer: { marginBottom: 20 },
  label: { fontWeight: '600', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  submitButton: {
    backgroundColor: '#FFD600',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
});
