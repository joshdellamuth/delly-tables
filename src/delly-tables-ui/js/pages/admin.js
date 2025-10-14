"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const adminExampleButton = document.getElementById("admin-button");
    function logToConsole() {
        console.log("Admin page button clicked.");
    }
    adminExampleButton === null || adminExampleButton === void 0 ? void 0 : adminExampleButton.addEventListener("click", () => {
        logToConsole();
    });
    // new Grid({
    //     columns: ["Name", "Email", "Phone"],
    //     data: [
    //         ["Alice", "alice@example.com", "555-1234"],
    //         ["Bob", "bob@example.com", "555-5678"],
    //         ["Charlie", "charlie@example.com", "555-9012"]
    //     ],
    //     search: true,
    //     pagination: {
    //         nextButton: true,
    //         prevButton: true,
    //         limit: 5
    //     },
    //     sort: true
    // }).render(document.getElementById("gridjs-table")!);
});
