group = document.querySelectorAll('.group');
fullkeys = group[0].querySelectorAll('.full-tone-item');
halfkeys = group[0].querySelectorAll('.half-tone-item');

keys = group[0].querySelectorAll('.item');

var down = false;
var keyboards = 'qwertyuiop[]';

function keys2dom(char){
    var x;
    switch (char) {
        case 'q':
            x = keys[0];
            break;
        case 'w':
            x = keys[1];
            break;
        case 'e':
            x = keys[2];
            break;
        case 'r':
            x = keys[3];
            break;
        case 't':
            x = keys[4];
            break;
        case 'y':
            x = keys[5];
            break;
        case 'u':
            x = keys[6];
            break;
        case 'i':
            x = keys[7];
            break;
        case 'o':
            x = keys[8];
            break;
        case 'p':
            x = keys[9];
            break;
        case '[':
            x = keys[10];
            break;
        case ']':
            x = keys[11];
            break;
        default:
            break;
    }
    return x;
}

window.addEventListener('mousedown', function (e) {

});

window.addEventListener('keydown', function (e) {
    let x = keys2dom(e.key.toLowerCase());
    if(x !== undefined){
        x.classList.add('active');
    }
});

window.addEventListener('keyup', function (e) {
    let x = keys2dom(e.key.toLowerCase());
    if(x !== undefined){
        x.classList.remove('active');
    }
});


