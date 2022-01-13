const http = new easyHTTP
const postTab = document.querySelector('.days-addition-bar')

http.get('https://api-2adx9.ondigitalocean.app/find', function(e){
    console.log(e);

    let data = Object.values(e)

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

    data.sort(function(a, b) {
        return a.Day - b.Day;
    })

    data.sort(function(a, b) {
        return months.indexOf(a.Month) - months.indexOf(b.Month);
    })

    data.sort(function(a, b) {
        return a.Year - b.Year;
    })

    const container = document.querySelector('.days-wrapper')

    let html = ''

    data.forEach( day => {
        
        if(day.Truck_Num == null){

            html += `<div class="day-wrapper"><div class="day-info"><p class="mb-0"><span class="date-day">${day.Day}</span>/<span class="date-month">${day.Month}</span>/<span class="date-year">${day.Year}</span></p><div class="admin-addons"><p class="mb-0">brevery-event</p><p class="mb-0">brevery-event</p><p class="mb-0">brevery-event</p></div><p class="mb-0 admin-business-name">${day.BusinessName}</p><p class="mb-0 admin-pnr">${day.PNR}</p></div><div class="day-functions"><div class="html-embed-3 w-embed"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-trash" width="30" height="30" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ff2825" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <line x1="4" y1="7" x2="20" y2="7"></line>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
          </svg></div></div></div>`
        } else{
            document.querySelector('.truck-no').textContent = day.Truck_Num
        }
    })
    container.innerHTML = html

    document.querySelectorAll('.icon-tabler-trash').forEach( e => {
        e.addEventListener('click', () => { deleteDay(e)})
    })
})

populateDays()

// Functions
function changeTruckNo(e){

    let no = Number(document.querySelector('.truck-no').textContent)

    let array = [{
        Key: "Truck_Num",
        Truck_Num: no
    }]

    switch(e.getAttribute('truck-man')){

        case 'minus':
            no--
            break;
            
        case 'plus':
            no++
            break;
    }

    array.push({
        Key: "Truck_Num",
        Truck_Num: no
    })

    http.put('https://api-2adx9.ondigitalocean.app/update', array, function(){
        document.querySelector('.truck-no').textContent = no
    })
}

function populateDays(){
    const daySelect = document.getElementById('day')

    let html = `<option value="">Select Day</option>`

    for ( let i=1; i < 32; i++ ){

         html += `<option value="${i}">${i}</option>`
    }

    daySelect.innerHTML = html
}

function addDay(){

    const container = document.querySelector('.days-addition-bar')
    const day = container.querySelector('[name="day"]').value
    const month = container.querySelector('[name="month"]').value
    const year = container.querySelector('[name="year"]').value
    let businessName = container.querySelector('[name="businessName"]').value

    if(businessName == ''){
        businessName = 'no-name-entered'
    }

    const selectedDay = {
        Day: day,
        Month: month,
        Year: year,
        BusinessName: businessName,
    }

    http.post('https://api-2adx9.ondigitalocean.app/insert', selectedDay, function(e){
        console.log(selectedDay);

        alert('The day has been succesfully booked')

    })
}

function blockDay(){

    let no = Number(document.querySelector('.truck-no').textContent)

    const container = document.querySelector('.days-addition-bar')
    const day = container.querySelector('[name="day"]').value
    const month = container.querySelector('[name="month"]').value
    const year = container.querySelector('[name="year"]').value
    let businessName = container.querySelector('[name="businessName"]').value

    if(businessName == ''){
        businessName = 'no-name-entered'
    }

    let arr = []

    const selectedDay = {
        Day: day,
        Month: month,
        Year: year,
        BusinessName: businessName,
    }

    for (let i = 0; i < no; i++) {
        
        arr.push(selectedDay)
    }

    http.post('https://api-2adx9.ondigitalocean.app/insert-many', arr, function(e){

        console.log(arr);

        alert('The day has been succesfully blocked')
   })

}

function deleteDay(e){

    const container = e.parentElement.parentElement.parentElement

    const day = container.querySelector('.date-day').textContent
    const month = container.querySelector('.date-month').textContent
    const year = container.querySelector('.date-year').textContent
    const PNR = container.querySelector('.admin-pnr').textContent
    const businessName = container.querySelector('.admin-business-name').textContent

    http.delete(`https://api-2adx9.ondigitalocean.app/delete-one-business/${day}/${month}/${businessName}/${year}/${PNR}`, () => {

        container.remove()
    })
}

// EVENT LISTENERS
document.querySelector('.open-post-tab').addEventListener('click', () => {
    if(postTab.classList.contains('active')){
        postTab.classList.remove('active')
    } else{
        postTab.classList.add('active')
    }
})

document.querySelector('.block').addEventListener('click', blockDay)

document.querySelectorAll('.truck-no-m').forEach(e => {
    e.addEventListener('click', a => {
        changeTruckNo(e)
    })
})

document.querySelector('[name="post-day"]').addEventListener('click', addDay)

