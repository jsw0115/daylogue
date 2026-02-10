package com.timepalette.daylogue.model.entity.settings.enums;

/**
 * user_pref.time_fmt ENUM('24h','12h') 매핑용
 * - enum name을 그대로 쓰면 JPA가 'H24' 같은 값을 저장해버리니
 *   Converter로 DB 값('24h','12h')을 정확히 매핑한다.
 */
public enum TimeFmt {
	H24("24h"),
	H12("12h");

	private final String dbValue;

	TimeFmt(String dbValue) {
		this.dbValue = dbValue;
	}

	public String getDbValue() {
		return dbValue;
	}

	public static TimeFmt fromDbValue(String v) {
		if (v == null) return null;
		for (TimeFmt t : values()) {
			if (t.dbValue.equalsIgnoreCase(v)) return t;
		}
		throw new IllegalArgumentException("Unknown TimeFmt dbValue: " + v);
	}
}
