const date = new Date()

function renderCalendar(){
    date.setDate(1)

    const monthDays = document.querySelector('.calendar-days')
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
    const firstDay = date.getDate()

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

    connectCalendar()
    getUnavailable(months[date.getMonth()])
}

console.log(13);

let selectedDays = []

function connectCalendar(){


    document.querySelectorAll('.current-month-day').forEach( e => {

        //TEST

        // for...of
        if(e.textContent == 17){
            e.classList.add('unavailable')
        }

        // Unavailable and Selected days
        if(!e.classList.contains('unavailable')){
            
            let thisDay = {

                year: document.querySelector('.calendar-year').textContent,
                month: document.querySelector('.calendar-month').textContent,
                day: e.textContent
            }

            e.addEventListener('click', () => {
                
                e.classList.toggle('selected')

                if(e.classList.contains('selected')){
                    selectedDays.push(thisDay)
                    selectedDays.sort(function(a, b){return a.day-b.day})
                    
                } else{
                    selectedDays = arrayRemove(selectedDays, thisDay)
                }

                console.log(selectedDays);
                sessionStorage.setItem('days', JSON.stringify(selectedDays))

            })

        } else{
            
            e.innerHTML += '<div class="unavailable-popup"><p class="paragraph-8">Date<br>Unavailable</p><div class="triangle"></div></div>'
        }
    })
}
 
function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele != value; 
    });
}

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

// API Calls
const http = new easyHTTP;

function getUnavailable(month){

    http.get(`${URL}/find-element/month/${month}`, function(e){

        console.log(e);
    })

}

renderCalendar()
