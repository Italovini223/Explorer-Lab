import "./css/index.css"
import IMask from "imask";

//credit card
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");

//Form
const securityCode = document.querySelector("#security-code");
const expirationDate = document.querySelector("#expiration-date");
const cardNumber = document.querySelector("#card-number");
const carHolder = document.querySelector("#card-holder");
const addButton = document.querySelector("#add-card");




function setCardType(type) {
  
  const colors = {
    visa: ["#436D99", "2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType;


//CVC
const securityCodePattern = {
  mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern);

securityCodeMasked.on("accept", () => {
  const ccSecurity = document.querySelector(".cc-security .value");

  ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value;
});


//EXPIRATION
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },

    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
  },
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

expirationDateMasked.on("accept", () => {
  const ccExpiration = document.querySelector(".cc-expiration .value");

  ccExpiration.innerText = expirationDate.value.length === 0 ? "02/32" : expirationDate.value;
})


//CARD NUMBER
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardType: "visa",
    },

    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardType: "mastercard",
    },

    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")

    const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex))

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardType;
  setCardType(cardType)

  const ccNumber = document.querySelector(".cc-number");

  ccNumber.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value;
})


//BUTTON
addButton.addEventListener("click", () => {
  alert("cartão adicionado!"); 
});

//INPUT
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
})

//CARDHOLDER NAME
carHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value");

  ccHolder.innerText = carHolder.value.length === 0 ? "FULANO DA SILVA" : carHolder.value 

});
