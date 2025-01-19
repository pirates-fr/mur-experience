let loggedInUser = null;

async function signup() {
  const newUserId = document.getElementById('newUserId').value;
  const newUserPassword = document.getElementById('newUserPassword').value;
  
  if (!newUserId || !newUserPassword) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newUserId, password: newUserPassword })
    });

    if (response.ok) {
      loggedInUser = newUserId;
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('messageBoard').style.display = 'block';
      loadMessages();
    } else {
      alert("Erreur lors de l'inscription. Veuillez réessayer.");
    }
  } catch (error) {
    alert("Erreur de réseau. Veuillez réessayer plus tard.");
  }
}

async function login() {
  const userId = document.getElementById('userId').value;
  const userPassword = document.getElementById('userPassword').value;
  
  if (!userId || !userPassword) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, password: userPassword })
    });

    if (response.ok) {
      loggedInUser = userId;
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('messageBoard').style.display = 'block';
      loadMessages();
    } else {
      alert("Identifiants incorrects. Veuillez réessayer.");
    }
  } catch (error) {
    alert("Erreur de réseau. Veuillez réessayer plus tard.");
  }
}

async function postMessage() {
  const message = document.getElementById('messageInput').value;

  if (!message.trim()) {
    alert("Veuillez entrer un message avant de publier.");
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: loggedInUser, text: message })
    });

    const data = await response.json();

    if (response.ok) {
      loadMessages();
      document.getElementById('messageInput').value = '';
    } else {
      alert(data.error || 'Erreur inconnue');
    }
  } catch (error) {
    alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
  }
}

async function loadMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '<p>Chargement...</p>';
  
    try {
      const response = await fetch('http://localhost:3000/messages');
      const messages = await response.json();
  
      messagesDiv.innerHTML = '';
  
      messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-container');
  
        const userSpan = document.createElement('span');
        userSpan.style.fontWeight = 'bold';
        userSpan.textContent = message.user;
        messageDiv.appendChild(userSpan);
  
        const messageText = document.createElement('div');
        messageText.innerHTML = message.text.replace(/\n/g, '<br>');
        messageDiv.appendChild(messageText);
  
        messagesDiv.appendChild(messageDiv);
      });
    } catch (error) {
      messagesDiv.innerHTML = '<p>Erreur lors du chargement des messages.</p>';
      console.error('Erreur lors du chargement des messages:', error);
    }
}

function showSignup() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'block';
}