import "./css/index.css" //importa o index.css (scriptVite - packge.json)

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

setCardType("visa")