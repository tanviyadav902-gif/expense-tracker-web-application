let allExpenses = [];

window.onload = function () {

    showExpenses();

};


// ================= SHOW EXPENSES =================

async function showExpenses() {

    try {

        const response =
            await fetch("/api/expenses");

        allExpenses =
            await response.json();

        displayExpenses(allExpenses);

    }

    catch (err) {

        console.log(err);

        alert("Cannot load expenses");

    }

}


// ================= DISPLAY EXPENSES =================

function displayExpenses(expenses) {

    const list =
        document.getElementById("expense-list");

    list.innerHTML = "";

    let total = 0;

    expenses.forEach(function (exp) {

        total += Number(exp.amount);

        const row =
            document.createElement("tr");

        row.innerHTML = `

        <td>${exp.name}</td>

        <td>₹${exp.amount}</td>

        <td>${new Date(exp.date).toLocaleString()}</td>

        <td>

        <button onclick="editExpense('${exp._id}')">
        Edit
        </button>

        <button onclick="deleteExpense('${exp._id}')">
        Delete
        </button>

        </td>

        `;

        list.appendChild(row);

    });

    document.getElementById("totalExpense").innerText =
        "Total Expense: ₹" + total;

}


// ================= SEARCH =================

function searchExpense() {

    const keyword =
        document.getElementById("search")
        .value
        .toLowerCase();

    const filtered =
        allExpenses.filter(function (exp) {

            return exp.name
                .toLowerCase()
                .includes(keyword);

        });

    displayExpenses(filtered);

}


// ================= MONTH FILTER =================

function filterByMonth() {

    const month =
        document.getElementById("monthFilter").value;

    if (month === "all") {

        displayExpenses(allExpenses);

        return;

    }

    const filtered =
        allExpenses.filter(function (exp) {

            const d =
                new Date(exp.date);

            return d.getMonth() == month;

        });

    displayExpenses(filtered);

}


// ================= DELETE =================

async function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete)
        return;


    // Find Expense

    const expense =
        allExpenses.find(function (e) {

            return e._id === id;

        });


    // Save into Recently Deleted

    let deletedExpenses =
        JSON.parse(
            localStorage.getItem("deletedExpenses")
        ) || [];


    deletedExpenses.push({

        name: expense.name,

        amount: expense.amount,

        date: expense.date,

        deletedAt:
            new Date()

    });


    localStorage.setItem(

        "deletedExpenses",

        JSON.stringify(deletedExpenses)

    );


    // Delete from MongoDB

    await fetch(

        "/api/expenses/" + id,

        {

            method: "DELETE"

        }

    );


    showExpenses();

}


// ================= EDIT =================

async function editExpense(id) {

    const expense =
        allExpenses.find(function (e) {

            return e._id === id;

        });


    let newName =
        prompt(

            "Edit Expense Name",

            expense.name

        );


    if (newName === null)
        return;


    let newAmount =
        prompt(

            "Edit Amount",

            expense.amount

        );


    if (newAmount === null)
        return;


    try {

        await fetch(

            "/api/expenses/" + id,

            {

                method: "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body: JSON.stringify({

                    name: newName,

                    amount:
                        Number(newAmount)

                })

            }

        );

        showExpenses();

    }

    catch (err) {

        console.log(err);

        alert("Unable to update");

    }

}
