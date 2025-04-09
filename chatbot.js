document.addEventListener('DOMContentLoaded', function() {
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const quickQuestions = document.querySelectorAll('.quick-question');

    // Toggle chatbot visibility with animation
    chatbotButton.addEventListener('click', function() {
        chatbotContainer.style.display = 'flex';
        setTimeout(() => {
            chatbotContainer.style.opacity = '1';
            chatbotContainer.style.transform = 'translateY(0)';
        }, 10);
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.style.opacity = '0';
        chatbotContainer.style.transform = 'translateY(20px)';
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
        }, 300);
    });

    // Initial bot greeting when opened
    chatbotButton.addEventListener('click', function() {
        setTimeout(() => {
            addMessage("Hello! I'm your KFU Link assistant. How can I help you today?", 'bot');
        }, 500);
    });

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Show typing indicator
            const typingIndicator = addTypingIndicator();
            
            // Process after a short delay
            setTimeout(() => {
                removeTypingIndicator(typingIndicator);
                respondToMessage(message);
            }, 1000 + Math.random() * 1000); // Random delay for more natural feel
        }
    }

    // Typing indicator functions
    function addTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chatbot-message', 'bot-message', 'typing-indicator');
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    function removeTypingIndicator(indicator) {
        indicator.remove();
    }

    // Send message on button click or Enter key
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Quick questions with visual feedback
    quickQuestions.forEach(button => {
        button.addEventListener('click', function() {
            // Add visual feedback
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 300);
            
            const question = this.textContent;
            addMessage(question, 'user');
            
            // Show typing indicator
            const typingIndicator = addTypingIndicator();
            
            setTimeout(() => {
                removeTypingIndicator(typingIndicator);
                respondToMessage(question);
            }, 800 + Math.random() * 800);
        });
    });

    // Add message to chat with animation
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chatbot-message', `${sender}-message`, 'message-entering');
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        
        // Handle HTML content (for buttons in responses)
        if (text.includes('<button')) {
            messageDiv.innerHTML = text;
            
            // Reattach event listeners to any buttons
            messageDiv.querySelectorAll('button').forEach(btn => {
                const originalOnClick = btn.getAttribute('onclick');
                btn.onclick = function() {
                    eval(originalOnClick);
                };
            });
        }
        
        setTimeout(() => {
            messageDiv.classList.remove('message-entering');
        }, 10);
        
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Enhanced bot responses with conversation flow
    function respondToMessage(message) {
        let response = "";
        const lowerMessage = message.toLowerCase();
        
        // Check for keywords and provide appropriate responses
        if (lowerMessage.includes('progress') || lowerMessage.includes('track')) {
            response = "You can track your academic progress and skill development in the 'Progress' section. Would you like me to take you there?";
            response += "<div class='chat-options'><button class='inline-button' onclick='window.location.href=\"Progress.html\"'>Yes, please!</button>";
            response += "<button class='inline-button' onclick='addMessage(\"No thanks, I have another question.\", \"user\")'>No, thanks</button></div>";
        } 
        else if (lowerMessage.includes('opportunit') || lowerMessage.includes('job') || lowerMessage.includes('internship')) {
            response = "I can help you with opportunities! The 'Opportunities' section lists jobs, internships, and training programs matched to your profile.";
            response += "<div class='chat-options'><button class='inline-button' onclick='window.location.href=\"Opportunities.html\"'>Browse Opportunities</button>";
            response += "<button class='inline-button' onclick='addMessage(\"What types of opportunities are available?\")'>What's available?</button></div>";
        }
        else if (lowerMessage.includes('pathway') || lowerMessage.includes('recommend') || lowerMessage.includes('career')) {
            response = "I'd be happy to help with pathway recommendations! We have personalized academic and career pathways available.";
            response += "<div class='chat-options'><button class='inline-button' onclick='window.location.href=\"pathway.html\"'>Explore Pathways</button>";
            response += "<button class='inline-button' onclick='addMessage(\"How are pathways personalized?\")'>How are they personalized?</button></div>";
        }
        else if (lowerMessage.includes('hackathon') || lowerMessage.includes('competition')) {
            response = "Exciting! We have information about upcoming hackathons and coding competitions.";
            response += "<div class='chat-options'><button class='inline-button' onclick='window.location.href=\"hackathons.html\"'>View Hackathons</button>";
            response += "<button class='inline-button' onclick='addMessage(\"Are there any beginner-friendly hackathons?\")'>Any for beginners?</button></div>";
        }
        else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            response = "Hello there! 👋 I'm your KFU Link assistant. I can help you with:";
            response += "<ul class='bot-list'><li>📊 Tracking your progress</li><li>💼 Finding opportunities</li>";
            response += "<li>🛣️ Career pathway recommendations</li><li>💻 Hackathon information</li></ul>";
            response += "What would you like to explore today?";
        }
        else if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            response = "I'm here to help! Here's what I can assist with:";
            response += "<ul class='bot-list'><li><button class='text-button' onclick='addMessage(\"How do I track my progress?\")'>Progress tracking</button></li>";
            response += "<li><button class='text-button' onclick='addMessage(\"What opportunities are available?\")'>Opportunities</button></li>";
            response += "<li><button class='text-button' onclick='addMessage(\"Tell me about career pathways\")'>Career pathways</button></li>";
            response += "<li><button class='text-button' onclick='addMessage(\"Upcoming hackathons\")'>Hackathons</button></li></ul>";
        }
        else if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            response = "You're very welcome! 😊 Is there anything else I can help you with?";
        }
        else {
            response = "I want to make sure I understand correctly. Are you asking about:";
            response += "<div class='chat-options'><button class='inline-button' onclick='addMessage(\"Progress tracking\")'>Progress Tracking</button>";
            response += "<button class='inline-button' onclick='addMessage(\"Job opportunities\")'>Opportunities</button>";
            response += "<button class='inline-button' onclick='addMessage(\"Career pathways\")'>Pathways</button>";
            response += "<button class='inline-button' onclick='addMessage(\"Hackathons\")'>Hackathons</button></div>";
        }
        
        addMessage(response, 'bot');
    }
});
