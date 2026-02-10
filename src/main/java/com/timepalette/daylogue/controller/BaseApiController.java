package com.timepalette.daylogue.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 *  전체 컨트롤러에서 사용하는 기본 API
 */
@CrossOrigin(origins = "http://localhost:3000")
public class BaseApiController {

	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	public Logger logger() {
		return logger;
	}
}
