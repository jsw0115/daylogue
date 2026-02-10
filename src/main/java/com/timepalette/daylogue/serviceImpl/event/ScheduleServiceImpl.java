package com.timepalette.daylogue.serviceImpl.event;

import com.timepalette.daylogue.model.dto.event.SearchRequestModel;
import com.timepalette.daylogue.model.dto.event.UpsertScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.CalendarResponseModel;
import com.timepalette.daylogue.model.dto.schedule.RepeatScheduleRequestModel;
import com.timepalette.daylogue.model.dto.schedule.RepeatScheduleResponseModel;
import com.timepalette.daylogue.model.dto.schedule.ScheduleDataResponseModel;
import com.timepalette.daylogue.service.event.ScheduleService;
import org.springframework.stereotype.Service;

/**
 *
 */
@Service
public class ScheduleServiceImpl implements ScheduleService {

	/**
	 *  검색 데이터 조회
	 * @since 2026.01.31
	 *
	 */
	@Override
	public CalendarResponseModel getSearchData(SearchRequestModel req) {
		//
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel addSchedule(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel updateSchedule(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public ScheduleDataResponseModel deleteSchedule(UpsertScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public RepeatScheduleResponseModel createRepeatSchedule(RepeatScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public RepeatScheduleResponseModel updateRepeatScheduleOnce(RepeatScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public RepeatScheduleResponseModel createRepeatScheduleFuture(RepeatScheduleRequestModel req) {
		return null;
	}

	/**
	 *
	 */
	@Override
	public RepeatScheduleResponseModel endRepeatSchedule(RepeatScheduleRequestModel req) {
		return null;
	}
}
