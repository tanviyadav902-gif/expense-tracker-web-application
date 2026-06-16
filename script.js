window.onload = function () {

    var currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "home.html";
        return;
    }

    var form = document.getElementById("expense-form");
    var walletEl = document.getElementById("walletBalance");

    if (walletEl) {
        var balance =
        parseFloat(localStorage.getItem("walletBalance")) || 0;

        walletEl.innerText = balance;
    }

    if (form) {

        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const name =
            document.getElementById("name").value.trim();

            const amount =
            document.getElementById("amount").value;

            const message =
            document.getElementById("message");

            if (!name || !amount) {

                message.innerText =
                "Please fill all fields";

                return;
            }

            try {

                const response =
                await fetch("/api/expenses", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        amount: Number(amount)
                    })

                });

                const data =
                await response.json();

                if (!response.ok) {

                    message.innerText =
                    "Server Error: " +
                    (data.error || "Unknown Error");

                    return;
                }

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

            catch (error) {

                console.log(error);

                message.innerText =
                "Connection Error. Check Render Logs.";

            }

        });

    }

};
