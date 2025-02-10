// *** Inicializando o jogo *** \\
// Criando as variaveis \\
const game_board = document.getElementById("game_board");
const frog = document.createElement("img");
var frog_pos_x = 5;
var frog_pos_y = 12;
var current_direction = "up";
var frog_is_move = false;
var cars = [];
var logs = [];
var frog_on_log = false;
var flag = 0;
is_game_start = false;
// Criando os sprites \\
const frog_sprites = {
    up: ["./Imagens/sapo-up1.png", "./Imagens/sapo-up2.png"],
    down: ["./Imagens/sapo-down1.png", "./Imagens/sapo-down2.png"],
    left: ["./Imagens/sapo-left1.png", "./Imagens/sapo-left2.png"],
    right: ["./Imagens/sapo-right1.png", "./Imagens/sapo-right2.png"]
};
const cars_sprites = {
    left: ["./Imagens/carro1.png", "./Imagens/carro2.png"],
    right: ["./Imagens/carro3.png", "./Imagens/carro4.png"]
};
const logs_sprites = {
    left: ["./Imagens/tronco1.png"],
    right: ["./Imagens/tronco2.png"]
}
// Iniciando o jogo \\
document.getElementById("start").addEventListener("click", start_game);
function start_game(){
    if(is_game_start) return;
    game_board.innerHTML = "";
    flag = 0;
    create_grid();
    create_frog();
    start_car_generation();
    is_game_start = true;
}
// Criando a grid do jogo
function create_grid() {
    for (let y = 0; y < 14; y++) {
        for (let x = 0; x < 12; x++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            game_board.appendChild(cell);
        }
    }
}
// *** Configuração do Sapo *** \\
// Criando o sapo \\
function create_frog(){
    frog.src = frog_sprites[current_direction][0];
    frog.classList.add("frog");
    frog.style.zIndex = "2";
    game_board.appendChild(frog);
    update_frog_position();
}
// Atualizando o sapo \\
function update_frog_position() {
    frog.style.gridColumn = frog_pos_x+1;
    frog.style.gridRow = frog_pos_y+1;
    if(frog.style.gridRow==1){
        create_text("VICTORY!!!");
    }
    check_collision();
}
// Muda a posição do sapo \\
document.addEventListener("keydown", (event) => {
    if (frog_is_move) return;
    switch (event.key) {
        case "ArrowUp":
            if (frog_pos_y > 0) move_frog("up");
            break;
        case "ArrowDown":
            if (frog_pos_y < 13) move_frog("down");
            break;
        case "ArrowLeft":
            if (frog_pos_x > 0) move_frog("left");
            break;
        case "ArrowRight":
            if (frog_pos_x < 11) move_frog("right");
            break;
    }
});
// Movendo o sapo \\
function move_frog(direction) {
    frog_is_move = true;
    current_direction = direction;
    frog.src = frog_sprites[direction][1];
    setTimeout(() => {
        if (direction==="up") frog_pos_y--;
        if (direction==="down") frog_pos_y++;
        if (direction==="left") frog_pos_x--;
        if (direction==="right") frog_pos_x++;
        update_frog_position();
        frog.src = frog_sprites[direction][0];
        frog_is_move = false;
    }, 150);
}
// *** Configuração dos Carros ***
// Criando os carros \\
function create_car() {
    var row_options_left = [2,3,4,5,6];
    var row_options_right = [8,9,10,11];
    var row,direction,car_pos_x;
    if(Math.random()<0.5){
        row = row_options_left[Math.floor(Math.random()*row_options_left.length)];
        direction = "left";
        car_pos_x = 11;
    }
    else{
        row = row_options_right[Math.floor(Math.random()*row_options_right.length)];
        direction = "right";
        car_pos_x = 0;
    }
    var car = document.createElement("img");
    var sprite_list = direction==="left" ? cars_sprites.left : cars_sprites.right;
    car.src = sprite_list[Math.floor(Math.random()*sprite_list.length)];
    car.classList.add("car");
    var speed = Math.random()*(800-400)+400;
    car.style.gridColumn = car_pos_x+1;
    car.style.gridRow = row+1;
    game_board.appendChild(car);
    var car_object = {element:car,x:car_pos_x,y:row,direction,speed};
    cars.push(car_object);
}
// Atualizando a posição dos carros \\
function move_cars() {
    cars.forEach((car, index) => {
        if(car.direction==="right"){
            car.x++;
        }
        else{
            car.x--;
        }
        if(car.x < -1 || car.x > 11){
            game_board.removeChild(car.element);
            cars.splice(index, 1);
        }
        else{
            car.element.style.gridColumn = car.x+1;
            car.element.style.gridRow = car.y+1;
        }
        check_collision();
    });
}
// Gerar novos carros em intervalos aleatórios
function start_car_generation() {
    setInterval(() => {
        if(Math.random()<1){
            create_car();
        }
    }, Math.random()*400);
    setInterval(move_cars,300);
}
// *** Checagem de colisão ***
flag = 0;
function check_collision() {
    if (flag) return;
    cars.forEach((car) => {
        if (car.x === frog_pos_x && car.y === frog_pos_y){
            flag = 1;
            create_text("GAME OVER!!!")
        }
    });
}
// *** Criando a tela de game over e vitoria *** \\
function create_text(txt){
    var text = document.getElementById("text").innerHTML = txt;
    document.getElementById("text").style.display = "block";
    setTimeout(finish_game,500)
}
function finish_game(){
    location.reload()
}
