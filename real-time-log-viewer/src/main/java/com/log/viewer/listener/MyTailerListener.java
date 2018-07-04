package com.log.viewer.listener;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.io.input.TailerListenerAdapter;
import org.springframework.messaging.simp.SimpMessagingTemplate;

/**
 * The Listener will be called when having change in file
 * 
 * @author ThienMai
 * @since 2017-08-19
 * 
 */
public class MyTailerListener extends TailerListenerAdapter {

	private int numOfLine = 1;
	private List<String> logContent;
	private SimpMessagingTemplate template;
	private String sessionId;

	public MyTailerListener(SimpMessagingTemplate template, String sessionId) {
		this.template = template;
		this.logContent = new ArrayList<>();
		this.sessionId = sessionId;
	}

	@Override
	public void handle(String line) {

		logContent.add(numOfLine + ". " + line);
		template.convertAndSend("/log/viewer/show-line/" + sessionId, numOfLine + ". " + line);
		numOfLine++;
	}
}