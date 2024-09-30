
'use client'
import { useState, useEffect } from 'react';
import {auth,db,model } from '../../../../firestore';
import styles from './Home.module.css';

export default function Home() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const handleChat = async (userInput, history) => {
    // Format the history correctly
    const formattedHistory = history.map(message => ({
      role: message.role,
      parts: [{ text: message.content }], // Wrap content in an array with 'text'
    }));
  
    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 100,
      },
    });
  
    const result = await chat.sendMessageStream(userInput);
    let modelResponse = '';
  
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      modelResponse += chunkText;
    }
  
    return modelResponse;
  };
  




  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput) return;
  
    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setLoading(true);
    setUserInput('');
  
    try {
      const response = await handleChat(userInput, newMessages);
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: response },
      ]);
    } catch (error) {
      console.error('Error handling chat:', error);
    } finally {
      setLoading(false);
    }
  };






  


  return (
    <div className={styles.container}>
      <h1>Chat with AI</h1>
    
      
        <div>
  
          <div className={styles.chatContainer}>
            <div className={styles.messages}>
              {messages.map((msg, index) => (
                <div key={index} className={msg.role === 'user' ? styles.userMessage : styles.modelMessage}>
                  <strong>{msg.role === 'user' ? 'You: ' : 'AI: '}</strong>
                  {msg.content}
                </div>
              ))}
              {loading && <div className={styles.loading}>AI is typing...</div>}
            </div>
            <form onSubmit={handleSubmit} className={styles.inputForm}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your message..."
                className={styles.input}
              />
              <button type="submit" className={styles.button}>Send</button>
            </form>
          </div>
        </div>
     
    </div>
  );
}
