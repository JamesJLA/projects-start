document.addEventListener("DOMContentLoaded", () => {
  const users = JSON.parse(userContent); // from your users JSON string
  const stocks = JSON.parse(stockContent); // from your stocks-complete JSON string

  const userList = document.querySelector(".UserList ul");
  const detailsSection = document.querySelector(".Details");

  detailsSection.style.display = "none";

  users.forEach(userObj => {
    const li = document.createElement("li");
    li.textContent = `${userObj.user.firstname} ${userObj.user.lastname}`;
    li.dataset.userId = userObj.id; // For later reference
    userList.appendChild(li);
  });

  userList.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;

    const userId = parseInt(li.dataset.userId);
    const selectedUser = users.find(u => u.id === userId);
    if (!selectedUser) return;

    detailsSection.style.display = "block";

    document.getElementById("userID").value = userId;
    document.getElementById("firstname").value = selectedUser.user.firstname;
    document.getElementById("lastname").value = selectedUser.user.lastname;
    document.getElementById("address").value = selectedUser.user.address;
    document.getElementById("city").value = selectedUser.user.city;
    document.getElementById("email").value = selectedUser.user.email;

    const listPortfolio = document.getElementById("listPortfolio");
    listPortfolio.innerHTML = ''; 


    selectedUser.portfolio.forEach((stock, index) => {
      if (stock.owned <= 0) return; // Skip negative or zero holdings

      const symbolDiv = document.createElement("div");
      symbolDiv.textContent = stock.symbol;

      const sharesDiv = document.createElement("div");
      sharesDiv.textContent = stock.owned;

      const actionDiv = document.createElement("div");
      const viewBtn = document.createElement("button");
      viewBtn.textContent = "View";
      viewBtn.dataset.symbol = stock.symbol;
      viewBtn.classList.add("view-button");
      actionDiv.appendChild(viewBtn);

      listPortfolio.appendChild(symbolDiv);
      listPortfolio.appendChild(sharesDiv);
      listPortfolio.appendChild(actionDiv);
    });
  });

  document.getElementById("listPortfolio").addEventListener("click", (event) => {
    if (!event.target.classList.contains("view-button")) return;

    const symbol = event.target.dataset.symbol;

    const stockInfo = stocks.find(s => s.symbol === symbol);
    if (!stockInfo) {
      alert(`No stock info found for symbol: ${symbol}`);
      return;
    }

    document.getElementById("stockName").textContent = stockInfo.name;
    document.getElementById("stockSector").textContent = stockInfo.sector;
    document.getElementById("stockIndustry").textContent = stockInfo.subIndustry;
    document.getElementById("stockAddress").textContent = stockInfo.address;

    const logo = document.getElementById("logo");
    logo.src = `logos/${symbol}.svg`;
    logo.alt = `${symbol} logo`;

  });
});


