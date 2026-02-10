package com.timepalette.daylogue.service.event;

import com.timepalette.daylogue.model.dto.event.SearchRequestModel;
import com.timepalette.daylogue.model.dto.event.UpsertScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.CalendarResponseModel;
import com.timepalette.daylogue.model.dto.schedule.RepeatScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.RepeatScheduleResponseModel;
import com.timepalette.daylogue.model.dto.schedule.ScheduleDataResponseModel;

public interface ScheduleService {

	public CalendarResponseModel getSearchData(SearchRequestModel req);

	public ScheduleDataResponseModel addSchedule(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel updateSchedule(UpsertScheduleRequestModel req);

	public ScheduleDataResponseModel deleteSchedule(UpsertScheduleRequestModel req);

	public RepeatScheduleResponseModel createRepeatSchedule(RepeatScheduleRequestModel req);

	public RepeatScheduleResponseModel updateRepeatScheduleOnce(RepeatScheduleRequestModel req);

	public RepeatScheduleResponseModel createRepeatScheduleFuture(RepeatScheduleRequestModel req);

	public RepeatScheduleResponseModel endRepeatSchedule(RepeatScheduleRequestModel req);
}
