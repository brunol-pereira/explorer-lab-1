import "./css/index.css" //importa o index.css (scriptVite - packge.json)
import IMask from "imask" //importa a framework imask

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path") //seleciona o 1° g
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path") //seleciona o 2° g

const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

// função para definir as cores de acordo com o bandeira(tipo) 
function setCardType(type){
    const colors = {
        visa: ["#436D99", "2D57F2"],
        mastercard: ["#DF6F29", "#C69347"],
        default: ["black", "gray"],
    }

    //preenche a cor de acordo com a bandeira(tipo), pegando os valores do array
    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])

    //inseri a logo de acordo com a bandeira(tipo)
    ccLogo.setAttribute("src", `cc-${type}.svg`) //faz uma interpolação, trocando apenas o nome da logo/bandeira
}

setCardType("default")

//CVC - aplicando máscara(formato) para recerber o input
const cvc = document.querySelector("#security-code")
const cvcPadrao = {
    mask: "000"
}
const cvcMasked = IMask(cvc, cvcPadrao)

//Data de validade- aplicando máscara(formato) para recerber o input
const DtVenc = document.querySelector("#expiration-date")
const DtVencPadrao = {
    mask: "MM{/}YY",
    blocks:{
        YY: {
            mask:IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to:String(new Date().getFullYear() + 10).slice(2),
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}
const DtVencMasked = IMask(DtVenc,DtVencPadrao)

//Número do cartão - aplicando máscara(formato) para recerber o input do numero do cartao e devolver sua bandeira
const cardNumber = document.querySelector("#card-number")
const cardNumberPadrao = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex:/^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex:/(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3,7]\d{0,2})\d{0,12}/,
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        }
    ],
    dispatch: function(appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g,"")

        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })

        return foundMask
    },
}

const cardMasked = IMask(cardNumber, cardNumberPadrao)

//botão "adicionar cartão"
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    alert("Cartao adicionado!")
})

//Não atualiza a página com submit
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

//Trocar o nome no cartão para o nome informado no formulário
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value 
})

//Trocar o cvc no cartão para o cvc informado no formulário
cvcMasked.on("accept", () => {
    updateCVC(cvcMasked.value);
})

function updateCVC(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}

//Trocar o número do cartão para o número informado no formulário
cardMasked.on("accept", () => {
    const cardType = cardMasked.masked.currentMask.cardtype
    setCardType(cardType)
    updateNumber(cardMasked.value);
})

function updateNumber(number) {
    const ccNumber = document.querySelector(".cc-number")
    
    ccNumber.innerText = number.length === 0 ? "1234 1234 1234 1234" : number
}

//Trocar a data de vencimento no cartão para a data de vencimento informado no formulário
DtVencMasked.on("accept", () => {
    updateDtVenc(DtVencMasked.value);
})

function updateDtVenc(data) {
    const ccDtVenc = document.querySelector(".cc-expiration .value")
    ccDtVenc.innerText = data.length === 0 ? "02/32" : data
}
