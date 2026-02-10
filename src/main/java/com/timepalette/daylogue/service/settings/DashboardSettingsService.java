package com.timepalette.daylogue.service.settings;

import com.timepalette.daylogue.model.dto.common.ResponseResultModel;
import com.timepalette.daylogue.model.dto.settings.dashboard.*;

import java.util.List;
import java.util.Map;

public interface DashboardSettingsService {

	/** (대시보드 전체 조회) 레이아웃 + 포틀릿 표시/옵션을 묶어 반환한다. (HomeDashboard bootstrap에 사용) */
	ResponseResultModel getDashboardSettings(String userId, String scope);

	/** (레이아웃 조회) breakpoint별 레이아웃 JSON을 조회한다. */
	ResponseResultModel getLayoutsByBreakpoint(String userId, String scope);

	/** (레이아웃 저장) breakpoint별 레이아웃 JSON을 upsert 한다. (dash_layout) */
	ResponseResultModel upsertLayouts(String userId, DashboardLayoutUpsertRequest req);

	/** (레이아웃 초기화) 서버 저장 레이아웃을 삭제/초기 상태로 되돌린다. */
	ResponseResultModel resetLayouts(String userId, String scope);

	/** (포틀릿 pref 조회) 포틀릿 표시 여부/정렬/옵션을 조회한다. (dash_portlet_pref) */
	ResponseResultModel listPortletPrefs(String userId);

	/** (포틀릿 pref 저장) 단일 포틀릿 표시 여부/옵션을 upsert 한다. */
	ResponseResultModel upsertPortletPref(String userId, DashPortletPrefUpsertRequest req);

	/** (포틀릿 pref 일괄 저장) Drawer에서 여러 포틀릿을 한 번에 저장한다. */
	ResponseResultModel bulkUpsertPortletPrefs(String userId, DashPortletPrefBulkUpsertRequest req);
}
