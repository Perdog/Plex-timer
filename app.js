var version = "1.0.1"
var resetAll = false;

function startCount(left, total, $el) {
	if ($el[0].disabled == 'undefined' || $el[0].disabled == null) {
		$el[0].disabled = false;
	}
	
	if (!$el[0].disabled) {
		$el[0].disabled = true;
		progress(left, total, $el.next());
	}
}


function progress(timeleft, timetotal, $element) {
	
	var progressBarWidth = timeleft * $element.width() / timetotal;
	$element.find('div').animate({width: progressBarWidth}, 0, 'linear');
	
	if (timeleft < 121 && timeleft > 119 && !resetAll) {		
		setTimeout(function() {
			progress(timeleft - 1, timetotal, $element);
		}, 1000);
			
		var m = Math.floor(timeleft/60);
		var timeRemaining = ((m > 0) ? m + "M " : "") + Math.floor(timeleft%60) + "S";
		$element.find('span').text(timeRemaining);
		
		var loc = $element.parent().parent()["0"].firstElementChild.firstElementChild.value;//.find('input');
		var size = $element.prev()[0].id;
		notify("Get ready!", {body: "A " + size + " outpost will be available in 2 minutes, in" + loc});
	}
	else if (timeleft > 0) {
		if (!resetAll) {
			setTimeout(function() {
				progress(timeleft - 1, timetotal, $element);
			}, 1000);
			
			var m = Math.floor(timeleft/60);
			var timeRemaining = ((m > 0) ? m + "M " : "") + Math.floor(timeleft%60) + "S";
			$element.find('span').text(timeRemaining);
		}
	} else {
		$element.find('div').animate({width: 0}, 1, 'linear');
		$element.find('span').text("Spawned");
		
		var loc = $element.parent().parent()["0"].firstElementChild.firstElementChild.value;//.find('input');
		var size = $element.prev()[0].id;
		$element.prev()[0].disabled = false;
		
		notify("Ding!", {body: "A " + size + " outpost should be available in " + loc});
	}
	
	if (resetAll) {
		$element.find('div').animate({width: 0}, 1, 'linear');
		$element.find('span').text("Reset");
	}
}

function createSection($element) {
	var newRow = document.createElement("TR");
	var newBox = document.createElement("TD");
	var sysName = document.createElement("INPUT");
	sysName.setAttribute("type", "form-control");
	sysName.setAttribute("placeholder", "Enter system name here");
	//newBox.setAttribute("style", "vertical-align: middle")
	newBox.appendChild(sysName);
	newRow.appendChild(newBox);
	
	for (var i = 0; i < 4; i++)
	{
		var td = document.createElement("TD");
		var button = document.createElement("BUTTON");
		var barCont = document.createElement("DIV");
		var bar = document.createElement("DIV");
		
		// Assign shit to button
		button.setAttribute("id", (i === 0) ? "novice" : ((i === 1) ? "small" : ((i === 2) ? "medium" : "large")));
		button.setAttribute("type", "button");
		button.setAttribute("class", "btn btn-warning btn-block timer-button");
		button.setAttribute("onClick", "startCount(1800, 1800, $(this))");
		button.innerHTML = "Start";
		
		// Assign shit to bar container
		barCont.setAttribute("id", "progressBar");
		barCont.setAttribute("class", "progress");
		
		// Assign shit to the actual bar
		bar.setAttribute("class", "progress-bar progress-bar-info");
		bar.setAttribute("style", "width: 0%");
		barCont.appendChild(bar);
		barCont.appendChild(document.createElement("SPAN"));
		
		// Assign everything to the td
		td.appendChild(button);
		td.appendChild(barCont);
		
		// Assign td to the row
		newRow.appendChild(td);
	}
	
	
	var table = document.getElementById("table-parent");
	table.appendChild(newRow);
}

function resetTimers(ra) {
	var b = document.getElementsByClassName("timer-button");
	resetAll = ra;
	
	for (var i = 0; i < b.length; i++)
	{
		if (b[i].disabled == 'undefined' || b[i].disabled == null) {
			b[i].disabled = false;
		}
		
		b[i].disabled = resetAll;
	}
	
	if (resetAll) {
		setTimeout(function() {
					resetTimers(false);
				}, 2500);
		
		console.log("Reseting timers");
	}
}

function CheckPerms() {
	if (!("Notification" in window)) {
		console.log("Notifications not possible with this browser");
	} else if (Notification.permission === "default") {
		Notification.requestPermission(function (perm) {
			if (perm === "granted") {
				var not = notify("Thanks!", {body: "You will now be notified when plexs spawn!"});
			}
		});
	}
}

function notify(title, options) {
	
	if (!("Notification" in window) || Notification.permission !== "granted") {
		return;
	}
	
	title = title || "Time's up!";
	
	var o = {
		body: options.body || "",
		icon: options.icon || './notify.png'
	}
	var n = new Notification(title, o);
	console.log(n);
	
	setTimeout(function(){n.close()},10000);
	n.onclick=function(){
		n.close();
		window.focus();
	};
}

$(document).ready(function() {
	CheckPerms();
	console.log("loaded " + version);
});

$('.create-button').click(function() {
	createSection($(this));
});

$('.reset-button').click(function() {
	resetTimers(true);
});