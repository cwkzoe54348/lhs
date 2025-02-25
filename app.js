import { auth, database, ref, set, push, onValue, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './firebase.js';

document.addEventListener("DOMContentLoaded", function() {
    const orderForm = document.getElementById("orderForm");
    const signInForm = document.getElementById("signInForm");
    const submitOrderBtn = document.getElementById("submitOrderBtn");
    const signInBtn = document.getElementById("signInBtn");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const donationInput = document.getElementById("donation");
    const paymentMethodInput = document.getElementById("paymentMethod");
    const totalPriceSpan = document.getElementById("totalPrice");
    const paypalTotalSpan = document.getElementById("paypalTotal");
    const cashTotalSpan = document.getElementById("cashTotal");
    const itemList = document.getElementById("itemList");
    const errorMessage = document.getElementById("error-message");

    let order = {};
    let totalPrice = 0;

    const items = [
        { name: "Libertyville/Jim Moran", price: 20 },
        { name: "Libertyville: Then and Now", price: 20 },
        { name: "LHS Athletics 100/Eggert", price: 20 },
        { name: "Notecards (set of 10)", price: 8 },
        { name: "Postcards", price: 1 },
        { name: "Plates", price: 5 },
        { name: "Shellenberger print- 4th of July", price: 10 },
        { name: "Shellenberger print- Fall", price: 10 },
        { name: "Shellenberger print- Summer", price: 10 }
    ];

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<span>${item.name} - $${item.price}</span><input type="number" min="0" data-name="${item.name}" />`;
        itemList.appendChild(itemDiv);
    });

    signInBtn.addEventListener("click", function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                signInForm.style.display = "none";
                orderForm.style.display = "block";
                getSalesReport();
            })
            .catch((error) => {
                errorMessage.textContent = error.message;
            });
    });

    // Monitor auth state to handle sessions
    onAuthStateChanged(auth, user => {
        if (user) {
            // Set up to handle order submission
            submitOrderBtn.addEventListener("click", () => {
                const donationAmount = parseFloat(donationInput.value) || 0;
                const paymentMethod = paymentMethodInput.value;
                const timestamp = new Date().toISOString();

                let orderTotal = 0;
                for (let itemName in order) {
                    const item = items.find(i => i.name === itemName);
                    orderTotal += item.price * order[itemName];
                }

                orderTotal += donationAmount;
                totalPrice = orderTotal;

                const orderRef = push(ref(database, 'orders'));
                set(orderRef, {
                    items: order,
                    totalPrice: totalPrice,
                    donationAmount: donationAmount,
                    paymentMethod: paymentMethod,
                    timestamp: timestamp
                });

                order = {}; // Reset order after submission
                alert("Order submitted successfully!");
                getSalesReport();
            });

            // Update order quantities
            document.querySelectorAll('input[data-name]').forEach(input => {
                input.addEventListener("change", function() {
                    const itemName = this.getAttribute("data-name");
                    const quantity = parseInt(this.value) || 0;
                    order[itemName] = quantity;
                    updateTotalPrice();
                });
            });
        } else {
            signInForm.style.display = "block";
            orderForm.style.display = "none";
        }
    });

    // Calculate and display total price
    function updateTotalPrice() {
        let total = 0;
        for (let itemName in order) {
            const item = items.find(i => i.name === itemName);
            total += item.price * order[itemName];
        }
        const donationAmount = parseFloat(donationInput.value) || 0;
        total += donationAmount;
        totalPriceSpan.textContent = total;
    }

    // Get the sales report (PayPal and Cash totals)
    function getSalesReport() {
        const ordersRef = ref(database, 'orders');
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            let paypalTotal = 0;
            let cashTotal = 0;

            for (let orderId in data) {
                const order = data[orderId];
                if (order.paymentMethod === "PayPal") {
                    paypalTotal += order.totalPrice;
                } else if (order.paymentMethod === "Cash") {
                    cashTotal += order.totalPrice;
                }
            }

            paypalTotalSpan.textContent = paypalTotal;
            cashTotalSpan.textContent = cashTotal;
        });
    }
});
