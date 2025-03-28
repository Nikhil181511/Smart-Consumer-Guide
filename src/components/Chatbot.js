import React, { useState } from "react";
import "./Chatbot.css";

const Chatbot = ({ product }) => {
    // 🔹 State to store chat messages
    const [messages, setMessages] = useState([]);
    // 🔹 State to handle user input field
    const [input, setInput] = useState("");

    /**
     * 🔹 Function to handle sending messages
     * - Adds user message to state
     * - Sends request to backend API
     * - Receives and processes bot response
     */
    const sendMessage = async () => {
        // 🚫 Prevent sending empty messages
        if (!input.trim()) return;

        // ✅ Add user message to chat history
        const userMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            // ✅ Send API request with user input and product details
            const response = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input, product }),
            });

            // ✅ Convert response to JSON format
            const data = await response.json();

            // 🚨 Handle unexpected API responses (if response is an object instead of text)
            if (typeof data.response === "object") {
                console.error("Chatbot Error: Received an object instead of text", data.response);
            }

            // ✅ Extract bot response
            const botMessage = { sender: "bot", text: data.response };

            // ✅ Add bot response to chat history
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            // ❌ Handle API errors
            console.error("Chatbot Error:", error);
        }

        // ✅ Clear input field after sending
        setInput("");
    };

    return (
        <div className="chatbot-container">
            <h3>Chat with AI 🤖</h3>

            {/* 🔹 Chatbox displaying messages */}
            <div className="chatbox">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {/* ✅ Ensure bot messages are always string (prevent objects from rendering) */}
                        {typeof msg.text === "object" ? JSON.stringify(msg.text) : (
                            msg.text.split('\n').map((line, i) => (
                                <div key={i} style={{ marginLeft: '1em', textIndent: '-1em' }}>
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>

            {/* 🔹 Input field for user messages */}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
            />

            {/* 🔹 Send button */}
            <button class = "next" onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chatbot;