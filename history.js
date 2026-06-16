async function loadHistory() {

    const month =
        document.getElementById("monthSelect").value;

    const response =
        await fetch("/api/expenses");

    const expenses =
        await response.json();

    const table =
        document.getElementById("historyTable");

    table.innerHTML = `
    <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Expense</th>
        <th>Amount</th>
    </tr>
    `;

    let total = 0;

    expenses.forEach(function (exp) {

        const d = new Date(exp.date);

        if (d.getMonth() == month) {

            total += Number(exp.amount);

            table.innerHTML += `
            <tr>
                <td>${d.toLocaleDateString()}</td>
                <td>${d.toLocaleTimeString()}</td>
                <td>${exp.name}</td>
                <td>₹${exp.amount}</td>
            </tr>
            `;
        }
    });

    document.getElementById("monthlyTotal").innerText =
        "Total: ₹" + total;
}

window.onload = function () {

    const currentMonth =
        new Date().getMonth();

    document.getElementById("monthSelect").value =
        currentMonth;

    loadHistory();
};