package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.data.*;

import java.util.List;

public interface DataSettingService {

	/** (작업 생성) 내보내기 작업을 생성한다. (data_job: PENDING) */
	ResponseResultModel createExportJob(String userId, DataJobRequest req);

	/** (작업 생성) 가져오기 작업을 생성한다. (업로드 파일 + 매핑 프로필 등 포함) */
	ResponseResultModel createImportJob(String userId, DataJobRequest req);

	/** (작업 생성) 백업 작업을 생성한다. */
	ResponseResultModel createBackupJob(String userId, DataJobRequest req);

	/** (작업 생성) 복원 작업을 생성한다. */
	ResponseResultModel createRestoreJob(String userId, DataJobRequest req);

	/** (작업 조회) 작업 상태/결과 파일을 조회한다. */
	ResponseResultModel getJob(String userId, String jobId);

	/** (작업 목록) 최근 작업 목록을 조회한다. (필터: typ, st, 기간) */
	ResponseResultModel listJobs(String userId, DataJobQuery query);

	/** (작업 취소) 진행 중/대기 작업을 취소한다. (가능 상태만) */
	ResponseResultModel cancelJob(String userId, String jobId);

	/** (파일 조회) 결과 파일 메타를 조회한다. (data_file) */
	ResponseResultModel getFile(String userId, String fileId);

	/** (파일 목록) 백업/내보내기/가져오기 파일 목록을 조회한다. */
	ResponseResultModel listFiles(String userId, DataFileQuery query);

	/** (매핑 프로필 생성) CSV/ICS 필드 매핑 프로필을 저장한다. */
	ResponseResultModel createMappingProfile(String userId, ImportMappingProfileRequest req);

	/** (매핑 프로필 목록) 저장된 매핑 프로필을 조회한다. */
	ResponseResultModel listMappingProfiles(String userId, String srcTyp);

	/** (매핑 프로필 수정) 매핑/규칙 JSON을 갱신한다. */
	ResponseResultModel updateMappingProfile(String userId, String profileId, ImportMappingProfileRequest req);

	/** (매핑 프로필 삭제) 매핑 프로필을 삭제한다. */
	ResponseResultModel deleteMappingProfile(String userId, String profileId);
}
