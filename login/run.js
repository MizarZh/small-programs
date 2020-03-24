function login(){
    var submit = function(){
        let x = document.getElementById('account');
        let y = document.getElementById('password');
        event.preventDefault();
    }
    let sub = document.getElementById('submit');
    sub.addEventListener("click",submit)
    
}

login();