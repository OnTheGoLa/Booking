const http = new easyHTTP

let selectedDays = []
let selectedAddOns = []

const UIremaining = document.querySelector('.remaining-balance')
const UIform = document.querySelector('.rental-form')

if( JSON.parse(sessionStorage.getItem('days')) == null){
    document.querySelector('.preloader').classList.remove('active')
    document.querySelector('.res-summary-page').classList.add('active')
} else{

let test = JSON.parse(sessionStorage.getItem('days'))
let form = JSON.parse(sessionStorage.getItem('form'))

console.log(form);

// API POST
test.forEach( e => {

    let thisDay = {
        Year: e.year,
        Month: e.month,
        Day: e.day,
        BusinessName: form.find(x => x.name == 'Business-Name').value
    }

    selectedDays.push(thisDay)
})

const dayAmount = selectedDays.length

selectedAddOns = form.find( x => x.addOns != undefined).addOns

http.post('https://api-2adx9.ondigitalocean.app/insert-many', selectedDays, function(e){

    document.querySelector('.preloader').classList.remove('active')
    document.querySelector('.res-summary-page').classList.add('active')

    document.querySelector('.pnr-code').textContent = e
    document.querySelector('.client-name').textContent = form.name
    document.querySelector('.client-email').textContent = form.email

    const daysWrapper = document.querySelector('[duo="days"]')
    const depositWrapper = document.querySelector('[duo="deposit"]')
    const addOnsWrapper = document.querySelector('[duo="add-ons"]')

    daysWrapper.innerHTML = ''
    depositWrapper.innerHTML = ''
    addOnsWrapper.innerHTML = ''

    selectedDays.forEach( e => {

        let div = document.createElement('div')

        div.innerHTML = `<p class="paragraph-15">${e.Month} ${e.Day}</p><p class="paragraph-15">($${form.dayCost}.00)</p>`
        div.classList.add('reservation-info-duo')

        daysWrapper.appendChild(div)

        let divTwo = document.createElement('div')

        divTwo.innerHTML = `<p class="paragraph-15">${e.Month} ${e.Day}</p><p class="paragraph-15">($150.00)</p>`
        divTwo.classList.add('reservation-info-duo')

        depositWrapper.appendChild(divTwo)
    })

    document.querySelector('.total-cost').textContent = `$${form.dayCost*selectedDays.length}.00`
    document.querySelector('.total-deposit').textContent = `$${150*selectedDays.length}.00`
    UIremaining.textContent = `$${form.dayCost*selectedDays.length - 150*selectedDays.length}.00`

    let addOnCost = 0

    selectedAddOns.forEach( e => {

        addOnCost += e.price*dayAmount

        let div = document.createElement('div')

        div.innerHTML = `<p class="paragraph-15">${e.name}</p><p class="paragraph-15">($${e.price}.00)x(${dayAmount})</p>`
        div.classList.add('reservation-info-duo')

        addOnsWrapper.appendChild(div)
    })

    document.querySelector('.add-on-cost').textContent = `$${addOnCost}.00`

    sessionStorage.removeItem('form')
    sessionStorage.removeItem('days')
})

//Form Submit
let formNew = form.filter(x => x.name != undefined)

formNew.forEach( e => {
    if(e.type != 'file'){

        UIform.querySelector(`[name='${e.name}']`).value = e.value
    }
})

UIform.submit()
}