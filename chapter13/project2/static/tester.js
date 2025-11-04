document.addEventListener("DOMContentLoaded", function() {

    const myForm = document.querySelector("#stockForm");
    const stockSym = document.querySelector("#symbol");
    const msg = document.querySelector("#notifier");
    const companyDisplay = document.querySelector("#companyJson");

    // POST/PUT/DELETE buttons
    document.querySelector("#btnInsert").addEventListener('click', postData );
    document.querySelector("#btnUpdate").addEventListener('click', putData );
    document.querySelector("#btnDelete").addEventListener('click', deleteData );

    // GET company on page load or when symbol changes
    stockSym.addEventListener('change', () => getCompany(stockSym.value));
    getCompany(stockSym.value);

    async function getCompany(symbol) {
        try {
            const resp = await fetch(`/api/companies/${symbol}`);
            if (!resp.ok) {
                companyDisplay.textContent = "Company not found";
                return;
            }
            const data = await resp.json();
            companyDisplay.textContent = JSON.stringify(data, null, 2);
        } catch (err) {
            companyDisplay.textContent = "Error fetching company";
        }
    }

    async function postData(e) {
        e.preventDefault();
        const data = await fetchData("/api/companies", 'POST'); 
        msg.textContent = `Inserted company: ${data.symbol} - ${data.company}`;
        getCompany(data.symbol);
    }

    async function putData(e) {
        e.preventDefault();
        const data = await fetchData("/api/companies/" + stockSym.value, 'PUT'); 
        msg.textContent = data ? `Updated company: ${data.symbol} - ${data.company}` : "Company not found";
        getCompany(stockSym.value);
    }

    async function deleteData(e) {
        e.preventDefault();
        const data = await fetchData("/api/companies/" + stockSym.value, 'DELETE'); 
        msg.textContent = data ? `Deleted company: ${data.symbol} - ${data.company}` : "Company not found";
        companyDisplay.textContent = "Company deleted";
    }

    async function fetchData(url, method) {
        try {
            let formData = new FormData(myForm);
            const encData = new URLSearchParams();
            for (let pair of formData) {
                encData.append(pair[0], pair[1]);
            }

            const options = {
                method: method,
                mode: 'cors',
            };

            if (method === 'POST' || method === 'PUT') {
                options.body = encData;
            }

            const resp = await fetch(url, options);
            return await resp.json();
        } catch (err) {
            console.log('fetch error err=' + err);
        }
    }
});
