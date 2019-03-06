function addToChecked(id) {
checked.push(id);
alert('arrived'); 
//localStorage.setItem('binary_checked',checked );
}

function updateCards() {
 checked = JSON.parse(localStorage.getItem('binary_checked'));

}
