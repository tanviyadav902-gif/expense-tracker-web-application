const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;

// ================= MONGODB CONNECTION =================

mongoose.set("strictQuery", false);

console.log("Trying MongoDB connection...");

mongoose.connect(
    "mongodb+srv://YOUR_USERNAME:juWm3YwPAUStl1Yc@cluster0.2jm9kh9.mongodb.net/expenseTracker?retryWrites=true&w=majority&appName=Cluster0"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:");
    console.log(err);
});

// ================= EXPENSE SCHEMA =================

const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    date: {
        type: String,
        default: () => new Date().toISOString()
    }
});

const Expense = mongoose.model("Expense", expenseSchema);

// ================= MIME TYPES =================

const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
};

// ================= SERVER =================

const server = http.createServer(async (req, res) => {

    const parsedUrl = url.parse(req.url, true);

    // ================= CORS =================

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // ================= GET EXPENSES =================

    if (
        parsedUrl.pathname === "/api/expenses" &&
        req.method === "GET"
    ) {
        try {

            const expenses = await Expense.find().sort({ date: -1 });

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify(expenses));

        } catch (err) {

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                error: err.message
            }));
        }

        return;
    }

    // ================= ADD EXPENSE =================

    if (
        parsedUrl.pathname === "/api/expenses" &&
        req.method === "POST"
    ) {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {

                const data = JSON.parse(body);

                const expense = new Expense({
                    name: data.name,
                    amount: Number(data.amount),
                    date: new Date().toISOString()
                });

                await expense.save();

                res.writeHead(200, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: true,
                    message: "Expense Added",
                    expense
                }));

            } catch (err) {

                res.writeHead(500, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    success: false,
                    error: err.message
                }));
            }
        });

        return;
    }

    // ================= DELETE EXPENSE =================

    if (
        parsedUrl.pathname.startsWith("/api/expenses/") &&
        req.method === "DELETE"
    ) {

        try {

            const id = parsedUrl.pathname.split("/").pop();

            await Expense.findByIdAndDelete(id);

            res.writeHead(200, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: true,
                message: "Expense Deleted"
            }));

        } catch (err) {

            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            res.end(JSON.stringify({
                success: false,
                error: err.message
            }));
        }

        return;
    }

    // ================= STATIC FILES =================

    let filePath = path.join(
        __dirname,
        parsedUrl.pathname === "/"
            ? "home.html"
            : parsedUrl.pathname
    );

    const ext = path.extname(filePath);

    const contentType =
        mimeTypes[ext] || "text/plain";

    fs.readFile(filePath, (err, content) => {

        if (err) {

            res.writeHead(404, {
                "Content-Type": "text/plain"
            });

            res.end("404 Not Found");

        } else {

            res.writeHead(200, {
                "Content-Type": contentType
            });

            res.end(content);

        }

    });

});

// ================= START SERVER =================

server.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});
