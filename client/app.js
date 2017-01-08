(function() {
  var firebaseConfig = {
    apiKey: "AIzaSyC5DTdVnNVUB6BVhV-Mt99fl_f5V4unqcg",
    authDomain: "slidetherapy-970be.firebaseapp.com",
    databaseURL: "https://slidetherapy-970be.firebaseio.com",
    storageBucket: "slidetherapy-970be.appspot.com",
    messagingSenderId: "815198829976"
  };

  var checkout = StripeCheckout.configure({
    key: 'pk_test_CK71Laidqlso9O9sZDktqW6a',
    image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
    locale: 'auto',
    token: onToken
  });

  firebase.initializeApp(firebaseConfig);
  var database = firebase.database();
  var user;

  authenticateUser('me@jimmybyrum.com', 'testing12').then(function() {
    user = firebase.auth().currentUser;
    console.info('Logged in');
  });

  document.getElementById('buyButton').addEventListener('click', initPurchase);
  window.addEventListener('popstate', closeCheckout);

  function initPurchase(e) {
    checkout.open({
      name: 'Slide Therapy',
      description: '2016 Deck',
      amount: 2900
    });
    e.preventDefault();
  }

  function closeCheckout() {
    checkout.close();
  }

  function onToken(token) {
    console.info('onToken', token);
    getOid(function(oid) {
      $.ajax({
        type: 'POST',
        url: 'http://localhost:7678/api/charge',
        data: {
          amount: 2900,
          token: token.id,
          oid: oid,
          email: user.email
        },
        success: function() {
          savePurchase(oid, user.email, token.id);
          closeCheckout();
        },
        error: function(err) {
          console.error('onToken', err);
        }
      });
    });
  }

  function createUser(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).catch(onError);
  }

  function authenticateUser(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password).catch(onError);
  }

  function getOid(callback) {
    database.ref('oid-counter').once('value').then(function(counter) {
      var oid = counter.val() + 1;
      database.ref('oid-counter').set(oid);
      callback(oid);
    });
  }

  function savePurchase(oid, email, token) {
    var hash = CryptoJS.MD5(oid + email + token);
    var date = new Date();
    var order = {
      oid: oid,
      created: Math.round(date / 1000),
      created_at: date.toUTCString(),
      email: email,
      token: token
    };
    return database.ref('orders/' + hash).set(order).catch(onError);
  }

  function onError(error) {
    console.error(error);
  }
}());
