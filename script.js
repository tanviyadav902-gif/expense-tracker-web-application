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
    var message = document.getElementById("message");

    // ================= LOAD WALLET =================

    if (walletEl) {

        var balance =
            parseFloat(localStorage.getItem("walletBalance")) || 0;

        walletEl.innerText = balance;
    }

    // ================= ADD EXPENSE =================

    if (form) {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            var name =
                document.getElementById("name").value.trim();

            var amount =
                document.getElementById("amount").value;

            if (!name || !amount) {

                message.innerText =
                    "Please fill all fields";

                return;
            }

            try {

                const response = await fetch("/api/expenses", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,
                        amount: Number(amount)

                    })

                });

                const data = await response.json();

                if (response.ok) {

                    var balance =
                        parseFloat(localStorage.getItem("walletBalance")) || 0;

                    balance -= Number(amount);

                    localStorage.setItem(
                        "walletBalance",
                        balance
                    );

                    if (walletEl) {

                        walletEl.innerText = balance;
                    }

                    message.innerText =
                        "Expense Added Successfully";

                    form.reset();

                }

                else {

                    message.innerText =
                        data.error || "Server Error";

                }

            }

            catch (error) {

                console.log(error);

                message.innerText =
                    "Cannot connect to server";

            }

        });

    }

};
