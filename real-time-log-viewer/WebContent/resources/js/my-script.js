var socket = new SockJS(contextPath + "/ws");
var stompClient = Stomp.over(socket);

var logContentClass = $(".log-content");
var logContentElement = document.getElementById("log-content");
var logContent;
var fileSize;
var isStoppedShowLog = false;
var isFirstTime = true;

var logStatus = 1;
var logType = 1;

// Callback function to be called when stomp client is connected to server
var connectCallback = function() {
	stompClient.subscribe('/log/viewer/show-line/' + sessionId, renderLog);
};

// Callback function to be called when stomp client could not connect to server
var errorCallback = function(error) {
	alert(error.headers.message);
};

// Connect to server via websocket
stompClient.connect("guest", "guest", connectCallback, errorCallback);

// Render log to UI line by line
function renderLog(frame) {

	if (!isStoppedShowLog && !isFirstTime) {
		var line = frame.body;
		
		setTimeout(function(){ 
			if (line.indexOf("ERROR") > 0) {
				
				logStatus = 1;
				prependLogContentLineByLine("error", line);
			} else if (line.indexOf("WARN") > 0) {
				
				logStatus = 2;
				prependLogContentLineByLine("warn", line);
			} else if (line.indexOf("DEBUG") > 0) {
				
				logStatus = 3;
				prependLogContentLineByLine("debug", line);
			} else if (line.indexOf("INFO") > 0) {
				
				logStatus = 4;
				prependLogContentLineByLine("info", line);
			} else {
				
				if (logStatus == 1) {
					prependLogContentLineByLine("error", line);
				} else if (logStatus == 2) {
					prependLogContentLineByLine("warn", line);
				} else if (logStatus == 3) {
					prependLogContentLineByLine("debug", line);
				} else {
					prependLogContentLineByLine("info", line);
				} 
			}
		}, 0.001);
	}
}

$(document).ready(function() {
	
	// Set file path from cookie to input field
	$('#filePath').val(getCookie("filePath"));
	
	// Show log when click Show Log button
	$('#show-log-btn').click(function(e) {
		
		$(".log-content").empty();
		e.preventDefault();
		$(".alert").hide();
		logType = $("#log-type").val();
		var filePath = $('#filePath').val();
		
		if (filePath != "") {
			
			// Save file path to cookie
			document.cookie = "filePath=" + filePath;
			
			// Call ajax to show log and check is first time to 
			// fix issue server can't response in the first time calling controller
			callAjaxShowLog(filePath);
			if (isFirstTime) {
				callAjaxShowLog(filePath);
				isFirstTime = false;
			}
			
		} else {
			$(".error-required").show();
		}
		
		return false;
	});
	
	$('#stop-start-btn').click(function(e) {
		
		// Start show log
		if(isStoppedShowLog) {
			$(this).text("Stop").removeClass("btn-info").addClass("btn-primary");
			$("#show-log-btn").attr({disabled: false, "title": ""});
			isStoppedShowLog = false;
		} else { // Stop show log
			$(this).text("Start").removeClass("btn-primary").addClass("btn-info");
			$("#show-log-btn").attr({disabled: true, "title": "Click Start button to unblock"});
			isStoppedShowLog = true;
		}
	});
	
	// Clear log
	$('#clear-btn').click(function(e) {
		$(".log-content").empty();
	});
	
	// Close alert message
	$(".alert .close").click(function(e) {
		$(this).parent().hide();
	});
	
	// Reload log when change log type
	$("#log-type").change(function() {
		
		if (!isFirstTime) {
			logType = $(this).val();
			showLoadingContainer(1000);
			if (logType == 1) {
				$("p.warn, p.info, p.debug").addClass("hide");
				$("p.error").removeClass("hide");
			} else if (logType == 2) {
				$("p.error, p.info, p.debug").addClass("hide");
				$("p.warn").removeClass("hide");
			} else if (logType == 3) {
				$("p.warn, p.info, p.error").addClass("hide");
				$("p.debug").removeClass("hide");
			} else if (logType == 4) {
				$("p.warn, p.error, p.debug").addClass("hide");
				$("p.info").removeClass("hide");
			} else {
				$("p").removeClass("hide");
			}
		}
	});
});

/**
 * Use Ajax to call controller for showing log
 */
function callAjaxShowLog() {
	
	$(".loading-area").show();
	$.ajax({
		url:  contextPath + "/show-log",
	    type: 'POST',
	    data: { filePath: $('#filePath').val()},
		success: function(data) {
			if(data == 0) {
				$(".error-failure").show();
				$(".loading-area").hide();
			} else {
				setTimeout(function(){ 
					$(".loading-area").hide();
				}, data);
			}
		},
		error:function(xhr, status) {
			$(".error-failure").show();
			$(".loading-area").hide();
		}
   	});
}

/**
 * Show loading container when wating time
 * 
 * @param sleepTime
 */
function showLoadingContainer(sleepTime) {
	$(".loading-area").show();
	setTimeout(function(){ 
		$(".loading-area").hide();
	}, sleepTime);
}

/**
 * Prepend log line by line into log content area
 * 
 * @param classStyle
 * @param logLine
 */
function prependLogContentLineByLine(classStyle, logLine) {
	
	if(logType != 0 && logType != logStatus) {
		classStyle += " hide"; 
	}
		
	logContentClass.prepend("<p class='" + classStyle + "'>" + logLine + "</p>");
}

/**
 * Get cookie to initial file path
 * 
 * @param cname
 */
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}