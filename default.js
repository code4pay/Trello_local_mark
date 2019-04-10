var checked = {};
var currentCards = [];
var cardsWithButtons= [];
// Initial delay to allow page to fully load 

function icon (color){
	
return `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
width="25" height="25"
viewBox="0 0 192 192"
style=" fill:#000000;"><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M0,192v-192h192v192z" fill="none"></path><g fill="${color}"><g id="surface1"><path d="M24,24v144h144v-94.875l-12,12v70.875h-120v-120h118.875l12,-12zM163.6875,43.6875l-67.6875,67.6875l-25.6875,-25.6875l-8.625,8.625l30,30l4.3125,4.125l4.3125,-4.125l72,-72z"></path></g></g></g></svg>`;
}

var unset_icon = icon('#ECF0F1'); 
var warning_icon = icon('#E67E22');
var checked_icon = icon('#1ABC9C');

setTimeout(start, 5000);


function start () {
   add_buttons();
   updateCards();
   setInterval(add_buttons, 25000);
   setInterval(updateCards, 25000);
}

function add_buttons (){
    var el = document.querySelector('#board > div:nth-child(6) > div > .list-cards').children
    for(child of el){
        var cardId = child.querySelector('div.list-card-details.js-card-details > span > span').innerText;
		var hasButton = child.querySelector('div.list-card-cover > div.binary_check')
		if (!hasButton) {
			var before_button = child.querySelector('div.list-card-cover');
			var button = document.createElement('span');
			button.onclick = function (event){addToChecked(this); event.stopPropagation(); return false};
			var div =  document.createElement('div');
			div.appendChild(button);
			button.innerHTML = unset_icon;
			div.className = 'binary_check';
			before_button.insertAdjacentElement('beforeend', div);
		
		}
     
   }
}



function addToChecked(e) {
    var parent_el = e.closest('a.list-card')
    var id = parent_el.querySelector('div.list-card-details.js-card-details > span > span').innerText;
    // Already checked uncheck
    if (checked && checked.hasOwnProperty(id) && !checked[id].reReview) {
        delete checked[id];
 
    } else {
		if (!checked.hasOwnProperty(id)) {
		checked[id] = {};
	 }
        checked[id].checkedDate = new Date();
		checked[id].reReview = false;
    } 
	localStorage.setItem('binary_checked',JSON.stringify(checked));
    updateCards();
}


function updateCards() {
    var el = document.querySelector('#board > div:nth-child(6) > div > .list-cards').children ;

   	var dataStore = JSON.parse(localStorage.getItem('binary_checked'));

	//Initial swith from old style storage as array
	if ( Object.prototype.toString.call(dataStore) === '[object Array]') {
		console.log('isArray');
		dataStore.forEach(function(element) {
			checked[element] = {};
			checked[element].checkedDate = new Date();
		});
	} else {
    	checked = dataStore;
	}
						  
		
	if (!checked) {checked = {};}
	for(child of el){
        var cardId = child.querySelector('div.list-card-details.js-card-details > span > span').innerText;
	    var button = child.querySelector('div.list-card-cover > div.binary_check > span')
		console.log(cardId);
		if (checked.hasOwnProperty(cardId)) {  //Has been checked. 
            button.innerHTML = checked_icon
			if (checked[cardId].checkedDate && !checked[cardId].reReview) { 
					card_updated(child, cardId, checked[cardId].checkedDate);  // See if the card has moved from the Needs Review column since it has been last checked.
			}else if (checked[cardId].checkedDate && checked[cardId].reReview) { // Card was marked as needing re Review on a previous run 
			 	button.innerHTML = warning_icon	
			}
		} else { // Hasn't been checked
             button.innerHTML = unset_icon; 
		}  
    }
	//Todo remove cards no longer on board.
	currentCards.forEach(function(cardId) {
		//if(!checked.hasOwnProperty(cardId)) { delete checked[cardId]; } 
	});
	
}

//document.querySelector('#board > div:nth-child(6) > div > div.list-cards.u-fancy-scrollbar.u-clearfix.js-list-cards.js-sortable.ui-sortable > a:nth-child(4)')

// check if card has needs reviewing again ie it has left needs-review and come back again

function card_updated (child, id, markedDate ) {
   	var url = child.href+'.json';
	console.log('Checking Update: '+ id);
	fetch(url)
		.then(function(response) {
				return response.json();
				})
	.then(function(card) {

			if (card.dateLastActivity > markedDate ) {
						
			card.actions.find(function(action){ 
				
				if (action.date > markedDate && action.data.hasOwnProperty('listAfter') && action.data.listAfter.name == "Needs Review") {
					var button = child.querySelector('div.list-card-cover > div.binary_check > span')
					button.innerHTML = warning_icon		
					checked[id].reReview = true;
					localStorage.setItem('binary_checked',JSON.stringify(checked));	
					return true	
					}});
				
			}

			});

}




