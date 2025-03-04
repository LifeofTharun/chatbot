const API_KEY = "AIzaSyADQekfBjbkyYSZAlak507IyXHpsAUEu14"; // Replace with your actual API key

async function sendMessage() {
    let userInput = document.getElementById("userInput").value;
    let chatbox = document.getElementById("chatbox");

    if (!userInput.trim()) return;

    // Display user message
    chatbox.innerHTML += `<div class="message user">${userInput}</div>`;
    document.getElementById("userInput").value = "";

    // Show loading message
    let loadingMsg = document.createElement("div");
    loadingMsg.classList.add("message", "bot");
    loadingMsg.textContent = "Thinking...";
    chatbox.appendChild(loadingMsg);
    chatbox.scrollTop = chatbox.scrollHeight;

    try {
        let response = await fetch(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    contents: [{ role: "user", parts: [{ text: userInput }] }] 
                })
            }
        );

        let data = await response.json();
        let botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't understand that.";

        // Remove loading message
        chatbox.removeChild(loadingMsg);

        // Format response for code
        let formattedReply = formatResponse(botReply);

        // Display bot response
        chatbox.innerHTML += `<div class="message bot">${formattedReply}</div>`;
        chatbox.scrollTop = chatbox.scrollHeight;

    } catch (error) {
        console.error(error);
        chatbox.innerHTML += `<div class="message bot">Error: Unable to fetch response.</div>`;
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

// Function to format response with code blocks
function formatResponse(text) {
    return text.replace(/```([\s\S]*?)```/g, '<pre>$1</pre>');
}
