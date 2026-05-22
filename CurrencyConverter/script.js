// ============================================================
// STEP 1: GRAB DOM ELEMENTS
// ============================================================
// We grab all the HTML elements we need ONCE at the top.
// Storing them in variables means we don't have to search
// the DOM every single time we need them. Searching the DOM
// repeatedly is slow and wasteful — do it once, store it, reuse it.

const amountInput = document.getElementById('amount');
// getElementById finds the <input id="amount"> element.
// We'll read the user's typed value from this later.

const fromSelect = document.getElementById('from');
// Finds the <select id="from"> dropdown.
// .value on a select gives the currently selected option's value (e.g. "USD").

const toSelect = document.getElementById('to');
// Finds the <select id="to"> dropdown.
// Same as above — gives us the target currency like "INR".

const btn = document.querySelector('.get-exchange-btn');
// querySelector finds the FIRST element matching a CSS selector.
// We use it here because the button has a class, not an id.
// '.get-exchange-btn' means: find element with class "get-exchange-btn".

const resultDiv = document.querySelector('.result');
// This is the empty <div class="result"> in HTML.
// We'll write the conversion result text into this div.


// ============================================================
// STEP 2: POPULATE CURRENCY DROPDOWNS ON PAGE LOAD
// ============================================================
// Instead of hardcoding 150+ <option> tags in HTML manually
// like a caveman, we fetch the currency list from the API
// and build the options dynamically with JavaScript.
// This function runs ONCE when the page loads.

async function populateCurrencies() {
    // 'async' means this function contains code that takes time (API call).
    // JavaScript won't freeze the page while waiting — it handles it async.

    try {
        // 'try' means: attempt the following risky code.
        // If anything inside fails (network down, API dead), jump to 'catch'.

        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // fetch() sends an HTTP GET request to the URL — like opening it in a browser.
        // It returns a Promise (a future value — not ready yet).
        // 'await' pauses THIS function until the Promise resolves.
        // 'response' now holds the raw HTTP response object.
        // We use USD as base just to get the full list of currency codes.

        const data = await response.json();
        // .json() reads the response body and converts it from raw JSON text
        // into a real JavaScript object we can work with.
        // Also async — also needs 'await'.
        // 'data' now looks like: { base: "USD", rates: { INR: 83.4, EUR: 0.91, ... } }

        const currencies = Object.keys(data.rates);
        // data.rates is an object: { INR: 83.4, EUR: 0.91, AUD: 1.53, ... }
        // Object.keys() extracts just the keys into an array: ['INR', 'EUR', 'AUD', ...]
        // These keys ARE the currency codes — exactly what we need for our dropdowns.

        currencies.forEach(currency => {
            // forEach loops over every currency code in the array.
            // 'currency' is the current item in each iteration (e.g. "INR", "EUR", etc.)

            // --- Build option for FROM dropdown ---
            const optionFrom = document.createElement('option');
            // createElement creates a real HTML element in memory: <option></option>
            // It's not in the page yet — just sitting in memory.

            optionFrom.value = currency;
            // Sets the value attribute: <option value="INR">

            optionFrom.textContent = currency;
            // Sets the visible text inside the tag: <option value="INR">INR</option>

            fromSelect.appendChild(optionFrom);
            // appendChild adds this <option> inside the <select id="from"> element.
            // NOW it appears in the dropdown on the page.

            // --- Build option for TO dropdown ---
            // Exact same process — creating a separate option element for the TO select.
            // We can't reuse optionFrom because a DOM element can only have ONE parent.
            const optionTo = document.createElement('option');
            optionTo.value = currency;
            optionTo.textContent = currency;
            toSelect.appendChild(optionTo);
        });

        // Set default selected values after all options are added.
        fromSelect.value = 'USD';
        // This finds the <option value="USD"> inside fromSelect and marks it as selected.

        toSelect.value = 'INR';
        // Same — pre-selects INR in the TO dropdown. Most users in India will want this.

    } catch (error) {
        // If fetch failed, .json() failed, or anything else threw an error — land here.
        resultDiv.textContent = 'Failed to load currencies. Check your connection.';
        // Show a human-readable message so the user isn't staring at a blank dropdown.

        console.error(error);
        // Log the actual technical error in browser DevTools console.
        // This is for YOU the developer to debug — not for the user to see.
    }
}


// ============================================================
// STEP 3: FETCH EXCHANGE RATE FROM API
// ============================================================
// This is a pure utility function — it ONLY fetches and returns the rate.
// It doesn't touch the DOM, doesn't validate, doesn't display anything.
// One job. Does it well. That's good code design.

async function getExchangeRate(from, to) {
    // Takes two arguments: the base currency and the target currency.
    // e.g. getExchangeRate("USD", "INR")

    const url = `https://api.exchangerate-api.com/v4/latest/${from}`;
    // Template literal — backticks allow embedding variables with ${}.
    // If from = "USD", url becomes: "https://api.exchangerate-api.com/v4/latest/USD"
    // This API endpoint returns rates for 1 unit of the base currency (from).

    const response = await fetch(url);
    // Send the HTTP request to the constructed URL.
    // Wait for the server to respond before moving to next line.

    const data = await response.json();
    // Parse the response body as JSON into a JS object.
    // data.rates will contain all currency conversion rates relative to 'from'.

    return data.rates[to];
    // data.rates is { INR: 83.4, EUR: 0.91, AUD: 1.53, ... }
    // data.rates[to] — if to = "INR", this returns 83.4
    // That means: 1 USD = 83.4 INR
    // We return this single number to whoever called this function.
}


// ============================================================
// STEP 4: HANDLE THE FULL CONVERSION FLOW
// ============================================================
// This is the main function — it reads inputs, validates,
// calls the API, calculates, and displays the result.
// It's async because it calls getExchangeRate which uses await.

async function handleConversion() {

    // --- Read user inputs ---
    const amount = parseFloat(amountInput.value);
    // amountInput.value always returns a STRING, even for number inputs.
    // parseFloat() converts it to a decimal number.
    // "100" → 100 | "" → NaN | "abc" → NaN | "0" → 0

    const from = fromSelect.value;
    // Gets the currently selected option's value from the FROM dropdown.
    // e.g. "USD"

    const to = toSelect.value;
    // Gets the currently selected option's value from the TO dropdown.
    // e.g. "INR"

    // --- Validate the amount ---
    if (isNaN(amount) || amount <= 0) {
        // isNaN() returns true if the value is Not a Number — catches empty input and letters.
        // amount <= 0 catches zero and negative numbers — meaningless to convert.
        // || means OR — if EITHER condition is true, show error and stop.

        resultDiv.textContent = 'Enter a valid positive amount.';
        // Show error message directly in the result div.

        return;
        // EXIT the function immediately.
        // Without this return, code would keep running and try to fetch the API
        // with garbage data. Never let invalid data reach your API call.
    }

    // --- Show loading state ---
    resultDiv.textContent = 'Fetching rate...';
    // API call takes 200ms - 2s depending on network.
    // Without this, the user sees nothing and thinks the button is broken.
    // This gives immediate feedback: "yes, I heard your click, I'm working on it."

    // --- Fetch, calculate, display ---
    try {
        const rate = await getExchangeRate(from, to);
        // Call our utility function and WAIT for it to return the rate number.
        // e.g. if from="USD", to="INR" → rate = 83.4

        const converted = (amount * rate).toFixed(2);
        // Multiply user's amount by the exchange rate.
        // e.g. 100 * 83.4 = 8340
        // .toFixed(2) rounds to 2 decimal places and returns a STRING.
        // e.g. 8340.333333 → "8340.33"

        resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
        // Display the final result in the result div.
        // Template literal builds: "100 USD = 8340.33 INR"

    } catch (error) {
        // If getExchangeRate throws (network failure, bad response, etc.) — land here.
        resultDiv.textContent = 'API error. Check console.';
        // Tell the user something went wrong without dumping a technical error on them.

        console.error(error);
        // Log the real error in DevTools for you to debug.
    }
}


// ============================================================
// STEP 5: ATTACH EVENT LISTENER TO BUTTON
// ============================================================

btn.addEventListener('click', function(e) {
    // addEventListener watches for a specific event ('click') on the button.
    // When the button is clicked, it calls the function we pass here.

    e.preventDefault();
    // The button is type="submit" inside a <form>.
    // By default, submitting a form RELOADS the page — wiping everything.
    // preventDefault() stops that default browser behavior.
    // Without this line: page reloads, result disappears, user is confused.

    handleConversion();
    // Call our main function to start the whole conversion flow.
});


// ============================================================
// STEP 6: RUN populateCurrencies ON PAGE LOAD
// ============================================================

populateCurrencies();
// This line runs immediately when the script loads.
// It triggers the async function to fetch currencies and fill the dropdowns.
// By the time the user touches anything, the dropdowns are already populated.