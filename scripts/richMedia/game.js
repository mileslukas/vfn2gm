


var AM_Game = function(){

	var ADMAXIM_GAME_WIDTH = 320;
	var ADMAXIM_GAME_HEIGHT = 500;

	var BREAK_POINT_Y = 590;
	var DROP_SLOT_W = 256;
	var DROP_SLOT_END = 1300;
	var SLOT_X_ARRAY = [128, 384, 640];
	var SLOT_1 = 128;
	var SLOT_2 = 384;
	var SLOT_3 = 640;
	var MEDIA_PATH = "media/";

	//var bottle_break_data = {"images": [MEDIA_PATH + "bottle_break3.png"], "frames": [[1009, 2, 266, 374, 0, -172, 0], [600, 2, 405, 382, 0, -126, -40], [1279, 2, 534, 326, 0, -100, -68], [2, 2, 594, 610, 0, 0, -50]], "animations": {"all": {"frames": [0, 0, 1, 1, 2, 2, 3, 3]}}};

	var FINAL_URL = "http://m.vodafone.hu/aktualis-ajanlatok/valts/vodafone-red?ecmp=mob_hu_red_admaxim_na_05-2013_na_mob-aaaa0065aaaa0172-aaaa0186";

	var ITEM_INCREASE = 110;

	var newScale = 2.4;
	var oldScale = .417;

	var mycanvas,
		stage;

	var imgLib = {};

	var loadBar;
	var loadBarHolder;
	var gameHolder;	

	var moduleLoaded = false;

	var startBtnContainer;

	var helmetPhone;
	var helmetStartY = -360;
	var helmetEndY = -86;

	var downArrow;
	var sideArrows;

	var currentHelmetSlot = 2;
	var dropItemInterval;
	var itemList;
	var score = 0;
	var scoreTxt;
	var guyTxt;
	var guysLeft = 2;

	var playerArray;

	var currentDroppingItem;

 	var MANIFEST = [
 		{src:MEDIA_PATH + "arrows.png", id:"arrows"},
 		{src:MEDIA_PATH + "level_score_txt.png", id:"level_score_txt"},
  	 	{src:MEDIA_PATH + "level_score_endframe_txt.png", id:"level_score_endframe"},
 	 	{src:MEDIA_PATH + "next_level_txt.png", id:"next_level_txt"},
 	 	{src:MEDIA_PATH + "bb_1.png", id:"bb_1"},
 	 	{src:MEDIA_PATH + "bb_2.png", id:"bb_2"},
 	 	{src:MEDIA_PATH + "bb_3.png", id:"bb_3"},
 	 	{src:MEDIA_PATH + "bb_4.png", id:"bb_4"},
 	 	{src:MEDIA_PATH + "bb_5.png", id:"bb_5"},
 		{src:MEDIA_PATH + "arrow.png", id:"arrow"},
 		{src:MEDIA_PATH + "helmet_top.png", id:"helmet_top"},
 		{src:MEDIA_PATH + "helmet_bottom.png", id:"helmet_bottom"},
 		{src:MEDIA_PATH + "helmet_whole.png", id:"helmet_whole"},
 		{src:MEDIA_PATH + "phone.png", id:"phone"},
 		{src:MEDIA_PATH + "horseshoe.png", id:"horseshoe"},
 		{src:MEDIA_PATH + "brick.png", id:"brick"},
 		{src:MEDIA_PATH + "bottle2_frame0.png", id:"bottle"},
 		{src:MEDIA_PATH + "helmet_small.png", id:"helmet_small"},
 		{src:MEDIA_PATH + "end_frame_bg.jpg", id:"end_frame_bg"},
 		{src:MEDIA_PATH + "hit_all_txt2.png", id:"hit_all_txt"},
 		{src:MEDIA_PATH + "brick_left.png", id:"brick_left"},
 		{src:MEDIA_PATH + "brick_right.png", id:"brick_right"},
  		{src:MEDIA_PATH + "end_phone.png", id:"end_phone"},
  		{src:MEDIA_PATH + "end_txt_behind_phone.png", id:"end_txt_behind_phone"},
  		{src:MEDIA_PATH + "click_to_protect_txt.png", id:"click_to_protect_txt"}

	];

	var startFramePath = MEDIA_PATH + "start_cta2.png";

	var isMobile = {
    	Android: function() {
        	return navigator.userAgent.match(/Android/i);
    	},
	    BlackBerry: function() {
	        return navigator.userAgent.match(/BlackBerry/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    Opera: function() {
	        return navigator.userAgent.match(/Opera Mini/i);
	    },
	    Windows: function() {
	        return navigator.userAgent.match(/IEMobile/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	    }
	};
	





	var audioTimer;
	var trackDic = {};
	var trackPlaying = false;
	var audioLoaded = false;
	var MP3_URL = "media/track2.mp3";
	var TRACKS = [
		{name:'helmet_on', start:0, end:.9},
		{name:'shoe', start:1, end:1.9},
		{name:'brick', start:2, end:2.9},
		{name:'bottle', start:3, end:3.9},
		{name:'level_up', start:4, end:4.9},
		{name:'lose', start:5, end:6.9}
	];

	var firstTouch = true;


	this.init = function(){
		//console.log('init - game');
		shrinkCanvasForHighRes({w:ADMAXIM_GAME_WIDTH, h:ADMAXIM_GAME_HEIGHT})
		readyToLoadModule();
	}

	function readyToLoadModule(e) {
		if (!moduleLoaded){
			moduleLoaded = true;
			setUpCanvas();
		}
	}
	
	function setUpCanvas(){
		if (typeof(createjs) != 'undefined'){
			//console.log('createjs ready');
			mycanvas = document.getElementById('demoCanvas');
			stage = new createjs.Stage(mycanvas);
			

		
			//setUpGame();

			buildStartBtn();
		} else {
			setTimeout(function(){
				setUpCanvas();
			},500);
			
			//console.log('createjs undefined');
		}
	}

	var loadStartTime = 0;

	function buildStartBtn(){
		
		startBtnContainer = new createjs.Container();

		var action_txt_img = new Image();
		action_txt_img.src = startFramePath;
        var action_txt_bmp = new createjs.Bitmap(action_txt_img);
        imgLib["action_txt"] = action_txt_bmp;
        imgLib["action_txt"].y = 290;

        startBtnContainer.addChild(imgLib["action_txt"]);

        if (!isStandalone){
	        var close_btn_red_img = new Image();
			close_btn_red_img.src = "media/game/close_btn_white.png";
	        var close_btn_red_bmp = new createjs.Bitmap(close_btn_red_img);
	        imgLib["close_btn_white"] = close_btn_red_bmp;
	        imgLib["close_btn_white"].x = 661;
	        startBtnContainer.addChild(imgLib["close_btn_white"]);
    	}

		var startGraphic = new createjs.Graphics();
		startGraphic.beginFill('green');
		startGraphic.drawRect(0, 0, 768, 1200);
		var startBtn = new createjs.Shape(startGraphic);
		startBtn.alpha = 0.01;
		startBtn.onPress = setUpGame;
		startBtnContainer.addChild(startBtn);
		
		stage.addChild(startBtnContainer);

		createjs.Ticker.addListener(stage);
		createjs.Ticker.setFPS(16);
		//createjs.Ticker.setPaused(true);

		stage.update();

		admaxim_ad_experience.trackEvent('game_enabled');
		createjs.Touch.enable(stage);
	}
	
	function setUpGame(e){

		loadStartTime = createjs.Ticker.getTime();

		stage.removeChild(startBtnContainer);

		preloadAudio(e);

		admaxim_ad_experience.trackEvent('game_click_to_start');
		buildPreloader();

	    var preload = new createjs.LoadQueue(false);
	    	
	    preload.addEventListener("progress", handleProgress);
        preload.addEventListener("complete", allImagesLoaded);
        preload.addEventListener("fileload", singleImageLoaded);
        preload.loadManifest(MANIFEST);

	}

	function buildPreloader(){
		var lX = 9;
		var lY = 34;
		var lWidth = 122;
		var lHeight = 5;

		loadBarHolder = new createjs.Container();
		gameHolder = new createjs.Container();
		gameHolder.alpha = 0;

		var whitebox = new createjs.Graphics();
		whitebox.beginFill('white');
		whitebox.drawRoundRect(-8, -8, 156, 66, 6);
		var whiteboxShape = new createjs.Shape(whitebox);
		

		var shadow = new createjs.Shadow("#000000", 0, 0, 6);
		whiteboxShape.shadow = shadow;

		loadBarHolder.addChild(whiteboxShape);

		var whitebox2 = new createjs.Graphics();
		whitebox2.setStrokeStyle(4);
		whitebox2.beginStroke('#e60000');
		whitebox2.beginFill('white');
		whitebox2.drawRoundRect(0, 0, 140, 50, 3);
		var whiteboxShape2 = new createjs.Shape(whitebox2);
		loadBarHolder.addChild(whiteboxShape2);
		
		var bg = new createjs.Graphics();
		//bg.setStrokeStyle(1);
		//bg.beginStroke('black');
		bg.beginFill('#575757');
		bg.drawRect(lX, lY, lWidth, lHeight);
		var bgShape = new createjs.Shape(bg);
		loadBarHolder.addChild(bgShape);

		var lb = new createjs.Graphics();
		lb.beginFill('#e60000');
		lb.drawRect(lX, lY, lWidth, lHeight);
		loadBar = new createjs.Shape(lb);
		loadBarHolder.addChild(loadBar);

		var m = new createjs.Graphics();
		m.drawRect(lX, lY, lWidth, lHeight);
		var loadMask = new createjs.Shape(m);
		loadBarHolder.addChild(loadMask);

		loadTxt = new createjs.Text("Loading 0%", "19px Arial", "e60000");
		loadTxt.textAlign = "center";
		loadTxt.x = 70;
		loadTxt.y = 8;
		//txt.outline = true;
		loadBarHolder.addChild(loadTxt);


		loadBar.mask = loadMask;
		loadBar.scaleX = 0;
		
		loadBarHolder.x = 90 * newScale;
		loadBarHolder.y = 260;
		loadBarHolder.scaleX = loadBarHolder.scaleY = newScale;


		stage.addChild(loadBarHolder);
	}

	var loadTimer;
	var loadProgDest;

    function handleProgress(event) {
    	////console.log(event.loaded * 100);

    	var eventLoaded = event.loaded
        //loadBar.scaleX = eventLoaded;

    	createjs.Tween.get(loadBar)
			.to({scaleX:eventLoaded},1200);
        
        
        if (!loadTimer) loadTimer = setInterval(function(){
        	loadTxt.text =  "Loading " + Math.round(loadBar.scaleX * 100) + "%";
        },10);

 		
        
        if (event.loaded === 1) {
        	clearInterval(loadTimer);
         	loadBarHolder.visible = false;
         	
         	//createjs.Tween.get(loadBarHolder).to({alpha:0},1000);
			//createjs.Tween.get(gameHolder).to({alpha:1},500);
        }
    }

    function singleImageLoaded(event) {
    	//console.log('image loaded ' + event.item.id);
        var img = new Image();
        img.src = event.item.src;
        var bmp = new createjs.Bitmap(img);
        bmp.id = event.item.id;
        bmp.active = true;
        imgLib[event.item.id] = bmp;
         
    }

	function allImagesLoaded(){
		//console.log('allImagesLoaded');
		gameHolder.alpha = 1;
		admaxim_ad_experience.trackEvent('game_load_complete');
		admaxim_ad_experience.trackEvent('load_time_' + (createjs.Ticker.getTime(true) - loadStartTime) );

		buildGame();
	}





	var breakAni;
	var brokenBrick;
	var rightArrow;
	var leftArrow;

	var brokenBottle;
	var endScore;
	var endLevel;
	var endScorePage;
	var scorePanel;

	function buildGame(){
		//console.log('buildGame');

		imgLib['bb_1'].regX = 162/2;
		imgLib['bb_1'].regY = 192/2;
		imgLib['bb_2'].regX = 120/2;
		imgLib['bb_2'].regY = 181/2;
		imgLib['bb_3'].regX = 112/2;
		imgLib['bb_3'].regY = 179/2;
		imgLib['bb_4'].regX = 152/2;
		imgLib['bb_4'].regY = 109/2;
		imgLib['bb_5'].regX = 84/2;
		imgLib['bb_5'].regY = 121/2;

		/*
		var breakSheet = new createjs.SpriteSheet(bottle_break_data);
		breakAni = new createjs.BitmapAnimation(breakSheet);
		*/

		brokenBrick = new createjs.Container();
		brokenBrick.regX = 54; 
		brokenBrick.regY = 117;

		imgLib['brick_left'].regX = 179/2;
		imgLib['brick_left'].regY = 147/2;
		brokenBrick.addChild(imgLib['brick_left']);

		imgLib['brick_right'].regX = 184/2;
		imgLib['brick_right'].regY = 167/2;
		imgLib['brick_right'].x = 106;
		imgLib['brick_right'].y = 34;
		brokenBrick.addChild(imgLib['brick_right']);

		brokenBrick.x = 100;
		brokenBrick.y = 100;
		//gameHolder.addChild(brokenBrick);


		/*
		sideArrows = new createjs.Container();
		leftArrow = imgLib['arrow'].clone();
		leftArrow.regX = 289/2;
		leftArrow.regY = 222/2;
		leftArrow.rotation = 90;
		sideArrows.addChild(leftArrow);
		rightArrow = imgLib['arrow'].clone();
		rightArrow.regX = 289/2;
		rightArrow.regY = 222/2;
		rightArrow.rotation = -90;
		rightArrow.x = 770;
		sideArrows.addChild(rightArrow);
		sideArrows.x = 190;
		sideArrows.y = 760;
		sideArrows.alpha = 0;
		sideArrows.scaleY = sideArrows.scaleX = .5;
		gameHolder.addChild(sideArrows);
		*/

		imgLib['arrows'].y = 490;
		imgLib['arrows'].x = 114;
		imgLib['arrows'].alpha = 0;
		



		gameHolder.addChild(imgLib['arrows']);


		imgLib['next_level_txt'].y = 290;
		imgLib['next_level_txt'].alpha = 0;
		gameHolder.addChild(imgLib['next_level_txt']);

		imgLib['click_to_protect_txt'].y = 90;
		gameHolder.addChild(imgLib['click_to_protect_txt']);

		helmetPhone = new createjs.Container();
		var helmetRegX = 364/2;
		helmetPhone.regX = helmetRegX;
		helmetPhone.x = 202 + helmetRegX;
		helmetPhone.y = 623;

		currentHelmetY = helmetPhone.x + 240;

		imgLib['helmet_bottom'].y = helmetStartY;
		helmetPhone.addChild( imgLib['helmet_bottom'] );
		imgLib['phone'].x = 62;
		helmetPhone.addChild( imgLib['phone'] );

		imgLib['helmet_top'].y = helmetStartY;
		helmetPhone.addChild( imgLib['helmet_top'] );
		helmetPhone.onPress = setHelmetOnPhone;

		gameHolder.addChild( helmetPhone );

		downArrow = imgLib['arrow'].clone();
		downArrow.x = 240;
		downArrow.y = 200;
		downArrow.onPress = setHelmetOnPhone;
		gameHolder.addChild(downArrow);


		endScorePage = new createjs.Container();
		endScorePage.alpha = 0;
		endScorePage.y = 130;

		imgLib['level_score_endframe'].y = 100;

		endScore = new createjs.Text("n/a", "90px Arial", "ffffff");
		endScore.x = 768/2;
		endScore.textAlign = "center";
		endScore.y = 430;

		endLevel = new createjs.Text("n/a", "90px Arial", "ffffff");
		endLevel.x = 360;
		endScore.textAlign = "center";
		endLevel.y = 200;
		
		endScorePage.addChild(endLevel);
		endScorePage.addChild(imgLib['level_score_endframe']);
		endScorePage.addChild(endScore);

		gameHolder.addChild(endScorePage);


		imgLib['end_frame_bg'].alpha = 0;
		gameHolder.addChild(imgLib['end_frame_bg']);
		imgLib['end_txt_behind_phone'].alpha = 0;
		gameHolder.addChild(imgLib['end_txt_behind_phone']);
		imgLib['end_phone'].alpha = 0;
		gameHolder.addChild(imgLib['end_phone']);



		// SCORE PANEL
		scorePanel = new createjs.Container();
		scorePanel.alpha = 0;

		scoreTxt = new createjs.Text(score, "39px Arial", "ffffff");
		scoreTxt.x = 660;
		scoreTxt.y = 35;
		//levelTxt.textAlign = "left";

		levelTxt = new createjs.Text(levelNum, "39px Arial", "ffffff");
		levelTxt.x = 400;
		levelTxt.y = 35;
		//levelTxt.textAlign = "center";
	
		scorePanel.addChild(imgLib['level_score_txt']);
		scorePanel.addChild(levelTxt);
		scorePanel.addChild(scoreTxt);

		gameHolder.addChild(scorePanel);
		// SCORE PANEL END
		




		
		





		gameHolder.addChild(brokenBottle);


		//var shadow = new createjs.Shadow("#000000", 0, 0, 10);
		//imgLib['sim'].shadow = shadow;

		stage.addChild(gameHolder);
	}

	function setHelmetOnPhone(){
		if (firstTouch){

			admaxim_ad_experience.trackEvent('set_helment_click');
			firstTouch = false;
			//console.log('setHelmetOnArrow');
			
			createjs.Tween.get(imgLib['click_to_protect_txt'])
				.to({alpha:0}, 500)
				.call(function(){gameHolder.removeChild(imgLib['click_to_protect_txt'])});

			createjs.Tween.get(scorePanel)
				.to({alpha:1}, 500);	

			createjs.Tween.get(downArrow)
				.to({alpha:0},500);

			var wait = 300;
			var dropSpeed = 600;
			var dropEase = createjs.Ease.quadInOut;

			createjs.Tween.get( imgLib['helmet_top'] )
				.wait(wait)
				.to({y:helmetEndY}, dropSpeed, dropEase)
				.call(function(){playEffect('helmet_on');});

			createjs.Tween.get( imgLib['helmet_bottom'] )
				.wait(wait)
				.to({y:helmetEndY}, dropSpeed, dropEase)
				.wait(1000)
				.call(makePhoneDraggable)
				.call(gameStart);

			createjs.Tween.get( imgLib['arrows'] )
				.wait(wait)
				.to({alpha:.8}, dropSpeed);
		}

		//startDroppingItems();	
	}

	function makePhoneDraggable(){

		helmetPhone.onPress = enableHorizontalDrag;

	}


	var currentHelmetY = 0;

	function enableHorizontalDrag(evt){
		var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
		var leftPad = 140;
		var rightPad = 768 - 140;
		if (imgLib['arrows'].alpha != 0) imgLib['arrows'].alpha = 0;
		
		evt.onMouseMove = function(ev) {
			var offsetX = ev.stageX+offset.x;
			var offsetY = ev.stageY+offset.y;
			if (offsetX > leftPad && offsetX < rightPad){
				ev.target.x = offsetX;
				currentHelmetSlot = Math.ceil(offsetX / DROP_SLOT_W);
				////console.log(currentHelmetSlot);
				currentHelmetY = offsetY;
				ev.target.y = currentHelmetY;
			} else if (offsetX <= leftPad){
				ev.target.x = leftPad;
				ev.target.y = offsetY;
				//console.log('leftPad');
			} else if (offsetX >= rightPad){
				ev.target.x = rightPad;
				ev.target.y = offsetY;
				//console.log('rightPad');
			}
			////console.log("evt.target.id:" + evt.target.id + ", x:" +  offsetX + ", y:" + offsetY);
		}


		
	}

	var itemHolder;
	var levelTxt;

	function gameStart(){

		admaxim_ad_experience.trackEvent('game_start');

		imgLib['horseshoe'].regX = 214/2;
		imgLib['horseshoe'].regY = 214;

		imgLib['brick'].regX = 308/2;
		imgLib['brick'].regY = 207;

		imgLib['bottle'].regX = 634/2;
		imgLib['bottle'].regY = 411;

		playerArray = [];

		for (var i = 0; i <= guysLeft; i++){
			var xPad = 76;
			var player = imgLib['helmet_small'].clone();
			player.x = 50 + (i * xPad);
			player.y = 40;
			playerArray.push(player);
			gameHolder.addChild(player);
		}	

		itemList = [imgLib['horseshoe'], imgLib['brick'], imgLib['bottle']];



		startDroppingItems();

	}

	var droppingActive = false;

	function startDroppingItems(){
		itemHolder = new createjs.Container();
		gameHolder.addChild(itemHolder);

		droppingActive = true;
		dropItemInterval();
	}

	function stopDroppingItems(){
		droppingActive = false;
		removeActiveItems();
		createjs.Tween.get(stage,null,true);
		//createjs.Tween.get(stage, {override:true})
			//.wait(1000);
	}

	var dropIntervalSpeed = 1300;

	function dropItemInterval(){
		if (droppingActive){
			createjs.Tween.get(stage, {override:true})
				.call(function(){
					var itemNum = randomNumberBetween(0,2);
					var item = itemList[itemNum].clone();
					item.num = itemNum;
					item.active = true;
					var slot = randomNumberBetween(0,2);
					dropAnItem(item, slot);
				})
				.wait(dropIntervalSpeed)
				.call(function(){dropItemInterval();});
		}
	}

	function removeActiveItems(){
		if (itemHolder) {
			//console.log('yes image holder');
			//console.log('itemHolder.children.length' + itemHolder.children.length);
			for (var i = 0; i < itemHolder.children.length; i++){

				if (itemHolder.children[i].active) {
					//console.log('itemHolder.children[i].active removed' + i);
					itemHolder.removeChild(itemHolder.children[i]);
				}
			}
		}
	}

	var dropSpeed = 40;
	var dropStartSpeed = 40;
	var speedIncrement = 20;
	var levelNum = 1;
	var oldLevel = 1;

	function dropAnItem(item, slot){
		item.slot = slot + 1;
		item.x = SLOT_X_ARRAY[slot];
		itemHolder.addChild( item );
	
		var hitPadHigh = 20;
		var hitPadLow = 140;
		var hitSpot = currentHelmetY;

		item.onTick = function(){

			var element = this;
			if (element.y < DROP_SLOT_END){
				
				if (element.y >= hitSpot - hitPadHigh && element.y <= hitSpot + hitPadLow &&
				element.slot === currentHelmetSlot && element.active){
					
					this.active = false;

					switch(element.num){
						case 0:
						playEffect('shoe');
						bounceHorseshoe(element);
						break;

						case 1:
						playEffect('brick');
						breakBrick(element);
						break;

						case 2:
						playEffect('bottle');
						//playBottleBreakAni(element);
						breakBottle(element);
						break;

						default:
						itemHolder.removeChild(element);
						break;
					}

					score += 100;

					levelNum = Math.floor(score / 500) + 1;
					
					if (levelNum != oldLevel){

						createjs.Tween.get(gameHolder, {override:true})
							.wait(500)
							.call(function(){
								//clearInterval(dropItemInterval);
								stopDroppingItems();
								dropIntervalSpeed -= ITEM_INCREASE;
								playEffect('level_up');
								removeActiveItems();
								//gameHolder.removeChild(itemHolder);
								//levelTxt.text = "Level " + levelNum;
								imgLib['next_level_txt'].alpha = 1;

								scoreTxt.text = score;
								levelTxt.text = levelNum;

							})
							.wait(1300)
							.call(function(){
								startDroppingItems();
								//levelTxt.alpha = 0;
								imgLib['next_level_txt'].alpha = 0;
							});

					} else {
						scoreTxt.text = score;
						levelTxt.text = levelNum;
					}

					dropSpeed = dropStartSpeed + (levelNum * speedIncrement);
					oldLevel = levelNum;



				} else {
					element.y += dropSpeed;
				}
			} else {
				if (element.active){

					itemHolder.removeChild(element);
					admaxim_ad_experience.trackEvent(guysLeft + '_guys_left');

					guysLeft -= 1;
					if (guysLeft >= -1) { gameHolder.removeChild(playerArray[guysLeft+1]); }

					
					if (guysLeft === -1) {
						playEffect('lose');
						gameOver();
					} else {

						//clearInterval(dropItemInterval);
						stopDroppingItems();
						//gameHolder.removeChild(itemHolder);
						imgLib['hit_all_txt'].y = 290;
						imgLib['hit_all_txt'].alpha = 1;
						gameHolder.addChild(imgLib['hit_all_txt']);

						playEffect('lose');
						createjs.Tween.get(imgLib['hit_all_txt'])
							.wait(2000)
							.to({alpha:0}, 600)
							.call(function(){gameHolder.removeChild(imgLib['hit_all_txt']);})
							.call(startDroppingItems);
					}

				} 
			}
		}
	

	}

	function playBottleBreakAni(element){
		//console.log('playBottleBreakAni');
		itemHolder.removeChild(element);

		breakAni.x = element.x - (768/2);
		breakAni.y = currentHelmetY-260;
		itemHolder.addChild(breakAni);
		breakAni.gotoAndPlay();
		breakAni.onAnimationEnd = function () { itemHolder.removeChild(breakAni); };
	}

	function breakBottle(bottle){
		var bb_1 = imgLib['bb_1'].clone();
		var bb_2 = imgLib['bb_2'].clone();
		var bb_3 = imgLib['bb_3'].clone();
		var bb_4 = imgLib['bb_4'].clone();
		var bb_5 = imgLib['bb_5'].clone();

		bb_1.x = bottle.x - 65;
		bb_1.y = bottle.y - 317;
		bb_2.x = bottle.x - 42;
		bb_2.y = bottle.y - 204;
		bb_3.x = bottle.x + 10;
		bb_3.y = bottle.y - 194;
		bb_4.x = bottle.x + 48;
		bb_4.y = bottle.y - 86;
		bb_5.x = bottle.x + 84;
		bb_5.y = bottle.y - 139;

		itemHolder.addChild(bb_1);
		itemHolder.addChild(bb_2);
		itemHolder.addChild(bb_3);
		itemHolder.addChild(bb_4);
		itemHolder.addChild(bb_5);

		var direction = (bottle.x > helmetPhone.x) ? 1 : -1;
		//var difference = bottle.x - helmetPhone.x;

		itemHolder.removeChild(bottle);

		//var rot = 1200;
		var scale = .3;
		var spinSpeed = 2500;
		var bounceHeight = 10;

		animateGlassPiece(bb_1, bounceHeight, -(randomNumberBetween(100,200)), -(randomNumberBetween(900,1400)), scale, spinSpeed);
		animateGlassPiece(bb_2, bounceHeight, -(randomNumberBetween(100,200)), -(randomNumberBetween(900,1400)), scale, spinSpeed);
		animateGlassPiece(bb_3, bounceHeight, (randomNumberBetween(100,200)), (randomNumberBetween(900,1400)), scale, spinSpeed);
		animateGlassPiece(bb_4, bounceHeight, (randomNumberBetween(100,200))*-direction, (randomNumberBetween(900,1400))*direction, scale, spinSpeed);
		animateGlassPiece(bb_5, bounceHeight, (randomNumberBetween(100,200)), (randomNumberBetween(900,1400)), scale, spinSpeed);

	}


	function animateGlassPiece(element, bounce, distance, rot, scale, spinSpeed){
		createjs.Tween.get(element)
			.to({y:element.y - bounce, x:element.x + distance}, 200, createjs.Ease.quadOut)
			.to({y:DROP_SLOT_END, x:element.x + (distance * 4)}, 1300, createjs.Ease.quadIn)
			.call(function(){itemHolder.removeChild(element)});

		createjs.Tween.get(element, {override:false})
			.to({rotation:rot, scaleX:scale, scaleY:scale, alpha:0},spinSpeed);
	}

	function breakBrick(brick){
		//console.log('breakBrick');
		var brick_left = imgLib['brick_left'].clone();
		brick_left.x = brick.x - 60;
		brick_left.y = brick.y - 90;
		
		var brick_right = imgLib['brick_right'].clone();
		brick_right.x = brick.x + 60;
		brick_right.y = brick.y - 60;

		itemHolder.removeChild(brick);
		itemHolder.addChild(brick_left);
		itemHolder.addChild(brick_right);

		var bounceOut = 140;
		
		createjs.Tween.get(brick_left)
			.to({y:brick_left.y - 60, x:brick_left.x - bounceOut}, 300, createjs.Ease.quadOut)
			.to({y:DROP_SLOT_END, x:brick_left.x + (-bounceOut * 4)}, 1300, createjs.Ease.quadIn)
			.call(function(){itemHolder.removeChild(brick_left)});

		createjs.Tween.get(brick_left, {override:false})
			.to({rotation:-1200, scaleX:.3, scaleY:.3, alpha:0},2500);

		createjs.Tween.get(brick_right)
			.to({y:brick_right.y - 60, x:brick_right.x + bounceOut}, 300, createjs.Ease.quadOut)
			.to({y:DROP_SLOT_END, x:brick_right.x + (bounceOut * 4)}, 1300, createjs.Ease.quadIn)
			.call(function(){itemHolder.removeChild(brick_right)});

		createjs.Tween.get(brick_right, {override:false})
			.to({rotation:1200, scaleX:.3, scaleY:.3, alpha:0},2500);
							
	}

	function bounceHorseshoe(shoe){
		
		shoe.regX = 107;
		shoe.regY = 107;
		shoe.y = currentHelmetY-40;

		var direction = (shoe.x > helmetPhone.x) ? 1 : -1;
		var difference = shoe.x - helmetPhone.x;

		createjs.Tween.get(shoe)
			.to({y:shoe.y - 200, x:shoe.x + difference}, 300, createjs.Ease.quadOut)
			.to({y:DROP_SLOT_END, x:shoe.x + (difference * 4)}, 1300, createjs.Ease.quadIn)
			.call(function(){itemHolder.removeChild(shoe)});

		createjs.Tween.get(shoe, {override:false})
			.to({rotation:1200*direction, scaleX:.3, scaleY:.3, alpha:0},2500);

	}




	function gameOver(){
		//console.log('gameOver');

		stopDroppingItems();

		endScore.text = score;
		endLevel.text = levelNum;

		admaxim_ad_experience.trackEvent('game_over');

		admaxim_ad_experience.trackEvent('final_score_' + score);


		createjs.Tween.get(endScorePage)
			.to({alpha:1}, 600);


		var frameEnterSpeed = 600;

		createjs.Tween.get(itemHolder)
			.to({alpha:0}, frameEnterSpeed)
			.call(function(){gameHolder.removeChild(itemHolder);});

		createjs.Tween.get(helmetPhone)
			.to({alpha:0}, frameEnterSpeed)
			.call(function(){gameHolder.removeChild(helmetPhone);});

		createjs.Tween.get(scorePanel)
			.to({alpha:0}, frameEnterSpeed)
			.call(function(){gameHolder.removeChild(itemHolder);})
			.wait(2000)
			.call(function(){ addFinalScreen(); });

	}

	function addFinalScreen(){

		var frameEnterSpeed = 600;

		imgLib['end_txt_behind_phone'].alpha = 0;
		imgLib['end_txt_behind_phone'].x = 230;
		imgLib['end_txt_behind_phone'].y = 350;

		imgLib['end_phone'].alpha = 0;
		imgLib['end_phone'].x = 190;
		imgLib['end_phone'].y = 240;


		createjs.Tween.get(imgLib['end_phone']).to({alpha:1}, frameEnterSpeed);
		createjs.Tween.get(imgLib['end_txt_behind_phone']).wait(frameEnterSpeed).to({alpha:1}, 0);			
			


		var outSpeed = 900;
		createjs.Tween.get(imgLib['end_txt_behind_phone'])
			.wait(frameEnterSpeed+1500)
			.to({x:imgLib['end_txt_behind_phone'].x + 160}, 900, createjs.Ease.quadInOut);

		createjs.Tween.get(imgLib['end_phone'])
			.wait(frameEnterSpeed+1500)
			.to({x:imgLib['end_phone'].x - 160}, 900, createjs.Ease.quadInOut);				


		//createjs.Tween.get(scoreTxt).wait(frameEnterSpeed+1500).to({alpha:0}, 900);			
		//createjs.Tween.get(levelTxt).wait(frameEnterSpeed+1500).to({alpha:0}, 900);			
		

		createjs.Tween.get(imgLib['end_frame_bg'])
			.to({alpha:1}, frameEnterSpeed);

		imgLib['end_frame_bg'].onPress = openFinalLink;


		createjs.Tween.get(itemHolder)
			.to({alpha:0}, frameEnterSpeed)
			.call(function(){gameHolder.removeChild(itemHolder);});		


		admaxim_ad_experience.trackEvent('time_spent_' + createjs.Ticker.getTime());
		//admaxim_ad_experience.trackEvent('getFPS' + createjs.Ticker.getFPS());
		//admaxim_ad_experience.trackEvent('getMeasuredFPS' + createjs.Ticker.getMeasuredFPS());	
		//admaxim_ad_experience.trackEvent('getTicks' + createjs.Ticker.getMeasuredFPS());	
	
	}













	function randomNumberBetween(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}





	function openFinalLink(){
		//console.log('openFinalLink');
		admaxim_ad_experience.trackEvent('click_to_vodafone');
		window.open(FINAL_URL);
	}

	function dragMe(evt){
		var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
		evt.onMouseMove = function(ev) {
			var offsetX = ev.stageX+offset.x;
			var offsetY = ev.stageY+offset.y;
			ev.target.x = offsetX;
			ev.target.y = offsetY;
			//console.log("evt.target.id:" + evt.target.id + ", x:" +  offsetX + ", y:" + offsetY);
		}
	}























	var won = false;

	function dragSim(evt){
		if (!won){
			admaxim_ad_experience.trackEvent('click_sim');
			playEffect('press_sim');
			var shadow = new createjs.Shadow("#000000", 0, 0, 20);
			imgLib['sim'].shadow = shadow;

			var offset = {x:evt.target.x-evt.stageX, y:evt.target.y-evt.stageY};
			evt.onMouseMove = function(ev) {
				var offsetX = ev.stageX+offset.x;
				var offsetY = ev.stageY+offset.y;
				//console.log(offsetX);

				var winRangeX = 75;
				var winRangeY = 30;
				var winX = 265;
				var winY = 619;
				if (offsetX < (winX + winRangeX) && offsetX > (winX - winRangeX) && offsetY < (winY + winRangeY) && offsetY > (winY - winRangeY) && !won){
					won = true;
					imgLib['sim'].onPress = null;

					createjs.Tween.get(imgLib['txt_drag_sim'])
						.to({alpha:0},500)
					;

					createjs.Tween.get(imgLib['sim'])
						.to({x:338,y:winY},500,createjs.Ease.quadInOut)
						.call(function(){
							phonePage.removeChild(imgLib['sim_holder']);
							phonePage.addChild(imgLib['sim_holder']);
							playEffect('win');
						})
						.wait(400)
						.to({x:338-136},700,createjs.Ease.quadInOut)
						.call(function(){
							var newMaskScale = 6;
							createjs.Tween.get(phoneRedMask).to({scaleX:newMaskScale,scaleY:newMaskScale},2000, createjs.Ease.quadInOut);
							//createjs.Tween.get(phonePage).to({y:-200},200, createjs.Ease.quadInOut);
						})
						.wait(2000)
						.call(gameOver)
					;
				} 

				ev.target.x = offsetX;
				ev.target.y = offsetY;
				////console.log("evt.target.id:" + evt.target.id + ", x:" +  offsetX + ", y:" + offsetY);
			}

			evt.onMouseUp = function(ev) {
				if (!won){
					//imgLib['sim'].shadow = null;
					var shadow = new createjs.Shadow("#000000", 0, 0, 10);
					imgLib['sim'].shadow = shadow;
					playEffect('release_sim');
				}

			}
		}
	}

































	
	function monitorTrack(effectName){
		if (trackPlaying) {
			var end = trackDic[effectName].end;
			var audioTag = document.getElementById('track1');
			var currentTime = audioTag.currentTime;
			
			if (currentTime >= end){
				window.clearInterval(audioTimer);
				audioTag.pause();
				trackPlaying = false;
				//console.log('sound effect done');
			}
			
		}
	}
	
	function playEffect(effectName){
		if (audioLoaded){
			if (audioTimer) window.clearInterval(audioTimer);
			
			var audioTag = document.getElementById('track1');
			audioTag.pause();
			var track = trackDic[effectName];
			////console.log();
			//console.log('play effect ' + effectName + ' time:' + track.start);
			
			audioTag.currentTime = track.start;
			audioTag.play();
			
			trackPlaying = true;
			audioTimer = setInterval(function(){monitorTrack(effectName);}, 1);
		}
	}
			
	function preloadAudio(){
		if (!audioLoaded){
			
			for (var i = 0; i < TRACKS.length; i++){
				var trackObj = {};
				trackObj.start = TRACKS[i].start;
				trackObj.end = TRACKS[i].end;
				trackDic[TRACKS[i].name] = trackObj;
				//console.log('added effect: ' + TRACKS[i].name);
			}
			
			var tag = "<audio id='track1'><source src='" + MP3_URL + "'></audio>";
			$('#am_page_wrapper').append(tag);
			var audioTag = document.getElementById('track1');
			
			//audioTag.addEventListener('ended',function(){audioTagEnded(e);},true);
			//audioTag.addEventListener('progress',function(e){audioTagProgress(e, userEvent);},true);
			
			audioTag.addEventListener('canplaythrough',function(e){	
				//console.log('canplaythrough');
				audioLoaded = true;
				admaxim_ad_experience.trackEvent('audio_ready');
				//startLevel(4000, 3500);
				//imgLib['loading'].holder.visible = false;
				////console.log(TRACKS);
			},true);
			

			if( isMobile.any() ){
				$('#track1').get(0).play();
			} else {
				audioTag.play();
			}
			
			audioTag.pause();
			
		} else {
			//imgLib['loading'].holder.visible = false;
			//startLevel(4000, 3500);
		}
	}




	function shrinkCanvasForHighRes(dimentions){
		var page_scale = (dimentions.w/768);
		$('#demoCanvas').attr({'width':'768px', 'height':'1200px'});
		//$('#demoCanvas').css({'position':'absolute', 'width':'768px', 'height':'1100px'});
		$('#am_page_wrapper').css({'position':'absolute', 'width':'768px', 'height':'1200px',
			'transform-origin':'0% 0%',
			'-ms-transform-origin':'0% 0%',
			'-webkit-transform-origin':'0% 0%',
			'-moz-transform-origin':'0% 0%',
			'-o-transform-origin':'0% 0%',
			'transform': 'scale('+page_scale+','+page_scale+')',
			'-ms-transform': 'scale('+page_scale+','+page_scale+')',
			'-webkit-transform': 'scale('+page_scale+','+page_scale+')',
			'-o-transform': 'scale('+page_scale+','+page_scale+')',
			'-moz-transform': 'scale('+page_scale+','+page_scale+')',
			'-ms-transform': 'scale('+page_scale+','+page_scale+')'
		});
	}


} //end AM_Game













var cdnurl = '';
try{
	if (ADMAXIM_assetRoot != undefined) cdnurl += ADMAXIM_assetRoot + ADMAXIM_appId;
} catch(e){
	//console.log('no ADMAXIM_assetRoot, must be local build');
}

var am_game;
$(document).ready(function(){
	am_game = new AM_Game();
	am_game.init();
});

