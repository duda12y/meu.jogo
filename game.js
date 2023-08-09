class Game{
    constructor(){
     this.botao = createButton("REINICIAR");
        this.titulo = createElement('h2');
        this.lugar1 = createElement('h2');
        this.lugar2 = createElement('h2');
        this.movendo = false;
        this.esquerda = false;
        this.explodido = false;

    }
    posicionarElementos(){
        this.botao.position(width*0.66,100);

        this.titulo.position(width*0.33,100);
        this.lugar1.position(width*0.33,150);
        this.lugar2.position(width*0.33, 200);

        this.titulo.html("Placar")

        this.botao.mousePressed(()=>{

            database.ref("/").set({
                carsAtEnd:0, gameState:0, playerCount:0, players :{}

            })
            window.location.reload();
 
        })
     
 


    }

       addSprites(grupo, imagem, tamanho, quantidade){
        for(var i = 0; i< quantidade; i++){
            
            var x = random(width*0.33, width*0.66);
            var y = random(-height*4.5, height-100);
            var sprite = createSprite(x,y);
            sprite.addImage(imagem);
            sprite.scale = tamanho;
            grupo.add(sprite);
        }
         

    }

    start(){
        //cria o objeto form da classe Form
        form = new Form();
        //chama o método exibir do formulário
        form.exibir();

        //cria uma instância de novo jogador
        player = new Player();
        player.getCount();

        car1 = createSprite(width/2-100, height-100)
        car1.addImage("carro", carimg1);
        car1.addImage('blast', tnt);
        car1.scale = 0.07;
        

        car2 = createSprite(width/2+100, height-100)
        car2.addImage("carro", carimg2);
        car2.addImage('blast', tnt);
        car2.scale = 0.07;
        //agrupa os carrinhos na mesma variável
        cars = [car1, car2];
        //criar o grupo das moedas
      
        coins = new Group    ();
        fuels = new Group    ();

        var oPos = [
            {x: width/2 + 250,y:height - 800},
            {x: width/2 - 250,y:height - 1300},
            {x: width/2 + 250,y:height - 1800},
            {x: width/2 - 250,y:height - 2300}
        ]

        var oPos2 = [
            {x: width/2 - 180,y:height - 3300},
            {x: width/2 + 1800,y:height - 3300},
            {x: width/2 + 250,y:height - 3800},
            {x: width/2 - 150,y:height - 4300}

        ]

        obs = new Group ();
        this.addSprites(coins, coinImg, 0.15, 30);
        this.addSprites(fuels, fuelImg, 0.15, 35);
        this.addSprites(obs, o1, 0.2,oPos.length, oPos);
        this.addSprites(obs, o2, 0.2,oPos2.length, oPos2);
        
    }
    


    play(){
        form.esconder();
        Player.getInfo();
        this.posicionarElementos();
        
        player.getCarsAtEnd()


        if (allPlayers !== undefined){
            image (pista, 0, -height*4.5, width, height*6)
            
           
            var i = 0;
            for(var p in allPlayers){
                //pega o valor do banco de dados
                var x = allPlayers[p].posicaoX;
                var y = height - allPlayers[p].posicaoY;
                //atribui o valor na sprite do pc local
                cars[i].position.x = x;
                cars[i].position.y = y;
                i++;
                if(player.indice == i){
                    //definir a posição da câmera
                    camera.position.y = y;
                    textSize(25);
                    fill ("red");
                    textAlign("center");
                    text (allPlayers[p].nome,x, y-80 )
                    this.mostrarPlacar();
                    this.showFuelBar()
                    this.showLifeBar()
                    this.handleCoins(i);
                    var linhaChegada = height*5.5;
                    if(player.posY > linhaChegada){
                        player.rank++;
                        player.update();
                        Player.updateCarsAtEnd(player.rank);
                        gameState=2;
                        this.gameOver();
                    }
                }
            }
            this.controlarCarro()
            drawSprites()
        }
        
    }

    controlarCarro(){

        if(!this.explodido){
            
        
        //checa se pressionou para cima
        if(keyDown(UP_ARROW)){
            player.posY += 10;
            this.playerMoving = true;
            player.update();
        }
        
        if(keyDown(RIGHT_ARROW)){
            player.posX += 10;
            player.update();
            this.esquerda = false;
        }

        if(keyDown(LEFT_ARROW)){
            player.posX -= 10;
            player.update();
            this.esquerda = true;
        }

    }


    }

    //lê no banco de dados e copia o valor de gameState
    getState(){
        database.ref("gameState").on("value", function(data){
            gameState = data.val();
        })
    }

    //atualiza o valor de gameState 
    update(state){
        database.ref("/").update({
            gameState:state
        })






    
  
    }

    showLifeBar(){
        push();
        image(lifeImg, width/2 -130, height - player.posY - 250, 20, 20);
        fill('black');
        rect(width/2 - 100, height - player.posY - 250, 175, 20)
        fill('#ff0119');
        rect(width/2 - 100, height - player.posY - 250, player.life, 20);
    pop();
   








    }





    showFuelBar(){
        push();

       image(fuelImg, width/2 -130, height - player.posY - 200, 20, 20);
        fill('white');
        rect(width/2 - 100, height - player.posY - 200, 185 , 20)
            
           fill('#fffd77');
           rect(width/2 - 100, height - player.posY - 200, player.fuel , 20)
    pop();
    
    
    }
           
    
         



  mostrarPlacar(){
    var lugar1,  lugar2;
    var players = Object.values(allPlayers)

    if(players[0].rank == 0 && players[1].rank == 0
    ){
        lugar1 = players[0].rank 
        +"&emsp;"
        +players[0].nome
        +"&emsp;"
        +players[0].score

        lugar2 = players[1].rank
        +"&emsp;"
        +players[1].nome
        +"&emsp;"
        +players[1].score
     } 

     if(players[0].rank == 1){
        lugar1 = players[0].rank
        +"&emsp;"
        +players[1].nome
        +"&emsp;"
        +players[1].score

        lugar2 = players[1].rank
        +"&emsp;"
        +players[1].nome
        +"&emsp;"
        +players[1].score
    }

        if(players[1].rank == 1){
            lugar1 = players[0].rank
            +"&emsp;"
            +players[1].nome
            +"&emsp;"
            +players[1].score
    
            lugar2 = players[0].rank
            +"&emsp;"
            +players[0].nome
            +"&emsp;"
            +players[0].score
        
     }

    this.lugar1.html(lugar1);
    this.lugar2.html(lugar2); 

  }

  handleCoins(i){

    cars[i-1].overlap(coins, function(carro, collided){
  collided.remove(); 
  player.score+=1;
  player.update()    

  });
  cars[i-1].overlap(fuels, function(carro, collided){
    collided.remove(); 
    player.fuel = 160;
    player.update()  
});  

    if(cars[i-1].collide(obs)){
        this.perderVida(i);

    }








  
  if(player.fuel > 0 && this.playerMoving){
    player.fuel -=0.5

  

  }

    

  if(player.fuel <= 0){
    gameState = 2;
    this.gameOver();
}

    }
perderVida(i){
    if(player.life >=1){
        player.life -=175/4;

    }else{
        cars[i-1].changeImage('blast')
        cars[i-1].scale = 0.7
        this.explodido = true;
    }
    
    if(this.esquerda){
        player.posX += 100;

    }else{
        player.posX -= 100
    }
    player.update()
    
    
}


gameOver(){
    if(player.fuel<=0 || player.life <= 1){
        swal ({
            title:"Seu inutil🤗",
            text:"Vc perdeu otario😘",
            imageUrl: 'https://media.tenor.com/PjgjmGSHQh8AAAAM/ot%C3%A1rioooo-ot%C3%A1rio.gif',
           imageSize:'200x200',
           
            confirmButtonText: "Espere a partida começar!"
       
       
        })

    }else{ 
    swal ({
        title:"legal meu mano",
        text:"Voce ficou em" +player.rank+" º lugar😰👍",
        imageUrl: 'https://i.pinimg.com/originals/85/7d/bb/857dbbfa4c6c538f33ce65acade5510c.gif',
        imageSize: '200x200',
        confirmButtonText: "ok!"
    })
}
}


}
