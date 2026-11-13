// Function to use MutationObserver to wait for an element to exist in the DOM.
function ensureElement(selector, callback) {
  const element = document.querySelector(selector);
  if (element) {
    callback(element);
    return;
  }

  // It should succeed immediately, but if it fails, we wait for the form to load.
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector);
    if (element) {
      observer.disconnect();
      callback(element);
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "type"],
  });
}


// Handle referral codes for the newsletter form.
(() => {
  const queryRef = new URLSearchParams(window.location.search).get("ref");
  let savedRef;

  try {
    if (queryRef) {
      // We overwrite any existing referral.
      savedRef = queryRef;
      localStorage.setItem("ref", queryRef);

      // Now remove the referral from the URL.
      const url = new URL(window.location.href);
      url.searchParams.delete("ref");
      window.history.replaceState(null, "", url);
    } else {
      savedRef = localStorage.getItem("ref");
    }
  } catch (error) {
    console.error("Could not access the saved referral:", error);
  }

  // If there is a referral code, set it in the form.
  if (savedRef) {
    ensureElement('.emailoctopus-form .main-form [eo-label="Referral"] input', (input) => {
      input.value = savedRef;
    });

  }
})();

// Handle autocomplete for the shop field on the newsletter form.
ensureElement('.emailoctopus-form .main-form [eo-label="Shop"] input[type="text"]', (input) => {
  input.setAttribute('list', 'ftc-shops');
});

// Set min max and step on FinalYear field
ensureElement('.emailoctopus-form .main-form [eo-label="Final Year"] input[type="number"]', (input) => {
  input.setAttribute('min', '1900');
  input.setAttribute('max', new Date().getFullYear());
  input.setAttribute('step', '1');
});

// Set test of five digits for Zip Code
ensureElement('.emailoctopus-form .main-form [eo-label="Zip Code"] input[type="text"]', (input) => {
  input.setAttribute('pattern', '\\d{5}');
});