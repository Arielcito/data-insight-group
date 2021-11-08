//creo un objeto con todos los datos estadisticos
let stadistics = {
    democrats : [],
    republican : [],
    independents : [],
    mostLoyal : [],
    leastLoyal : [],
    mostEngaged : [],
    leastEngaged : []
}
let loading = true
let loadingDiv = document.querySelectorAll(".loading")
spinner()
function spinner(){
    if(loading){
        loadingDiv.forEach(spinner =>{
            spinner.innerHTML = `   <div class="d-flex justify-content-center">
                                        <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>   
                                    </div> 
                        `
        })
    }else{
        loadingDiv.forEach(spinner =>{

            spinner.innerHTML = ''
        })
    }
}
    
    
let chamber = document.querySelector("#table-senateGlance") ? "senate" : "house"
let API_URl = `https://api.propublica.org/congress/v1/113/${chamber}/members.json`

let init = {
  method: "GET",
  headers: {
    "X-API-KEY": "ipfYXKuplr4CrjRkJqCKRDK4fdNUDceR5fBHQrAe"
  }
}

fetch(API_URl,init)
    .then(res => res.json())
    .then(data => {
            const miembros = data.results[0].members

            loading = false
            spinner()
            //Defino cada key, las cuales van a ser arrays
            stadistics.democrats = miembros.filter(miembro => miembro.party === "D")
            stadistics.republican = miembros.filter(miembro => miembro.party === "R")
            stadistics.independents = miembros.filter(miembro => miembro.party === "ID")
            stadistics.mostEngaged = order(miembros,'most','missed_votes_pct')
            stadistics.leastEngaged = order(miembros,'least','missed_votes_pct')
            stadistics.mostLoyal = order(miembros,'least','votes_with_party_pct')
            stadistics.leastLoyal = order(miembros,'most','votes_with_party_pct')

            //Se llama a las funciones
            renderAtAGlance(stadistics,"table-houseGlance",miembros)
            renderAtAGlance(stadistics,"table-senateGlance",miembros)
            renderAtEngaged(stadistics,"table-leastEngaged",'leastEngaged')
            renderAtEngaged(stadistics,"table-mostEngaged",'mostEngaged')
            renderAtLoyalty(stadistics,"table-least",'leastLoyal')
            renderAtLoyalty(stadistics,"table-most",'mostLoyal')

            return miembros
    })
    .catch(err => console.error(err.message))

//Funciones
//funcion para calcular el promedio de votos con el partido
function calcularPromedio(array){
    let prom = 0
    let auxArray = []
    if(array != 0){
        array.forEach(array => {
            auxArray.push(array.votes_with_party_pct)
        })
        let sum = auxArray.reduce((a,b) => a+b)
        prom = sum / array.length
        return prom.toFixed(2)
    }else{
        return prom
    }
}
//Ordeno de menor a mayor o mayor a menos dependiendo lo que se pide(leastEngagement,mostEngagement)
function order(array,engagement,prop){
    let auxArray = array.filter(member => member.total_votes != 0)
    let limitIndex = Math.round(array.length/10)
    
    engagement === 'most' ? auxArray.sort((a,b)=> a[prop] - b[prop]):
    auxArray.sort((a,b)=> b[prop] - a[prop])
    
    return auxArray.slice(0,limitIndex)
}
//Funciones para renderizar
//Lleno la tabla de house at a glance con los datos
function renderAtAGlance(stadistics,id,array){
    const cuerpoTable = document.querySelector(`#${id} tbody`)
    if(cuerpoTable){

        cuerpoTable.innerHTML +=`
                            <tr><td>Democrats</td><td>${stadistics.democrats.length}</td>
                            <td>${calcularPromedio(stadistics.democrats)}&percnt;</td>
                            </tr>
                            <tr><td>Republicans</td><td>${stadistics.republican.length}</td>
                            <td>${calcularPromedio(stadistics.republican)}&percnt;</td>
                            <tr><td>independents</td><td>${stadistics.independents.length}</td>
                            <td>${calcularPromedio(stadistics.independents)}&percnt;</td>
                            <tr><td>Total</td><td>${array.length}</td>
                            <td>${calcularPromedio(array)}&percnt;</td>
                            </tr>
    `
    }
    
}
//render tablas engaged
function renderAtEngaged(array,id,engagement){
    const cuerpoTable = document.querySelector(`#${id} tbody`)
    if(cuerpoTable){
        array[engagement].forEach(array => {
            let segundoNombre = `${array.middle_name ? array.middle_name:""}`
            cuerpoTable.innerHTML +=`
            <tr><td><a href="${array.url}" class="link-secondary" target='_blank'>${array.last_name},${array.first_name}  ${segundoNombre} <a></td>
            <td>${array.missed_votes}</td>
            <td>${array.missed_votes_pct}&percnt;</td></tr>
            
            `
        }) 
    }
}
//render tablas loyalty
function renderAtLoyalty(array,id,engagement){
    const cuerpoTable = document.querySelector(`#${id} tbody`)
    if(cuerpoTable){
        array[engagement].forEach(array => {
            let segundoNombre = `${array.middle_name ? array.middle_name:""}`
            cuerpoTable.innerHTML +=`
            <tr><td><a href="${array.url}" class="link-secondary" target='_blank'>${array.last_name},${array.first_name}  ${segundoNombre} <a></td>
            <td>${Math.round(array.votes_with_party_pct*array.total_votes)/100}</td>
            <td>${array.votes_with_party_pct}&percnt;</td></tr>
            
            `
        }) 
    }
}



