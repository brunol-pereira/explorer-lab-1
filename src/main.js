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