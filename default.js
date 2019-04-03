var checked = [];
function add_buttons (){
    var el = document.querySelector('#board > div:nth-child(6) > div > .list-cards').children
    for(child of el){
        var cardId = child.querySelector('div.list-card-details.js-card-details > span > span').innerText;
        var before_button = child.querySelector('div.list-card-details.js-card-details > div.badges > span.js-badges');
        var button = document.createElement('span')
        button.onclick = function (event){addToChecked(this); event.stopPropagation(); return false};
        var div =  document.createElement('div');

        div.appendChild(button);
        button.innerHTML = '&#10004;'; 
        div.className = 'badge';
     
        before_button.insertAdjacentElement('beforeend', div);
        console.log(cardId); 
    }

}

setTimeout(add_buttons, 5000);
setTimeout(updateCards, 5000);
function addToChecked(e) {
    var parent_el = e.closest('div.list-card-details.js-card-details')
    var id = parent_el.querySelector(' span > span').innerText;
    // Already checked uncheck
    if (checked && checked.includes(id)) {
        checked = checked.filter(item => item !== id); 

    } else {
        checked.push(id);

    } 
    localStorage.setItem('binary_checked',JSON.stringify(checked));
    updateCards();
}

function updateCards() {
    var el = document.querySelector('#board > div:nth-child(6) > div > .list-cards').children ;
    checked = JSON.parse(localStorage.getItem('binary_checked'));
    if (!checked) {checked = [];}
    for(child of el){
        var cardId = child.querySelector('div.list-card-details.js-card-details > span > span').innerText;
        if (checked && checked.includes(cardId)) {
            child.style.border = "medium dashed green"; 
        } else
        {
            child.style.border = "unset"; 
        }  
    }
}


