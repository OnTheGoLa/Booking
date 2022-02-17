const http = new easyHTTP

let selectedDays = []
let selectedAddOns = []
let addOnCost
let PNR

const UIremaining = document.querySelector('.remaining-balance')
const UIform = document.querySelector('.rental-form')

if( JSON.parse(sessionStorage.getItem('submitted')) == 1){
    placeholder()
    
} else{

let form = JSON.parse(sessionStorage.getItem('form'))

placeholder()

http.post('https://api-2adx9.ondigitalocean.app/insert-many', selectedDays, function(e){

    document.querySelector('.preloader').classList.remove('active')
    document.querySelector('.res-summary-page').classList.add('active')

    window.sessionStorage.setItem('pnr', e)
    
    //Form Submit
    let formNew = form.filter(x => x.name != undefined)
    
    formNew.forEach( e => {

        if(e.name != 'file-2'){

            if(UIform.querySelector(`[name='${e.name}']`).getAttribute('type') == 'radio'){
    
                document.querySelectorAll(`[name='${e.name}']`).forEach( a => {
                    if(e.checked == true){
                        a.checked = true
                    }
                })
            } else if(UIform.querySelector(`[name='${e.name}']`).getAttribute('type') == 'checkbox'){
                document.querySelectorAll(`[name='${e.name}']`).forEach( a => {
                    if(e.checked == true){
                        a.checked = true
                    }
                })
            } else{
    
                console.log(e);
                if(UIform.querySelector(`[name='${e.name}']`).getAttribute('type') != 'file'){
                    
                    UIform.querySelector(`[name='${e.name}']`).value = e.value
                }
            }
        }


    })

    //Extra fields
    const dayAmount = selectedDays.length
    let dayCost = form.find(x=>x.dayCost != undefined).dayCost

    const UIaddons = document.getElementById('addons')
    const UIdeposit = document.getElementById('deposit')
    const UIremaining = document.getElementById('remaining')
    const UIpaid = document.getElementById('paid')
    const UItotal = document.getElementById('total')

    selectedAddOns = form.find( x => x.addOns != undefined).addOns

    UIaddons.value = ''

    selectedAddOns.forEach( e => {

        UIaddons.value += `${e.name} at ${e.price} for ${dayAmount} days,`
    })

    UIaddons.value += `for a total of ${addOnCost}`

    UIdeposit.value = `$${dayAmount*150}`

    UIremaining.value = `${dayCost*selectedDays.length + addOnCost - 150*selectedDays.length}`

    UIpaid.value = `${150*selectedDays.length}`
    
    UItotal.value = `${dayCost*selectedDays.length}`
    
    window.sessionStorage.setItem('submitted', 1)

    UIform.querySelector('.reserve-button').click()
})

}

function placeholder(){
    let form = JSON.parse(sessionStorage.getItem('form'))
    let test = JSON.parse(sessionStorage.getItem('days'))

    document.querySelector('.preloader').classList.remove('active')
    document.querySelector('.res-summary-page').classList.add('active')

    document.querySelector('.pnr-code').textContent = window.sessionStorage.getItem('pnr')
    document.querySelector('.client-name').textContent = form.find(x => x.name == 'Business-Name').value
    document.querySelector('.client-email').textContent = form.find(x => x.name == 'Email').value
    
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

    const daysWrapper = document.querySelector('[duo="days"]')
    const depositWrapper = document.querySelector('[duo="deposit"]')
    const addOnsWrapper = document.querySelector('[duo="add-ons"]')

    daysWrapper.innerHTML = ''
    depositWrapper.innerHTML = ''
    addOnsWrapper.innerHTML = ''

    let dayCost = form.find(x=>x.dayCost != undefined).dayCost

    selectedDays.forEach( e => {

        let div = document.createElement('div')

        div.innerHTML = `<p class="paragraph-15">${e.Month} ${e.Day}</p><p class="paragraph-15">($${dayCost}.00)</p>`
        div.classList.add('reservation-info-duo')

        daysWrapper.appendChild(div)

        let divTwo = document.createElement('div')

        divTwo.innerHTML = `<p class="paragraph-15">${e.Month} ${e.Day}</p><p class="paragraph-15">($150.00)</p>`
        divTwo.classList.add('reservation-info-duo')

        depositWrapper.appendChild(divTwo)
    })

    document.querySelector('.total-cost').textContent = `$${dayCost*selectedDays.length}.00`
    document.querySelector('.total-deposit').textContent = `$${150*selectedDays.length}.00`

    addOnCost = 0

    selectedAddOns.forEach( e => {

        addOnCost += e.price*dayAmount

        let div = document.createElement('div')

        div.innerHTML = `<p class="paragraph-15">${e.name}</p><p class="paragraph-15">($${e.price}.00)x(${dayAmount})</p>`
        div.classList.add('reservation-info-duo')

        addOnsWrapper.appendChild(div)
    })

    UIremaining.textContent = `$${dayCost*selectedDays.length + addOnCost - 150*selectedDays.length}.00`

    document.querySelector('.add-on-cost').textContent = `$${addOnCost}.00`
}