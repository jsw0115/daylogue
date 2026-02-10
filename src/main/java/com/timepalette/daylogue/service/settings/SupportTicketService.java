package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketDto;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketQuery;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketRequest;

import java.util.List;

public interface SupportTicketService {

	/** (문의 생성) 사용자 문의 티켓을 생성한다. */
	ResponseResultModel create(String userId, SupportTicketRequest req);

	/** (문의 상세) 티켓 1건 조회(작성자 본인만) */
	ResponseResultModel get(String userId, String ticketId);

	/** (문의 목록) 내 문의 목록을 조회한다. (상태/기간 필터) */
	ResponseResultModel listMine(String userId, SupportTicketQuery query);

	/** (문의 수정) OPEN 상태에서만 수정 허용 등 정책 적용 가능 */
	ResponseResultModel update(String userId, String ticketId, SupportTicketRequest req);

	/** (문의 닫기) 사용자 측에서 CLOSE 요청(또는 운영에서 처리) */
	ResponseResultModel close(String userId, String ticketId);
}
