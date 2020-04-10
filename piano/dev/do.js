
// 生成<audio>
var audioadress = [];
var audio = [];

for(let i = 0;i < 84; ++i){
    if(i + 23 < 100){
        audioadress[i] = 'modified/' + 'M_German Concert D 0' + (i + 23) + ' 083.wav';
    }
    else{
        audioadress[i] = 'modified/' + 'M_German Concert D ' + (i + 23) + ' 083.wav';
    }
}

// 加载时应提醒正在加载
for(let i = 0;i < audioadress.length; ++i){
    let onehit = document.createElement('audio');
    onehit.src = audioadress[i];
    onehit.type = 'audio/wav';
    onehit.preload = 'auto';
    document.body.appendChild(onehit);
    onehit.play();
    onehit.pause();
    onehit.currentTime = 0;
    audio[audio.length] = onehit;
}

function key2objectfunc(char, obj, func){
    var x;
    if(keyboards.length === obj.length){
        x = obj[keyboards.indexOf(char)];
    }
    if(x !== undefined){
        func(x);
    }
}

// 定义播放函数
function play(key){
    var func = function (x){
        x.pause();
        x.currentTime = 0;
        x.play();
    }
    key2objectfunc(key, audio, func);
}

