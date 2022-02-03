const date = new Date()
const currentDate = new Date()

let selectedDays = []
let selectedAddOns = []
let totalPrice = 0
let totalDayCost = 0
let totalDeposit = 0
let dayCost = 299
let monthSwitched = 0

let unavailableDays = []

const http = new easyHTTP;
var stripe = Stripe('pk_live_51HN0nqJ2ZoJfeJPy6PHSpQe5nBORTEfPgP2IvJthnBXGkgwGR5ErLsQhISXTFz9kvWQOP5l4tFUtP4on9IO5vJ4T00J1FzPitG');

function renderCalendar(){

    date.setDate(1)

    const monthDays = document.querySelector('.calendar-days')
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    const firstDayIndex = date.getDay()
    const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate()

    const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay()
    const nextDays = 7 - lastDayIndex - 1

    let days = ""

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]

    document.querySelector('.calendar-month').textContent = months[date.getMonth()]
    document.querySelector('.calendar-year').textContent = date.getFullYear()

    for( let x = firstDayIndex; x > 0; x--){
        days += `<div class='prev-month-day'><p class='date-paragraph'>${prevLastDay - x + 1}</p></div>`
    }

    for( let i = 1; i <= lastDay; i++){
        days += `<div class='current-month-day'><p class='date-paragraph'>${i}</p></div>`
    }

    for( let j = 1; j <= nextDays; j++){
        days += `<div class='next-month-day'><p class='date-paragraph'>${j}</p></div>`
    }

    monthDays.innerHTML = days

    getUnavailable(months[date.getMonth()], date.getFullYear())
}

function getUnavailable(month, year){

    unavailableDays = []

    http.get(`${URL}/find-element/Month/${month}`, function(e){

        let data = Object.values(e)

        let noOfTrucks = 0

        data.forEach( e => {

            if( e.Truck_Num != null ){

                noOfTrucks = e.Truck_Num

            }else{
                let duplicateNo = 0

                data.forEach( a => {

                    if(e.Day == a.Day){

                        duplicateNo++

                        if(duplicateNo == noOfTrucks){
                            console.log('gotten!')

                            let thisDay = {
                                year: a.Year.toString(),
                                month: a.Month.toString(),
                                day: a.Day.toString()
                            }

                            unavailableDays.push(thisDay)

                            data = dayRemoveV(data, a)
                        }

                    }
                
                })

            }
        })

        connectCalendar(month, year)
    })

}

function dayRemoveV(arr, value) { 
    
    return arr.filter(function(ele){ 

        if(ele.Day == value.Day){

            return false 
        } else{
            return true
        }
    });
}

function connectCalendar(month, year){

    if(date.getMonth() == currentDate.getMonth()){ 
        
        // Make the past days unavailable
        document.querySelectorAll('.current-month-day').forEach( e => {

            if( e.textContent <= currentDate.getDate()){
                e.classList.add('unavailable')
            }

        })
    
        // Disconnect far months
        document.querySelector('.calendar-arrow.left').classList.add('inactive')
    }else if( currentDate.getMonth() + 6 == date.getMonth() || currentDate.getMonth() - 6 == date.getMonth()){
        
        document.querySelector('.calendar-arrow.right').classList.add('inactive')
    }else{
        document.querySelector('.calendar-arrow.right').classList.remove('inactive')
        document.querySelector('.calendar-arrow.left').classList.remove('inactive')
    }

    unavailableDays.forEach( e => {

        document.querySelectorAll('.current-month-day').forEach( day => {

            if (day.textContent == e.day){
                day.classList.add('unavailable')
            }
        })
    })

    selectedDays = []

    if(sessionStorage.getItem('days') != null){

        let test = JSON.parse(sessionStorage.getItem('days'))

        test.forEach( e => {

            let thisDay = {
                year: e.year.toString(),
                month: e.month.toString(),
                day: e.day.toString()
            }

            selectedDays.push(thisDay)
        })
    }

    document.querySelectorAll('.current-month-day').forEach( e => {

        selectedDays.forEach(e => {
    
            if(e.month == month && e.year == year){

                let days = document.querySelectorAll('.current-month-day')

                for ( el of days){

                    if(el.textContent == e.day){

                        el.classList.add('selected-dark')
                        break;
                    }
                }
            }
        })

        // Unavailable and Selected days
        if(!e.classList.contains('unavailable')){
            
            let thisDay = {
                year: document.querySelector('.calendar-year').textContent,
                month: document.querySelector('.calendar-month').textContent,
                day: e.textContent
            }

            e.addEventListener('click', () => {
                
                e.classList.toggle('selected-dark')

                if(e.classList.contains('selected-dark')){
                    selectedDays.push(thisDay)
                    selectedDays.sort(function(a, b){return a.day-b.day})
                    
                } else{
                    selectedDays = dayRemove(selectedDays, thisDay)
                }

                sessionStorage.setItem('days', JSON.stringify(selectedDays))

                daysCost()
            })

        } else{
            
            e.innerHTML += '<div class="unavailable-popup"><p class="paragraph-8">Date<br>Unavailable</p><div class="triangle"></div></div>'
        }
    })

    
    if(monthSwitched == 0 && selectedDays.length != 0){

         if(!selectedDays.find(checkSelectedMonth, month)){

            document.querySelector('.calendar-arrow.right').click()
        } else{
        monthSwitched = 1
    }

    } 

    daysCost()

}

function checkSelectedMonth(day){
    return day.month == this
}

function checkAvailableDay(day){
    return day.classList.contains('unavailable') == 0
}

function formNavigate(btn){

    const currentPage = document.querySelector('.form-page.active')
    let currentValue = currentPage.getAttribute('page-no')

    let allAreFilled = true;
    const direction = btn.getAttribute('direction')

    currentPage.querySelectorAll("[required]").forEach(function(i) {
      if (!allAreFilled) return;
      if (!i.value) allAreFilled = false;
      if (i.type === "file") {
          if(i.getAttribute('data-value') != null){
              allAreFilled = true
          }
      }
      if (i.type === "radio") {
        let radioValueCheck = false;
        currentPage.querySelectorAll(`[name=${i.name}]`).forEach(function(r) {
          if (r.checked) radioValueCheck = true;
        })
        allAreFilled = radioValueCheck;
      }
    })

    switch (direction){

        case 'forward':

            if (!allAreFilled) {
                alert('Please fill all the required fields');
          
              } else{
          
                  if( currentValue == 1 ){
                      document.querySelector('.extra-block').classList.remove('active')  
                  }
          
                  document.querySelector('.form-page.active').classList.remove('active')
          
                  currentValue++

                  if(currentValue == 3){
                      btn.classList.add('hidden')
                      document.querySelector('.reserve-button').classList.add('active')
                  }

                  document.querySelectorAll(`[page-no='${currentValue}']`).forEach(e => {
                      e.classList.add('active')
                  })
          
                  if( currentValue == 1 ){
                      document.querySelector('.extra-block').classList.add('active') 
                      document.querySelector('.buttons').classList.add('hidden')
                  }else{
                      document.querySelector('.buttons').classList.remove('hidden')
                  }
          
              }
            break;

        case 'backward':
            
            document.querySelector('.form-page.active').classList.remove('active')

            if( currentValue == 3){
                document.querySelector('.reserve-button').classList.remove('active')
            }

            currentValue--

            document.querySelectorAll(`[page-no='${currentValue}']`).forEach(e => {
                e.classList.add('active')
            })
    
            if( currentValue == 1 ){
                document.querySelector('.extra-block').classList.add('active') 
                document.querySelector('.buttons').classList.add('hidden')
            }else{
                document.querySelector('.buttons').classList.remove('hidden')
    
            }
            break;

        case 'payment':

                 if (!allAreFilled) {
                alert('Please fill all the required fields');
          
                } else{
                    rememberForm()
          
                    stripe.redirectToCheckout({

                    lineItems: [{
                    price: 'price_1Jxm5wJ2ZoJfeJPyRrBL3mAi',
                quantity: selectedDays.length,
                    }],
                    mode: 'payment',
                //    payment_intent_data.metadata: {
                //  	'dates': selectedDays
                //},
                    successUrl: 'https://www.onthego.la/reservation-summary',
                    cancelUrl: 'https://www.onthego.la/book-now-v2',
                }).then(function (result) {
                window.alert('We are having an issue with your request. Please check your connection and try again.')
                });
                }
    }

}
 
function dayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 

        if(ele.day == value.day && ele.month == value.month && ele.year == value.year){

            return false 
        } else{
            return true
        }
    });
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

function addOns(btn){

    const price = parseInt(btn.parentElement.nextElementSibling.textContent.slice(1), 10)
    const name = btn.parentElement.previousElementSibling.previousElementSibling.textContent
    const place = document.querySelector('.addons')
    const className = btn.getAttribute('name')

    const div = document.createElement('div')
    
    div.innerHTML = `<p class="form-label small">${name}</p><p class="form-label small">($${price}.00) (x${selectedDays.length})</p>`
    div.classList.add('div-block-48')
    div.classList.add(`${className}`)

    if(btn.checked === true){
        place.appendChild(div)

        selectedAddOns.push({name, price})

        totalPrice += price*selectedDays.length
    }else{
        console.log('test');
        console.log(arrayRemove(selectedAddOns, {name, price}));
        arrayRemove(selectedAddOns, {name, price})
        
        if(document.querySelector(`.${className}`) != null){
            document.querySelector(`.${className}`).remove()
            totalPrice -= price*selectedDays.length
        }
    }

    console.log(btn);
    console.log(btn.checked);
    console.log(selectedAddOns);

    document.querySelector('.add-ons').textContent = `$${totalPrice}.00`

    let text = ''

    selectedAddOns.forEach( e => {

        text += `${e.name} / $${e.price} (x${selectedDays.length})-`
    })

    console.log(text);

    document.querySelector('[name="selected-add-ons"]').value = text
}

function daysCost(){

    const place = document.querySelector('.total-days')

    let dayAmount = selectedDays.length
    dayCost = 299

    if( dayAmount >= 7){
        dayCost = 270
    }

    if( dayAmount >= 10){
        dayCost = 250
    }

    totalDayCost = dayAmount*dayCost
    totalDeposit = dayAmount*150

    place.innerHTML = ''

    selectedDays.forEach( day => {

        const className = day.month + day.day
    
        const div = document.createElement('div')
        
        div.innerHTML = `<p class="form-label small">${day.month} ${day.day}</p><p class="form-label small">($${dayCost}.00)</p>`
        div.classList.add('div-block-48')
        div.classList.add(`${className}`)
    
        place.appendChild(div)
    })

    document.querySelectorAll('.total-cost').forEach(e => {

        e.textContent = `$${totalDayCost}.00`
    })

    document.querySelectorAll('.remaining-balance').forEach(e => {

        e.textContent = `$${(totalDayCost) + totalPrice - (totalDeposit)}.00`
    })

    document.querySelectorAll('.total-deposit').forEach(e => {

        e.textContent = `$${totalDeposit}.00`
    })

    document.querySelectorAll('.remaining-balance').forEach(e => {

        e.textContent = `$${(dayAmount*dayCost) + totalPrice - (dayAmount*150)}.00`
    })

    let text = ''

    selectedDays.forEach( e => {

        text += `${e.day}/${e.month}/${e.year} `
    })

    text += `at $${dayCost}`

    document.querySelector('.addons').innerHTML = ''
    selectedAddOns = []
    totalPrice = 0

    document.querySelectorAll('.addon-checkbox').forEach( e => {

        addOns(e.nextElementSibling)
    })

    document.querySelector('[name="selected-days"]').value = text
}

function rememberForm(){

    // let form = {

    //     days: selectedDays,
    //     addOns: selectedAddOns,
    //     dayCost: dayCost,

    //     name: 'a',
    //     businessName: 'a',
    //     businessInsta: 'a',
    //     email: '',
    //     phone: '',
    //     contactMethod: '',

    //     deposit: totalDeposit,
    //     totalDayCost: totalDayCost,
    // }
    let form = [

        {days: selectedDays},
        {addOns: selectedAddOns},
        {dayCost: dayCost},


    ]

    document.querySelectorAll('.rental-form [name]').forEach( e => {

        const name = e.getAttribute('name')
        let obj

        if(e.getAttribute('type') == 'checkbox' || e.getAttribute('type') == 'radio'){

            obj ={
                name: name,
                checked: e.checked
            }

        } else{

            obj = {
                name: name,
                value: e.value
            }
        }

        form.push(obj)
    })

    console.log(form);

    document.querySelectorAll('[name="contact-method"]').forEach( e => {

        if(e.checked){

            form.contactMethod = e.id
        }
    } )

    sessionStorage.setItem('form', JSON.stringify(form))
}

//Function calls
document.querySelectorAll('.addon-checkbox').forEach( e => {

    e.nextElementSibling.addEventListener('change', function(){
        addOns(e.nextElementSibling)
    })
})

document.querySelectorAll('.calendar-arrow').forEach( e => {

    e.addEventListener('click', function(){

        if(e.classList.contains('left')){
            date.setMonth(date.getMonth() - 1)
        } else{
            date.setMonth(date.getMonth() + 1)
        }

        renderCalendar()
    })
})

document.querySelectorAll('.checkout-button').forEach( e => {
    e.addEventListener('click', function(){
        formNavigate(e)

        window.scrollTo(0, 0);
    })
})

renderCalendar()
