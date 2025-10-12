import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface RequirementData {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  timeAgo: string;
  requirement: string;
  whatsappNumber?: string;
}

interface RequirementCardProps {
  requirement: RequirementData;
  onUserPress?: () => void;
  onWhatsAppPress?: () => void;
}

export default function RequirementCard({ 
  requirement, 
  onUserPress,
  onWhatsAppPress 
}: RequirementCardProps) {
  
  const handleWhatsAppPress = () => {
    if (onWhatsAppPress) {
      onWhatsAppPress();
    } else if (requirement.whatsappNumber) {
      const message = encodeURIComponent(`Hola, vi tu requerimiento: "${requirement.requirement}"`);
      Linking.openURL(`https://wa.me/${requirement.whatsappNumber}?text=${message}`);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={onUserPress}
        >
          <Image 
            source={{ uri: requirement.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.userText}>
            <Text style={styles.userName}>{requirement.userName}</Text>
            <Text style={styles.userHandle}>@{requirement.userHandle}</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.timeAgo}>{requirement.timeAgo}</Text>
      </View>
      
      <Text style={styles.requirement}>{requirement.requirement}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.whatsappButton}
          onPress={handleWhatsAppPress}
        >
          <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  userText: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'System',
  },
  userHandle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'System',
  },
  timeAgo: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'System',
  },
  requirement: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 12,
    fontFamily: 'System',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  whatsappButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

