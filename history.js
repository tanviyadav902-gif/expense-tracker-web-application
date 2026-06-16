async function loadHistory() {

    try {

        const month =
            document.getElementById("monthSelect").value;

        const response =
            await fetch("/api/expenses");

        if (!response.ok) {
            throw new Error("Failed to load expenses");
        }

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

        expenses.forEach((exp) => {

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

    catch (error) {

        console.error(error);

        document.getElementById("monthlyTotal").innerText =
            "Error loading expenses";

    }

}

window.onload = function () {

    const currentMonth =
        new Date().getMonth();

    document.getElementById("monthSelect").value =
        currentMonth;

    loadHistory();

};
