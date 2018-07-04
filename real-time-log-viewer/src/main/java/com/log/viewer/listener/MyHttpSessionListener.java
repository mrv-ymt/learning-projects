package com.log.viewer.listener;

import javax.servlet.annotation.WebListener;
import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

import org.apache.commons.io.input.Tailer;

/**
 * The Listener will be called when session destroy to stop tailer 
 * 
 * @author ThienMai
 * @since 2017-08-19
 * 
 */
@WebListener
public class MyHttpSessionListener implements HttpSessionListener {

    @Override
    public void sessionDestroyed(HttpSessionEvent event) {
    	Tailer tailer = (Tailer) event.getSession().getAttribute("tailer");
    	if (tailer != null) {
    		tailer.stop();
    	}
    }

	@Override
	public void sessionCreated(HttpSessionEvent arg0) {
		// No need to implement
	}
}