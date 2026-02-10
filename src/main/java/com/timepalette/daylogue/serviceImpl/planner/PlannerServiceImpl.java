package com.timepalette.daylogue.serviceImpl.planner;

import com.timepalette.daylogue.model.dto.event.UpsertScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.ScheduleDataResponseModel;
import com.timepalette.daylogue.service.planner.PlannerService;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class PlannerServiceImpl implements PlannerService {

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel getDaily(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel getWeekly(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel getMonthly(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel getYearly(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel getUpComing(UpsertScheduleRequestModel req) {
		return null;
	}
}
