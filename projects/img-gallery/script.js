let images = [
    '<img src="img/asia-bigger.png">',
    '<img src="img/sunshine-bigger.png">',
    '<img src="img/tree-bigger.png">',
    '<img src="img/train-bigger.png">',
    '<img src="img/homeless-bigger.png">'
]
let photot = document.getElementById('div');
function check(){
    let x = Math.floor(Math.random()*10);
    if(x<='10'&&x>'8'){
        photot.innerHTML = `${images[1]}`;
    };
    if(x<=8&&x>6){
        photot.innerHTML =`${images[2]}`;
    };
    if(x<=6&&x>4){
        photot.innerHTML =`${images[3]}`;
    };
    if(x<=4&&x>2){
        photot.innerHTML =`${images[4]}`;
    };
    if(x<=2){
        photot.innerHTML =`${images[0]}`;
    };
}