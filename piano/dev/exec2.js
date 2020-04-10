var group = document.querySelectorAll('.group');
var fullkeys = group[0].querySelectorAll('.full-tone-item');
var halfkeys = group[0].querySelectorAll('.half-tone-item');

var keys = document.body.querySelectorAll('.item');
var keysarr = [];
for(let i = 0; i < keys.length; ++i){
    keysarr.push(keys[i]);
}
// 键盘表：从高到低
keyboards = ("C= C- C0 C9 C8 C7 C6 C5 C4 C3 C2 C1 " +
"F12 F11 F10 F9 F8 F7 F6 F5 F4 F3 F2 F1 " +
"= - 0 9 8 7 6 5 4 3 2 1 " + 
"] [ p o i u y t r e w q "+ 
"Enter ' ; l k j h g f d s a "+
"/ . , m n b v c x z ArrowRight ArrowLeft " +
"C] C[ Cp Co Ci Cu Cy Ct Cr Ce Cw Cq").split(' ').reverse();

function keys2dom(char, obj) {
    var x;
    if(keyboards.length === obj.length){
        x = obj[keyboards.indexOf(char)];
    }
    return x;
}

for (let item of keys) {
    item.setAttribute('data-isdown', 'false');
}


window.addEventListener('keydown', function (e) {
    e.preventDefault();
    let char = (document.querySelector('input').checked) ? 'C' + e.key : e.key;
    let x = keys2dom(char, keys);
    if (x !== undefined) {
        if (x.getAttribute('data-isdown') === 'false') {
            x.classList.add('active');
            play(char);
            x.setAttribute('data-isdown', 'true');
        }
    }
});

// 此处的无效判断应该提前
window.addEventListener('keyup', function (e) {
    let char = (document.querySelector('input').checked) ? 'C' + e.key : e.key;
    let x = keys2dom(char, keys);
    if (x !== undefined) {
        x.classList.remove('active');
        x.setAttribute('data-isdown', 'false');
        // this.setTimeout(function (){},3000)
    }
});


window.addEventListener('mousedown', function (e) {
    let x = keysarr.indexOf(e.target);
    if (x !== undefined) {
        play(keyboards[x])
        e.target.classList.add('active');
        e.target.setAttribute('data-isdown', 'true');
    }
});

window.addEventListener('mouseup', function (e) {
    let x = keysarr.indexOf(e.target);
    if (x !== undefined) {
        e.target.classList.remove('active');
        e.target.setAttribute('data-isdown', 'false');
    }
});