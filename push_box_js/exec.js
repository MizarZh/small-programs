//0为空白
//1为砖
//2为通道
//3为终点
//4为箱子
//5为玩家
//6为归位点
//7为玩家在点上

//总结：1、js的调用并不是一次性的，可以使用函数重复调用
//2、事件的监听是并行的。如果前面监听了click，后面监听了keypress，则可以同时使用
//3、全局变量可以用window.xxx表示
//奇怪的问题：map即使加了concat也竟然会跟着mapnow变化？？（目测是多维数组的bug）
//数组中如果嵌套了对象，那么concat也会对数组中的东西产生影响（非深复制）

const brickType = 1;
const passageType = 2;
const pointType = 3;
const boxType = 4;
const playerType = 5;
const finpointType = 6;
const ponpType = 7;
var generalstyle = "width : 40px; height : 40px; font-size : 30px; alignment: center; margin-top : 0px;";
var level = 0;
var mapnow = [];
document.getElementById("choose").addEventListener("click",chooselistener);
document.getElementById("reset").addEventListener("click",reset);

function chooselistener(){
    window.level = (document.body.getElementsByTagName('select')[0].selectedIndex);
    start();
}

function reset(){
    if(document.getElementById("outerLayer").innerHTML !== ""){
        window.removeEventListener("keypress",moveKey);
        start();
    }
}

//深复制
function deepcopy(onemap){
    var allmap = [];
    var rowmap = [];
    for(var i = 0;i<onemap.length;++i){
        for(var j = 0;j<onemap[0].length;++j){
            rowmap[rowmap.length] = onemap[i][j];
        }
        allmap[allmap.length] = rowmap;
        rowmap = [];
    }
    return allmap;
}

//启动
function start() {
    loadmap();
    print();
    moveSystem();
}

//加载地图
function loadmap(){
    pointNum = 0;
    playerpos = []; //从0数起

    window.mapnow = deepcopy(map[level]);//这里需要一个深复制
    for(var i = 0;i<(mapnow.length);++i){
        for(var j = 0;j<(mapnow[0].length);++j) {
            if(mapnow[i][j] === pointType)
                ++pointNum;
        }
    }
    outer = document.getElementById("outerLayer");
    outer.style.width = (mapnow[0].length+1) * 40 + 'px';
    outer.style.margin = "auto";
}

//动作系统
function moveSystem(){
    window.addEventListener("keydown",moveKey);
}

//打印系统
function print(){
    outer.innerHTML = "";
    for(var i = 0;i<(mapnow.length);++i){
        for(var j = 0;j<(mapnow[0].length);++j){
            var div = document.createElement("div");
            switch(mapnow[i][j]){
                case 0: //空白
                    if(j === (mapnow[0].length-1)){
                        div.style = generalstyle + "float : left; border : 1px solid white;";
                    }else{
                        div.style = generalstyle + "float : left; border : 1px solid white;";
                    }
                    break;
                case brickType: //边界砖
                    if(j === (mapnow[0].length-1)){
                        div.style = generalstyle + "background-color : gray ; border : 1px solid black; float : left;";
                    }else{
                        div.style = generalstyle + "background-color : gray ; float : left; border : 1px solid black;";
                    }
                    break;
                case passageType: //可走的道路
                    div.style = generalstyle + "float : left; background-color : #00FFFF ; border : 1px solid black;";
                    break;
                case pointType: //目标点
                    div.style = generalstyle + "float : left; background-color: deeppink; border : 1px solid black;"
                    + "text-align : center;";
                    div.innerHTML = "X";
                    break;
                case boxType:
                    div.style = generalstyle + "float : left; background-color: brown; border : 1px solid black;"
                        + "text-align : center;";
                    div.innerHTML = "B";
                    break;
                case playerType:
                    div.style = generalstyle + "float : left; background-color: green; border : 1px solid black;"
                        + "text-align : center;";
                    div.innerHTML = "P";
                    playerpos = [i,j];
                    break;
                case finpointType:
                    div.style = generalstyle + "float : left; background-color: black; border : 1px solid black;";
                    break;
                case ponpType:
                    div.style = generalstyle + "float : left; background-color: green; border : 1px solid black;"
                        + "text-align : center;";
                    div.innerHTML = "P";
                    break;
            }
            outer.appendChild(div);
        }
    }
}

//判断成功
function finish(){
    var count = 0;
    for(var i = 0;i<(mapnow.length);++i) {
        for (var j = 0; j < (mapnow[0].length); ++j) {
            if(mapnow[i][j] === finpointType){
                ++count;
            }
        }
    }
    if(count === pointNum){
        alert("游戏结束！");
        window.removeEventListener("keydown",moveKey);
    }

}

//监听器
function moveKey(k){
        switch(k.key){
            case "ArrowLeft":
                if(playerpos[1] > 0){
                    moveLeft();
                }
                break;
            case "ArrowRight":
                if(playerpos[1] < mapnow[0].length - 1){
                    moveRight();
                }
                break;
            case "ArrowUp":
                if(playerpos[0] > 0){
                    moveUp();
                }
                break;
            case "ArrowDown":
                if(playerpos[0] < mapnow.length - 1){
                    moveDown();
                }
                break;

        }
        console.log("moved");
        print();
        finish();
}

//具体运动
//0为空白
//1为brick
//2为passage
//3为point
//4为box
//5为player
//6为finpoint
//7为ponp
function moveLeft(newPosType = mapnow[playerpos[0]][playerpos[1] - 1],oldPosType = mapnow[playerpos[0]][playerpos[1]]){
    if(newPosType === passageType) {
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]][playerpos[1] - 1] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0], playerpos[1] - 1]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]][playerpos[1] - 1] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0], playerpos[1] - 1]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]][playerpos[1] - 2] = boxType; //新地点
                mapnow[playerpos[0]][playerpos[1] - 1] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]][playerpos[1] - 2] = boxType; //新地点
                mapnow[playerpos[0]][playerpos[1] - 1] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === pointType){
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]][playerpos[1]-1] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0],playerpos[1]-1]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]][playerpos[1]-1] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0],playerpos[1]-1]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]][playerpos[1]-2] = finpointType; //新地点
                mapnow[playerpos[0]][playerpos[1]-1] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]][playerpos[1]-2] = finpointType; //新地点
                mapnow[playerpos[0]][playerpos[1]-1] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === boxType || newPosType === finpointType){
        if(mapnow[playerpos[0]][playerpos[1] - 2] === passageType ||
            mapnow[playerpos[0]][playerpos[1] - 2] === pointType){
            moveLeft(mapnow[playerpos[0]][playerpos[1] - 2],mapnow[playerpos[0]][playerpos[1] - 1]);
            moveLeft();
            //如果箱子后没有其他物体就移动
        }
    }
    //其他的为brick或finpoint（对player），不需要进行操作
}
function moveRight(newPosType = mapnow[playerpos[0]][playerpos[1] + 1],oldPosType = mapnow[playerpos[0]][playerpos[1]]){
    if(newPosType === passageType) {
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]][playerpos[1] + 1] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0], playerpos[1] + 1]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]][playerpos[1] + 1] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0], playerpos[1] + 1]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]][playerpos[1] + 2] = boxType; //新地点
                mapnow[playerpos[0]][playerpos[1] + 1] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]][playerpos[1] + 2] = boxType; //新地点
                mapnow[playerpos[0]][playerpos[1] + 1] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === pointType){
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]][playerpos[1]+1] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0],playerpos[1]+1]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]][playerpos[1]+1] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0],playerpos[1]+1]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]][playerpos[1]+2] = finpointType; //新地点
                mapnow[playerpos[0]][playerpos[1]+1] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]][playerpos[1]+2] = finpointType; //新地点
                mapnow[playerpos[0]][playerpos[1]+1] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === boxType || newPosType === finpointType){
        if(mapnow[playerpos[0]][playerpos[1] + 2] === passageType ||
            mapnow[playerpos[0]][playerpos[1] + 2] === pointType){
            moveRight(mapnow[playerpos[0]][playerpos[1] + 2],mapnow[playerpos[0]][playerpos[1] + 1]);
            moveRight();
            //如果箱子后没有其他物体就移动
        }
    }
    //其他的为brick或finpoint（对player），不需要进行操作
}
function moveUp(newPosType = mapnow[playerpos[0] - 1][playerpos[1]],oldPosType = mapnow[playerpos[0]][playerpos[1]]){
    if(newPosType === passageType) {
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]-1][playerpos[1]] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0]-1, playerpos[1]]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]-1][playerpos[1]] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0]-1, playerpos[1]]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]-2][playerpos[1]] = boxType; //新地点
                mapnow[playerpos[0]-1][playerpos[1]] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]-2][playerpos[1]] = boxType; //新地点
                mapnow[playerpos[0]-1][playerpos[1]] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === pointType){
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]-1][playerpos[1]] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0]-1,playerpos[1]]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]-1][playerpos[1]] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0]-1,playerpos[1]]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]-2][playerpos[1]] = finpointType; //新地点
                mapnow[playerpos[0]-1][playerpos[1]] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]-2][playerpos[1]] = finpointType; //新地点
                mapnow[playerpos[0]-1][playerpos[1]] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === boxType || newPosType === finpointType){
        if(mapnow[playerpos[0]-2][playerpos[1]] === passageType ||
            mapnow[playerpos[0]-2][playerpos[1]] === pointType){
            moveUp(mapnow[playerpos[0]-2][playerpos[1]],mapnow[playerpos[0]-1][playerpos[1]]);
            moveUp();
            //如果箱子后没有其他物体就移动
        }
    }
    //其他的为brick或finpoint（对player），不需要进行操作
}
function moveDown(newPosType = mapnow[playerpos[0] + 1][playerpos[1]],oldPosType = mapnow[playerpos[0]][playerpos[1]]){
    if(newPosType === passageType) {
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]+1][playerpos[1]] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0]+1, playerpos[1]]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]+1][playerpos[1]] = playerType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0]+1, playerpos[1]]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]+2][playerpos[1]] = boxType; //新地点
                mapnow[playerpos[0]+1][playerpos[1]] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]+2][playerpos[1]] = boxType; //新地点
                mapnow[playerpos[0]+1][playerpos[1]] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === pointType){
        switch (oldPosType) {
            //player
            case playerType:
                mapnow[playerpos[0]+1][playerpos[1]] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = passageType; //原地点
                playerpos = [playerpos[0]+1,playerpos[1]]; //更新玩家坐标
                break;
            case ponpType:
                mapnow[playerpos[0]+1][playerpos[1]] = ponpType; //新地点
                mapnow[playerpos[0]][playerpos[1]] = pointType; //原地点
                playerpos = [playerpos[0]+1,playerpos[1]]; //更新玩家坐标
                break;
            //box
            case boxType:
                mapnow[playerpos[0]+2][playerpos[1]] = finpointType; //新地点
                mapnow[playerpos[0]+1][playerpos[1]] = passageType; //原地点
                break;
            case finpointType:
                mapnow[playerpos[0]+2][playerpos[1]] = finpointType; //新地点
                mapnow[playerpos[0]+1][playerpos[1]] = pointType; //原地点
                break;
        }
    } else
    if(newPosType === boxType || newPosType === finpointType){
        if(mapnow[playerpos[0]+2][playerpos[1]] === passageType ||
            mapnow[playerpos[0]+2][playerpos[1]] === pointType){
            moveDown(mapnow[playerpos[0]+2][playerpos[1]],mapnow[playerpos[0]+1][playerpos[1]]);
            moveDown();
            //如果箱子后没有其他物体就移动
        }
    }
    //其他的为brick或finpoint（对player），不需要进行操作
}