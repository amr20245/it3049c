/*
 * Simple chat client for IT3049C assignment.
 *
 * This script fetches chat messages from a remote API and displays them in
 * a chat box. It also allows the user to send messages via the same API.
 */

// Grab references to elements we'll interact with
const nameInput = document.getElementById('my-name-input');
const messageInput = document.getElementById('my-message-input');
const sendButton = document.getElementById('send-button');
const chatBox = document.getElementById('chat');

/**
 * Convert a message object into a DOM element. The structure mirrors the
 * markup used in the assignment instructions.
 *
 * @param {{id: number, text: string, sender: string, timestamp: number}} message
 * @returns {HTMLElement}
 */
function formatMessage(message) {
    const mine = message.sender === nameInput.value;
    // Container with either `.mine` or `.yours` class
    const wrapper = document.createElement('div');
    wrapper.classList.add(mine ? 'mine' : 'yours', 'messages');

    // Bubble with the message text
    const bubble = document.createElement('div');
    bubble.classList.add('message');
    bubble.textContent = message.text;
    wrapper.appendChild(bubble);

    // If the message is not from the current user, display sender info and time
    if (!mine) {
        const info = document.createElement('div');
        info.classList.add('sender-info');
        const date = new Date(message.timestamp);
        // Format time as h:mmAM/PM
        const hours12 = date.getHours() % 12 || 12;
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        info.textContent = `${message.sender} ${hours12}:${minutes}${ampm}`;
        wrapper.appendChild(info);
    }
    return wrapper;
}

/**
 * Retrieve an array of messages from the server API.
 *
 * The remote endpoint returns JSON in the shape
 * [{ id, text, sender, timestamp }, ...].
 * @returns {Promise<Array>} A promise resolving to an array of messages
 */
async function fetchMessages() {
    try {
        const response = await fetch('https://it3049c-chat.fly.dev/messages');
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
}

/**
 * Refresh the UI with the latest messages. Clears the chat box, fetches
 * new messages, formats them, appends them to the DOM, and scrolls to
 * the latest message.
 */
async function updateMessages() {
    const messages = await fetchMessages();
    // Remove existing messages
    chatBox.innerHTML = '';
    // Add each formatted message
    messages.forEach((msg) => {
        const element = formatMessage(msg);
        chatBox.appendChild(element);
    });
    // Scroll to the bottom so the latest messages are visible
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Immediately load messages on page load
updateMessages();

// Poll for new messages every 10 seconds
const MILLISECONDS_IN_TEN_SECONDS = 10000;
setInterval(updateMessages, MILLISECONDS_IN_TEN_SECONDS);

/**
 * Send a message to the server.
 *
 * Constructs a message object with the sender, text and current timestamp,
 * then issues a POST request to the API. The server will echo back the
 * posted message for everyone to see.
 *
 * @param {string} sender The name of the sender
 * @param {string} text The content of the message
 */
async function sendMessage(sender, text) {
    const payload = {
        sender,
        text,
        timestamp: Date.now(),
    };
    try {
        await fetch('https://it3049c-chat.fly.dev/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

// When the send button is clicked, grab the inputs and send the message
sendButton.addEventListener('click', async () => {
    const sender = nameInput.value.trim();
    const text = messageInput.value.trim();
    // Do nothing if either field is empty
    if (!sender || !text) return;
    await sendMessage(sender, text);
    // Clear the message input after sending
    messageInput.value = '';
    // Refresh the messages after sending so we see the result
    updateMessages();
});
