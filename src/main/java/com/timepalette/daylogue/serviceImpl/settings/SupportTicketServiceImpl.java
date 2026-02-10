package com.timepalette.daylogue.serviceImpl.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketDto;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketQuery;
import com.timepalette.daylogue.model.dto.settings.ticket.SupportTicketRequest;
import com.timepalette.daylogue.service.settings.SupportTicketService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SupportTicketServiceImpl implements SupportTicketService {

	/**
	 * (문의 생성) 사용자 문의 티켓을 생성한다.
	 */
	@Override
	public ResponseResultModel create(String userId, SupportTicketRequest req) {
		// 1. 요청 데이터 유효성 검증 (제목, 내용 등)
		// 2. SupportTicket 엔티티 생성
		// 3. userId, 요청 내용, 상태('OPEN') 등 초기값 설정
		// 4. DB에 저장
		// 5. 생성된 티켓 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		SupportTicketDto data = new SupportTicketDto();
		result.data = data;
		return result;
	}

	/**
	 * (문의 상세) 티켓 1건 조회(작성자 본인만)
	 */
	@Override
	public ResponseResultModel get(String userId, String ticketId) {
		// 1. ticketId로 티켓 정보 조회
		// 2. 티켓 존재 여부 및 작성자 본인(userId) 확인
		// 3. 조회된 엔티티를 DTO로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		SupportTicketDto data = new SupportTicketDto();
		result.data = data;
		return result;
	}

	/**
	 * (문의 목록) 내 문의 목록을 조회한다. (상태/기간 필터)
	 */
	@Override
	public ResponseResultModel listMine(String userId, SupportTicketQuery query) {
		// 1. userId와 쿼리 조건(상태, 기간 등)으로 DB에서 문의 목록 조회
		// 2. 페이징 처리
		// 3. 조회된 엔티티 목록을 DTO 리스트로 변환
		// 4. 결과 반환
		ResponseResultModel result = new ResponseResultModel();
		List<SupportTicketDto> data = new ArrayList<>();
		result.data = data;
		return result;
	}

	/**
	 * (문의 수정) OPEN 상태에서만 수정 허용 등 정책 적용 가능
	 */
	@Override
	public ResponseResultModel update(String userId, String ticketId, SupportTicketRequest req) {
		// 1. ticketId로 티켓 정보 조회
		// 2. 티켓 존재 여부 및 작성자 본인(userId) 확인
		// 3. 티켓 상태가 'OPEN'인지 등 수정 가능 여부 확인
		// 4. 요청 내용으로 티켓 정보 업데이트
		// 5. DB에 저장
		// 6. 수정된 티켓 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		SupportTicketDto data = new SupportTicketDto();
		result.data = data;
		return result;
	}

	/**
	 * (문의 닫기) 사용자 측에서 CLOSE 요청(또는 운영에서 처리)
	 */
	@Override
	public ResponseResultModel close(String userId, String ticketId) {
		// 1. ticketId로 티켓 정보 조회
		// 2. 티켓 존재 여부 및 작성자 본인(userId) 또는 관리자 권한 확인
		// 3. 티켓 상태를 'CLOSED'로 변경
		// 4. DB에 저장
		// 5. 변경된 티켓 정보를 DTO로 변환하여 반환
		ResponseResultModel result = new ResponseResultModel();
		SupportTicketDto data = new SupportTicketDto();
		result.data = data;
		return result;
	}
}
