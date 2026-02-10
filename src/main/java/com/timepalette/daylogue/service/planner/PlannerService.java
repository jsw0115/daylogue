package com.timepalette.daylogue.service.planner;

import com.timepalette.daylogue.model.dto.event.UpsertScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.*;

public interface PlannerService {

	public ScheduleDataResponseModel getDaily(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel getWeekly(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel getMonthly(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel getYearly(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel getUpComing(UpsertScheduleRequestModel req);
}
