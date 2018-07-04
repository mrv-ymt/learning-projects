<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix = "fn" %>
<%@ page session="false" %>
<html>
<head>
	<title>Log Viewer</title>
	<link rel="shortcut icon" href="<c:url value='/resources/image/images.jpg'/>" type="image/x-icon" />
	<link rel="stylesheet" href="<c:url value='/resources/css/bootstrap.min.css'/>" type="text/css" />
	<link rel="stylesheet" href="<c:url value='/resources/css/my-style.css'/>" type="text/css" />
</head>
<body>
	<div class="row">
		<table class="header">
			<tr>
				<td class="banner">
			  		<h1><img class="pull-left" src="<c:url value='/resources/image/images.jpg'/>"/>LOG VIEWER v.1.0.0</h1>
			  	</td>
			  	<td class="action-area">
			  		<div class="error-required alert alert-danger">
			        	<a href="#" class="close" aria-label="close">×</a>
			        	Please input file path.
			        </div>
			  		<div class="error-failure alert alert-danger">
			        	<a href="#" class="close" aria-label="close">×</a>
			        	Can't get file! Please choose file again.
			        </div>
			        <input type="text" name="filePath" id="filePath" class="form-control pull-left" placeholder="Path to log file" />
			  	</td>
			  	<td class="action-btn-area">
		        	<select class="form-control pull-left" id="log-type">
				        <option value="0">All</option>
				        <option value="1">Error</option>
				        <option value="2">Warn</option>
				        <option value="3">Debug</option>
				        <option value="4">Info</option>
				     </select>
			        <button type="button" id="show-log-btn" class="btn btn-success pull-left">Show Log</button>
			        <button type="button" id="stop-start-btn" class="btn btn-primary pull-left">Stop</button>
			        <button type="button" id="clear-btn" class="btn btn-danger">Clear</button>
			    </td>	
			</tr>		  	
	  	</table>
  	</div>
  	<div class="row">
		<div class="log-area">
			<div class="log-content" id="log-content"></div>
		</div>
	</div>
	
	<div class="loading-area" style="display:none">
		<div class="loading-img"><img src="<c:url value='/resources/image/ajax-loader.gif'/>"/>&nbsp;&nbsp;Please wait...</div>
		<div class="modal-backdrop fade in"></div>
	</div>
	
	<script type="text/javascript">
		var contextPath = '<%=request.getContextPath()%>';
		var sessionId = '<%=request.getSession().getId()%>';
	</script>
	<script src="<c:url value='/resources/js/jquery.min.js'/>"></script>
	<script src="<c:url value='/resources/js/bootstrap.min.js'/>"></script>
	<script src="<c:url value='/resources/js/sockjs-1.1.1.min.js'/>"></script>
   	<script src="<c:url value='/resources/js/stomp.js'/>"></script>  
  	<script src="<c:url value='/resources/js/my-script.js'/>"></script>  
</body>
</html>
