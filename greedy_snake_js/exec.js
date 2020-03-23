//横35，纵20
//
//只打印需要的部分
//使用一个数组储存整个蛇所属的部分
//

//随机数、数组判断相等、全局、css、clearInterval、深复制、中止进行、throw、parseInt、正则
//bug：在间隔中间操作键盘的时候有时候会出现bug 原因：假设初始状态为r，按键之后设置u再设置l，则可以导致自身冲突

let first = true;
let pausestate = false;
const generalStyle = "width:20px; height:20px; border:1px black solid; position: absolute;";
const map = {
    "height" : 12,
    "length" : 12
};
const snakeorigin = {
    "head" : [5,5],
    "body" : [[4,5],[3,5]], //必须连续
    "dir" : "r", //方向
    "delete" : [], //需要pop掉的
    "odir" : "r" //原方向originaldir
};

let food = [];

let div = document.getElementById("outer");
div.style.marginLeft = "20%";
div.style.width = "90%";
div.style.height = "100%";

let state = document.getElementById("state");
state.style.color = "red";

//暂停
function pause(){
    pausestate = true;
    clearInterval(id);
    state.innerHTML = "暂停";
}

function start(){
    //init
    //判断输入是否正确
    if(pausestate === false){
        let s = /^\d+$/;
        window.speed = document.getElementById("speed").value;
        let h = document.getElementById("h").value;
        let l = document.getElementById("l").value;
        if(!s.test(speed)){
            alert("间隔请输入整数");
            throw "NotAnIntegerError";
        }
        if(s.test(h) && s.test(l)){
            map.height = h;
            map.length = l;
        }else{
            alert("长度或高度请输入整数");
            throw "NotAnIntegerError";
        }
        if(first === false){
            clearInterval(id);
        }else{
            first = false;
        }
        //地图初始化
        div.innerHTML = "";
        window.snake = JSON.parse(JSON.stringify(snakeorigin));
        createfood();
        for(let j = 0;j<map.height;++j){
            for(let i = 0;i<map.length;++i){
                let x = document.createElement("div");
                if(i === 0 || j === 0 || j === map.height - 1 || i === map.length -1){//border
                    x.style = generalStyle + "background-color : gray;";
                }else{//blank
                    x.style = generalStyle + "background-color : white;";
                }
                x.style.marginTop = j * 21 +"px";
                x.style.marginLeft = i * 21 + "px";
                div.appendChild(x);
            }
        }
    }
    //运行
    state.innerHTML = "开始";
    pausestate = false;
    listen();
    move();
}

//监听按键
function listen(){
    addEventListener("keydown",function(k){
        switch(k.key){
            case "s":
            case "ArrowDown":
                    snake.dir = "d";
                break;
            case "w":
            case "ArrowUp":
                    snake.dir = "u";
                break;
            case "d":
            case "ArrowRight":
                    snake.dir = "r";
                break;
            case "a":
            case "ArrowLeft":
                    snake.dir = "l";
                break;
        }
    });
}

//设置显示的格式
function setstyle(){
    let cor = (i,j) => map.length * j + i; //坐标与div中数组index的转换
    let s = div.getElementsByTagName("div");
    s[cor(snake.head[0],snake.head[1])].style.backgroundColor = "red";
    s[cor(food[0],food[1])].style.backgroundColor = "blue";
    if(snake.delete.length !== 0){
        s[cor(snake.delete[0],snake.delete[1])].style.backgroundColor = "white";
    }
    for(let i = 0;i < snake.body.length;++i){
        let bodyunit = snake.body[i];
        s[cor(bodyunit[0],bodyunit[1])].style.backgroundColor = "pink";
    }

}

//旧方向与新方向的对比
function dircomparison(){
    switch (snake.odir) {
        case "u":
            if(snake.dir !== "d"){
                snake.odir = snake.dir;
            }
            break;
        case "d":
            if(snake.dir !== "u"){
                snake.odir = snake.dir;
            }
            break;
        case "l":
            if(snake.dir !== "r"){
                snake.odir = snake.dir;
            }
            break;
        case "r":
            if(snake.dir !== "l"){
                snake.odir = snake.dir;
            }
            break;
    }

}


//之前是使用snake.body.some((element) => (element[0] === food[0]))，但是分开两个判断会出问题
function createfood(){
    while(true){
        food = [Math.floor(Math.random()*(map.length-2))+1,Math.floor(Math.random()*(map.height-2))+1];
        if((snake.body.some((element) => (element.toString() === food.toString()))) ||
            food.toString() === snake.head.toString()){
        }else{
            return;
        }
    }

}

//每个一段时间更新
function move(){
    window.id = setInterval(function(){
        dircomparison(); //为了防止通过操作使得dir与odir相反的判断
        switch(snake.odir){
            case "r":
                moveRight();
                break;
            case "l":
                moveLeft();
                break;
            case "u":
                moveUp();
                break;
            case "d":
                moveDown();
                break;
        }
        setstyle();
    },parseInt(speed))
}


//结束
function end(){
    clearInterval(id);
    state.innerHTML = "结束";
    alert("游戏结束");
}

//判断是否自我碰撞
function selfcollision(){
    for(let x = 0;x<snake.body.length;++x){
        if(snake.body[x][0] === snake.head[0] && snake.body[x][1] === snake.head[1]){
            return true;
        }
    }
}


//运动系统+碰撞判定
function moveLeft(){
    let origin = [...snake.head];
    --snake.head[0];
    if(snake.head[0] === food[0] && snake.head[1] === food[1]){//eat something
        snake.body.unshift(origin);
        snake.delete = [];
        createfood();
    }else if(snake.head[0] === 0 || selfcollision()){
        //dead
        ++snake.head[0];
        end();
    }else{
        snake.body.unshift(origin);
        snake.delete = snake.body.pop();
    }
}
function moveRight(){
    let origin = [...snake.head];
    ++snake.head[0];
    if(snake.head[0] === food[0] && snake.head[1] === food[1]){//eat something
        snake.body.unshift(origin);
        snake.delete = [];
        createfood();
    }else if(snake.head[0] === map.length - 1 || selfcollision()){
        //dead
        --snake.head[0];
        end();
    }else{
        snake.body.unshift(origin);
        snake.delete = snake.body.pop();
    }
}
function moveUp(){
    let origin = [...snake.head];
    --snake.head[1];
    if(snake.head[0] === food[0] && snake.head[1] === food[1]){//eat something
        snake.body.unshift(origin);
        snake.delete = [];
        createfood();
    }else if(snake.head[1] === 0 || selfcollision()){
        //dead
        ++snake.head[1];
        end();
    }else{
        snake.body.unshift(origin);
        snake.delete = snake.body.pop();
    }
}
function moveDown(){
    let origin = [...snake.head];
    ++snake.head[1];
    if(snake.head[0] === food[0] && snake.head[1] === food[1]){//eat something
        snake.body.unshift(origin);
        snake.delete = [];
        createfood();
    }else if(snake.head[1] === map.height - 1 || selfcollision()){
        //dead
        --snake.head[1];
        end();
    }else{
        snake.body.unshift(origin);
        snake.delete = snake.body.pop();
    }
}