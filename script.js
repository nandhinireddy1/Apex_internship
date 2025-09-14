const form = document.getElementById("transactionForm");
const list = document.getElementById("transactionList");
const filterCategory = document.getElementById("filterCategory");
const toggleTheme = document.getElementById("toggleTheme");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  const transaction = {
    id: Date.now(),
    title,
    amount,
    type,
    category,
    date: new Date().toLocaleDateString()
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  form.reset();
  renderTransactions();
  updateCharts();
});

// Render list
function renderTransactions() {
  list.innerHTML = "";
  const filter = filterCategory.value;
  transactions
    .filter(t => filter === "all" || t.category === filter)
    .forEach(t => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${t.title} (${t.category}) - ${t.type} - $${t.amount} </span>
        <span>${t.date}</span>
      `;
      list.appendChild(li);
    });
}

// Charts
let pieChart, barChart;
function updateCharts() {
  const expenses = transactions.filter(t => t.type === "expense");
  const income = transactions.filter(t => t.type === "income");

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  // Pie Chart
  if (pieChart) pieChart.destroy();
  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals),
        backgroundColor: ["#ff6b6b", "#feca57", "#54a0ff", "#1dd1a1", "#5f27cd"]
      }]
    }
  });

  // Bar Chart
  if (barChart) barChart.destroy();
  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels: ["Income", "Expenses"],
      datasets: [{
        label: "Amount",
        data: [income.reduce((a,b)=>a+b.amount,0), expenses.reduce((a,b)=>a+b.amount,0)],
        backgroundColor: ["#1dd1a1", "#ff6b6b"]
      }]
    }
  });
}

// Dark Mode
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Initial Load
renderTransactions();
updateCharts();
