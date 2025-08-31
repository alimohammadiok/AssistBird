// ChatAssistant.js
import React, { useState } from "react";
import { View, TextInput, ScrollView, Text, StyleSheet, Button } from "react-native";
import { Divider, Drawer, Menu, PaperProvider , Button as PButton} from "react-native-paper";
import { Icon, MD3Colors } from 'react-native-paper';

export default function ChatAssistant() {
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [visible, setVisible] = useState(false);
  console.log('visiblity is:', visible);
  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);
  
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
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=[API-Key]", {
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
        <View
        style={{
          paddingTop: 50,
        //   flexDirection: 'row',
        //   justifyContent: 'center',
          position: 'relative'
        }}>
            {/* <Button onPress={openMenu} title="show menu"/> */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
           anchor={
      (
        <Button
       title="set"
        onPress={openMenu}
    />)}
    >
    
          
          <Menu.Item onPress={() => {}} title="Item 1" />
          <Menu.Item onPress={() => {}} title="Item 2" />
          <Divider />
          <Menu.Item onPress={() => {}} title="Item 3" />
        </Menu>
      </View>
      <ScrollView style={styles.answerBox}>
        <Text style={styles.answer}>{answer}</Text>
      </ScrollView>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Ask about Medicare, TFN, housing..."
      />
      <Button title={loading ? "Loading..." : "Ask"} onPress={handleAsk} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  answerBox: { flex: 1, marginBottom: 10 },
  answer: { fontSize: 16, lineHeight: 22 },
});
