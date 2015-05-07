/*************************************************************************************
Setup and Display
*************************************************************************************/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var flag = [];
var speed =1000;
var timeout;

window.onload = function(){
	canvas.width = '600';
	canvas.height = '600';
	document.getElementById('display').appendChild(canvas);
	buttonHandler();
};

var buttonHandler = function(){
	document.getElementById('run-button').onclick = function(){runSort()};
	document.getElementById('reset').onclick = function(){reset()};
	var button1x = document.getElementById('1X');
	button1x.disabled=true;
	button1x.onclick = function(){setSpeed(1000, 0)};
	document.getElementById('2X').onclick = function(){setSpeed(500, 1)};
	document.getElementById('4X').onclick = function(){setSpeed(250, 2)};
	document.getElementById('Max').onclick = function(){setSpeed(100, 3)};
}

var generateList = function(size){
	var list =[];
	for (var i = 1 ; i <= size ; i++){
		list.push(i);
	}
	shuffle(list);
	return list;
}

var drawGraph = function(list, color){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	var spacing = ((canvas.width-20)/list.length);
	
	for(var i = 0 ; i <= list.length ; i++){
		
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.moveTo(spacing*(i+1), canvas.height);
		ctx.lineTo(spacing*(i+1), canvas.height-(list[i]*spacing));
		if((flag[0] == i || flag[1] == i) && color){
			ctx.strokeStyle= '#ff0000';
		} else{
			ctx.strokeStyle='#000000';
		}
		ctx.stroke();
	}
}

/*************************************************************************************
Setup and Display
*************************************************************************************/


var runSort = function(){
	var size = document.getElementById('sort-size');
	document.getElementById('choose-sort').disabled = true;
	size.disabled = true;
	document.getElementById('run-button').disabled = true;
	switch(document.getElementById('choose-sort').value){
		case 'select':
			if(size.value == 0){
				alert('Please choose a size!');
				unlock();
				break;
			}
			selectionSort(size.value);
			break;
		case 'insert':
			if(size.value == 0){
				alert('Please choose a size!');
				unlock();
				break;
			}
			insertionSort(size.value);
			break;
		case 'merge':
			if(size.value == 0){
				alert('Please choose a size!');
				unlock();
				break;
			}
			mergeSort(size.value);
			break;
		default:
			alert('Please choose an algorithm!');
			unlock();
			break;
	}
}


var setSpeed = function(speed, index){
	var buttons = document.getElementsByClassName('speed');
	for(var i = 0 ; i < buttons.length; i++){
		buttons[i].disabled = false;
	}
	buttons[index].disabled = true;
	this.speed = speed;
}

var reset = function(){
	clearTimeout(timeout);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	list = [];
	flag = [];
	unlock();
}
var unlock = function(){
	document.getElementById('choose-sort').disabled = false;
	document.getElementById('sort-size').disabled = false;
	document.getElementById('run-button').disabled = false;
}
/*************************************************************************************
Simple Sorting Algorithms
*************************************************************************************/
var swap = function(list, index1, index2){
	var tempList = list;
	var temp = tempList[index1];
	tempList[index1] = tempList[index2];
	tempList[index2] = temp;
	return tempList
}

var selectionSort = function(size){
	var list = generateList(size);
	drawGraph(list, false);
	var i = 0 ;
	function outerLoop(){
		timeout = setTimeout(function() {
	//for(var i = 0 ; i < list.length; i++){
			var smallest = Number.MAX_VALUE;
			var sIndex = Number.MAX_VALUE;
			for(var j = i; j < list.length; j++){
				if(list[j] < smallest){
					smallest = list[j];
					sIndex = j;
				}
			}
			swap(list, i, sIndex);
			flag = [i, sIndex];
			drawGraph(list, true);
			i++;
			if(i < list.length){
				outerLoop();
			} else{	
				unlock();
				drawGraph(list, false);
			}
		}, speed)
	}
	outerLoop();
}

var insertionSort = function(size){
	var list = generateList(size);
	drawGraph(list, false);
	var i = 0;
	function outerLoop(){
		timeout = setTimeout(function(){
			var current = list[i]
			for(var j = i ; j > 0 ; j--){
				if(list[j-1] > current){
					swap(list, j, j-1);
					flag = [j-1,j-1];
					drawGraph(list, true);
				} else{
					break;
				}
			}
			i++;
			if(i < list.length){
				outerLoop();
			}else{
				unlock();	
				drawGraph(list, false);
			}
		}, speed)
		
	}
	outerLoop();
}

/*************************************************************************************
Efficient Sorting Algorithms
*************************************************************************************/
var mergeSort = function(size){
	var list = generateList(size);
	console.log(list);
	drawGraph(list, false);
	var i = 2;
	function outerLoop(){
		timeout = setTimeout(function(){
			for(var j = 0 ; j < list.length; j+= i){
				if(i == 2){
					if(list[j] > list[j+1]){
						swap(list, j, j+1);
						drawGraph(list);
					}
				} else{
					list = merge(list, i/2, j);
					drawGraph(list);
				}
			}
			i*=2;
			if(i < list.length*2){
				outerLoop();
			} else{
				unlock();
			}
		}, speed)
	}
	outerLoop();
}

var merge = function(list, size, index){
	var newList = [];
	//divide list into two parts
	if(index > 0){
		newList = newList.concat(list.splice(0,index));
	}
	var left = list.splice(0, size);
	var right = list.splice(0, size);
	//if there's anything left over
	if(list.length != 0){
		var rest = list.splice(0);
	} else{
		rest =[];
	}
	
	while(left.length != 0 && right.length !=0){
		if(left[0] <= right[0]){
			newList = newList.concat(left.splice(0,1));
		}else{
			newList = newList.concat(right.splice(0,1));
		}
	}
	
	while(left.length !=0){
		newList = newList.concat(left.splice(0,1));
	}
	
	while(right.length !=0){
		newList = newList.concat(right.splice(0,1));
	}
	
	if(rest.length != 0){
		newList = newList.concat(rest);
	}
	return newList;
}


/**********************************************************************
Fisher-Yates Shuffle from : http://bost.ocks.org/mike/shuffle/
**********************************************************************/
function shuffle(array) {
	var m = array.length, t, i;

	// While there remain elements to shuffle…
	while (m) {
		// Pick a remaining element…
		i = Math.floor(Math.random() * m--);

		// And swap it with the current element.
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}

	return array;
}
