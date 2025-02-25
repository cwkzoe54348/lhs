// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyC4aNRvVxHbnievs1bEXbn6sZ69AoPXoFA",
  authDomain: "libertyville-historical.firebaseapp.com",
  databaseURL: "https://libertyville-historical-default-rtdb.firebaseio.com",
  projectId: "libertyville-historical",
  storageBucket: "libertyville-historical.firebasestorage.app",
  messagingSenderId: "573948661145",
  appId: "1:573948661145:web:6211a30710ea68ea281708",
  measurementId: "G-K1TN0ZLSPP"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Function to calculate the total price
function calculateTotal() {
    let total = 0;
    total += parseInt(document.getElementById('jimMoran').value) * 20;
    total += parseInt(document.getElementById('thenAndNow').value) * 20;
    total += parseInt(document.getElementById('lhsAthletics').value) * 20;
    total += parseInt(document.getElementById('notecards').value) * 8;
    total += parseInt(document.getElementById('postcards').value) * 1;
    total += parseInt(document.getElementById('plates').value) * 5;
    total += parseInt(document.getElementById('julyPrint').value) * 10;
    total += parseInt(document.getElementById('fallPrint').value) * 10;
    total += parseInt(document.getElementById('summerPrint').value) * 10;
    total += parseInt(document.getElementById('donation').value); // Donation amount

    document.getElementById('total').innerText = total;
    return total;
}

// Submit Order function
function submitOrder() {
    const order = {
        jimMoran: document.getElementById('jimMoran').value,
        thenAndNow: document.getElementById('thenAndNow').value,
        lhsAthletics: document.getElementById('lhsAthletics').value,
        notecards: document.getElementById('notecards').value,
        postcards: document.getElementById('postcards').value,
        plates: document.getElementById('plates').value,
        julyPrint: document.getElementById('julyPrint').value,
        fallPrint: document.getElementById('fallPrint').value,
        summerPrint: document.getElementById('summerPrint').value,
        donation: document.getElementById('donation').value,
        total: calculateTotal(),
        paymentMethod: document.getElementById('paymentMethod').value,
        timestamp: new Date().toISOString(),
    };

    // Add order to Firebase
    const orderRef = database.ref('orders').push();
    orderRef.set(order);
}

// Real-time Sales Report (PayPal / Cash Sales)
function updateSalesReport() {
    const salesRef = database.ref('orders');
    salesRef.on('value', (snapshot) => {
        let paypalTotal = 0;
        let cashTotal = 0;
        snapshot.forEach((order) => {
            if (order.val().paymentMethod === 'PayPal') {
                paypalTotal += order.val().total;
            } else if (order.val().paymentMethod === 'Cash') {
                cashTotal += order.val().total;
            }
        });

        // Update sales report
        document.getElementById('paypalTotal').innerText = paypalTotal;
        document.getElementById('cashTotal').innerText = cashTotal;
    });
}

// Call updateSalesReport when the page loads
updateSalesReport();
