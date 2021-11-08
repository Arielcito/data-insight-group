//Definiciones
//obtengo todos los inputs
let loading = true
let loadingDiv = document.querySelector("#loading")
spinner()
let checkboxs = document.querySelectorAll('input[type="checkbox"]')
let error = document.querySelector(`#error `)
let state = document.querySelector("#dropdown")
//Fetch API
let chamber = document.querySelector("#table-senate") ? "senate" : "house"
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
    let filtrados = miembros
    let statesArray = estadosSinRepetir(miembros)
    createTables(miembros)
    states(statesArray)
    //checkboxes
    checkboxs.forEach(checkbox => checkbox.addEventListener('change', () => filterPerParty(miembros)))
    //Dropdown
    state.addEventListener('change',() => filterPerParty(miembros))
    return miembros,filtrados,statesArray
}).catch(err => console.error(err.message))

//Funciones
//Generar tablas dinamicamente
function createTables(array){
    let tables = document.querySelector(`#table-senate tbody`) ? document.querySelector(`#table-senate tbody`): document.querySelector(`#table-house tbody`)
    tables.innerHTML =""
    error.innerHTML =''
    if(array.length > 0){
        array.forEach(array => {
            let segundoNombre = `${array.middle_name ? array.middle_name:""}`
            
            tables.innerHTML +=`
            <tr>
            <td><a href="${array.url}" class="link-secondary" target='_blank'>${array.last_name},${array.first_name}  ${segundoNombre}<a></td>
            <td>${array.party}</td>
            <td>${array.state}</td>
            <td>${array.seniority}</td>
            <td>${array.votes_with_party_pct}%</td>
            </tr>   
            
            `
            
        });
    }else{
        errorFunction()
    }
}
//Funcion error
function errorFunction(){
    error.innerHTML = `
    <div class="alert alert-danger" role="alert">
    This data doesnt exists!!
    </div>
    `
}

//Verifico cual esta seleccionado
function verificarSeleccion(){
    let checkboxValues = []
    checkboxs.forEach((checkbox) => {
        if (checkbox.checked) checkboxValues.push(checkbox.value)
    })
    return checkboxValues
}

//Defino cuantos estados hay y los guardo en un array
function estadosSinRepetir(array){
    let auxArray = array.map(miembro => miembro.state)
    let statesArray = auxArray.sort().filter((valor, indice) => {
        return auxArray.indexOf(valor) === indice
    })
    return statesArray
}

//Defino el dropdown y le guardo los valores del array
function states(array){
    array.forEach(array => {
        state.innerHTML +=`
        <option value="${array}">${array}</option>
        `
    })
}
function filterPerParty(array){
    let seleccion = verificarSeleccion()
    if(seleccion.length > 0 && state.value != "defaultValue"){
        filtrados = array.filter(miembro => seleccion.includes(miembro.party) && miembro.state === state.value)
        createTables(filtrados)
        return filtrados
    }else if(state.value === "defaultValue"){
        filtrados = array.filter(miembro => seleccion.includes(miembro.party))
        createTables(filtrados)
        return filtrados
    }else {
        createTables(filtrados)
    }
    
}
function spinner(){
    if(loading){
        loadingDiv.innerHTML = `
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-border" role="status" style="width: 3rem; height: 3rem;">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>   
                                </div>   
                        `
    }else{
        loadingDiv.innerHTML = ''
    }
}





