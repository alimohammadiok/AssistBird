// ChatAssistant.js
import React, { useState } from "react";
import { View, TextInput, ScrollView, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Divider, Drawer, Menu, PaperProvider , Button as PButton} from "react-native-paper";
import { Icon, MD3Colors } from 'react-native-paper';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import Config from 'react-native-config';


export default function ChatAssistant() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const apiKey = Config.API_KEY;
  const apiUrl = Config.API_URL;
console.log(apiKey);
  const translateText = async (text, targetLang = "es") => {
  try {
    console.log("the text comming to translae func:",text);
    const res = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    const data = await res.json();
    console.log("Translated:", data.translatedText);
    return data.translatedText;
  } catch (err) {
    console.error("Translation error:", err);
    return null;
  }
};

  const handleAsk = async () => {
  if (!query.trim()) return;
  setLoading(true);
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: query }]
          }
        ]
      }),
    });

    const data = await response.json();
    const res = data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response";
    setAnswer(data?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ No response");
  } catch (error) {
    console.error(error);
    setAnswer("⚠️ Network error");
  }
  setLoading(false);
};


  return (
    <View style={styles.container}>
       
      <ScrollView style={styles.answerBox}>
        <Text style={styles.answer}>{answer}</Text>
      </ScrollView>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Ask about Medicare, TFN, housing..."
      />
      <View style={styles.buttonContainer}>
      <TouchableOpacity
      onPress={handleAsk} disabled={loading}
      style={styles.button} >
    <Text style={styles.text}>{loading ? "Loading..." : "Ask"}</Text>
       

      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f6f8fa",
    justifyContent: "flex-end",
  },
  buttonContainer: {
   
    justifyContent: "center",
    alignItems: "center",
  },
   button: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    padding: 14,
    marginVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 2,
  },
  answerBox: {
    flex: 1,
    marginBottom: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  answer: {
    fontSize: 17,
    lineHeight: 24,
    color: "#222",
  },
});
