export const showMessage = (text, type) => {
    const existingMessage = document.querySelector('.message-overlay');
    if (existingMessage) {
        document.body.removeChild(existingMessage);
    }

    const message = document.createElement('div');
    message.className = `message-overlay ${type}`;
    message.textContent = text;
    
    document.body.appendChild(message);
    setTimeout(() => {
        if (document.body.contains(message)) {
            document.body.removeChild(message);
        }
    }, 0);
};