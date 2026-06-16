let allExpenses = [];

window.onload = function () {
    showExpenses();
};

// ================= SHOW =================

async function showExpenses() {

    const response = await fetch("/api/expenses");
    allExpenses = await response.json();

    displayExpenses(allExpenses);
}

// ================= DISPLAY =================

function displayExpenses(expenses) {

    const list = document.getElementById("expense-list");

    list.innerHTML = "";

    let total = 0;

    expenses.forEach(function (exp) {

        total += Number(exp.amount);

        const row = document.createElement("tr");

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
        document.getElementById("search").value.toLowerCase();

    const filtered = allExpenses.filter(exp =>
        exp.name.toLowerCase().includes(keyword)
    );

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

    const filtered = allExpenses.filter(function (exp) {

        const d = new Date(exp.date);

        return d.getMonth() == month;
    });

    displayExpenses(filtered);
}

// ================= DELETE =================

async function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete) return;

    await fetch("/api/expenses/" + id, {
        method: "DELETE"
    });

    showExpenses();
}

// ================= EDIT =================

async function editExpense(id) {

    const expense =
        allExpenses.find(e => e._id === id);

    const newName =
        prompt("Edit Name", expense.name);

    const newAmount =
        prompt("Edit Amount", expense.amount);

    if (newName === null || newAmount === null)
        return;

    await fetch("/api/expenses/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name: newName,
            amount: Number(newAmount)
        })

    });

    showExpenses();
}