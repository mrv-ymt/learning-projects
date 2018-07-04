package com.log.viewer.controller;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.io.input.Tailer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.log.viewer.listener.MyTailerListener;

/**
 * The controller is used to receive request from front-end 
 * 
 * @author ThienMai
 * @since 2017-08-19
 * 
 */
@Controller
public class LogViewerController {

	@Autowired
	private SimpMessagingTemplate template;

	@RequestMapping(value = "/show-log", method = RequestMethod.POST)
	@ResponseBody
	public long viewLog(@RequestParam("filePath") String filePath, HttpServletRequest request) throws Exception {

		Tailer tailer = (Tailer) request.getSession().getAttribute("tailer");
		File logFile = new File(filePath);
		long fileSize = logFile.length();

		if (logFile != null && fileSize > 0) {

			fileSize = fileSize / 1000 + 2000;
			if (tailer != null) {
				tailer.stop();
			} 
			
			tailer = new Tailer(logFile, new MyTailerListener(template, request.getSession().getId()), 500);     
			request.getSession().setAttribute("tailer", tailer);
		    tailer.run();
		} 

		return fileSize;
	}

	/**
	 * Server the main page
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String home(Model model) {

		return "home";
	}
}