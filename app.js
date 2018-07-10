window.onload = () => {
  firebase.auth().onAuthStateChanged((user)=>{
    if(user) {
      // Si estamos logeados
      loggedOut.style.display = 'none';
      loggedIn.style.display = 'block';
      console.log('User > ' + JSON.stringify(user));
    } else {
      // No estamos logeados
      loggedOut.style.display = 'block';
      loggedIn.style.display = 'none';
    }
  });

  firebase.database().ref('messages')
  .limitToLast(2) //Filtro para no obtener todos los mensajes
    .once('value')
    .then((messages)=> {
      console.log('Mensajes > ' + JSON.stringify(messages));
    })
    .catch(()=> {

    });
     

  firebase.database().ref('messages')
  .limitToLast(1)
    .on('child_added', (newMessage) => {
        messageContainer.innerHTML += `
        <p>Nombre: ${newMessage.val().creatorName}</p>
        <p>${newMessage.val().text}</p>
        `
    });
}

function logInOrRegister() {
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
  .then(()=> {
    console.log('Usuario registrado');
  })
  .catch((error)=> {
    console.log('Error de Firebase > ' + error.code);
    console.log('Error de Firebase, mensaje > ' + error.message);
  });
}

function login() {
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
  .then(()=> {
    console.log('Usuario con login exitoso');
  })
  .catch(()=> {
    console.log('Error de Firebase > ' + error.code);
    console.log('Error de Firebase, mensaje > ' + error.mensaje);
  });
}

function logout() {
  firebase.auth().signOut()
  .then(()=> {
    console.log('Chao');
  })
  .catch();
}

function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScore('user_birthday'); hay que pedirle permiso a Facebook
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
  .then(()=> {
    console.log('Login con facebook');
  })
  .catch((error) => {
    console.log('Error de Firebase > ' + error.code);
    console.log('Error de Firebase, mensaje > ' + error.message);
  });
}


// Firebase Database

// Usaremos una colección para guardar los mensajes, llamada messages
function sendMessage() {
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;

  const newMessageKey = firebase.database().ref().child(`messages`).push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: messageAreaText
    
  });
}


// Queremos guardar lo que se vende en Laboratoria
// Producto, quién lo vende, valor, descripción, foto
// Usuario =====|          |
// Número =================|

// Cantidad que se compra, stock disponible, precio total, comprador, vendedor, cuándo pasó
// Transacción 

