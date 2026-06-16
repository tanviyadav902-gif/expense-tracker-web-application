window.onload = function () {

// ================= LOGIN CHECK =================

var currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "home.html";
    return;
}


// ================= ELEMENTS =================

var form = document.getElementById("expense-form");
var walletEl = document.getElementById("walletBalance");


// ================= LOAD WALLET =================

if (walletEl) {

    var balance =
    parseFloat(localStorage.getItem("walletBalance")) || 0;

    walletEl.innerText = balance;
}


// ================= ADD EXPENSE =================

if (form) {

    form.onsubmit = function (e) {

        e.preventDefault();

        var name =
        document.getElementById("name").value;

        var amount =
        document.getElementById("amount").value;

        if (name === "" || amount === "") {

            alert("Fill all fields");
            return;
        }

        fetch("/api/expenses", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,
                amount: parseFloat(amount)

            })

        })

        .then(response => response.json())

        .then(data => {

            // Update Wallet

            var balance =
            parseFloat(localStorage.getItem("walletBalance")) || 0;

            balance -= parseFloat(amount);

            localStorage.setItem(
                "walletBalance",
                balance
            );

            if (walletEl) {
                walletEl.innerText = balance;
            }

            document.getElementById("message").innerText =
            "Expense Added Successfully";

            form.reset();

        })

        .catch(error => {

            console.log(error);

            document.getElementById("message").innerText =
            "Error Saving Expense";

        });

    };

}


// ================= DELETE FUNCTION =================
// (Temporary - still localStorage version)
// Will convert to MongoDB later

window.deleteExpense = function (index) {

    var expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

    var balance =
    parseFloat(localStorage.getItem("walletBalance")) || 0;

    balance += parseFloat(expenses[index].amount);

    localStorage.setItem(
        "walletBalance",
        balance
    );

    expenses.splice(index, 1);

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );

    location.reload();

};


// ================= EDIT FUNCTION =================
// (Temporary - still localStorage version)
// Will convert to MongoDB later

window.editExpense = function (index) {

    var expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

    var newName =
    prompt("Edit name", expenses[index].name);

    var newAmount =
    prompt("Edit amount", expenses[index].amount);

    var newDate =
    prompt(
        "Edit date",
        expenses[index].date
    );

    if (
        newName !== null &&
        newAmount !== null &&
        newDate !== null
    ) {

        expenses[index].name = newName;

        expenses[index].amount =
        parseFloat(newAmount);

        expenses[index].date = newDate;

        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );

        location.reload();
    }

};


// ================= ADD MONEY =================

window.addMoney = function () {

    var amount =
    document.getElementById("addMoney").value;

    if (amount === "") {

        alert("Enter amount");
        return;
    }

    var balance =
    parseFloat(localStorage.getItem("walletBalance")) || 0;

    balance += parseFloat(amount);

    localStorage.setItem(
        "walletBalance",
        balance
    );

    location.reload();
};


// ================= LOGOUT =================

window.logout = function () {

    localStorage.removeItem("currentUser");

    window.location.href = "home.html";
};

};