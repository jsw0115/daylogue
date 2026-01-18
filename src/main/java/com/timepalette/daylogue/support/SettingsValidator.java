package com.timepalette.daylogue.support;

import com.timepalette.daylogue.model.dto.settings.CategoryDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.Set;
import java.util.regex.Pattern;

/**
 *
 */
public final class SettingsValidator {

	private SettingsValidator() {}

	private static final Pattern HHMM = Pattern.compile("^([01]\\d|2[0-3]):[0-5]\\d$");
	private static final Pattern HEX = Pattern.compile("^#[0-9A-Fa-f]{6}$");

	private static final Set<String> MODE = Set.of("J","P","B");
	private static final Set<String> EDIT_SC = Set.of("single","future");
	private static final Set<String> DEL_SC  = Set.of("none","single","future");
	private static final Set<String> THEME = Set.of("light","dark","pastel","default");

	public static void validateHHmm(String v, String field) {
		if (v == null) return;
		if (!HHMM.matcher(v).matches()) throw badRequest(field, "invalid_hhmm");
	}

	public static void validateMode(String mode) {
		if (!MODE.contains(mode)) throw unprocessable("mode", "not_allowed");
	}

	public static void validateStartScreen(String s) {
		if (s.isBlank() || s.length() > 32) throw unprocessable("defaultStartScreen", "invalid");
	}

	public static void validateDateFormat(String s) {
		if (s.isBlank() || s.length() > 32) throw unprocessable("dateFormat", "invalid");
	}

	public static String fromApiTimeFormat(String api) {
		// H24/H12 -> 24h/12h
		if ("H24".equals(api)) return "24h";
		if ("H12".equals(api)) return "12h";
		throw unprocessable("timeFormat", "not_allowed");
	}

	public static String toApiTimeFormat(String db) {
		if ("24h".equals(db)) return "H24";
		if ("12h".equals(db)) return "H12";
		return "H24";
	}

	public static void validateThemeId(String themeId) {
		if (themeId == null || !THEME.contains(themeId)) throw unprocessable("themeId", "not_found");
	}

	public static void validateEditScope(String v) {
		if (v == null || !EDIT_SC.contains(v)) throw unprocessable("defaultEditorEditScope", "not_allowed");
	}

	public static void validateDeleteScope(String v) {
		if (v == null || !DEL_SC.contains(v)) throw unprocessable("defaultEditorDeleteScope", "not_allowed");
	}

	public static void validateCategoryOp(CategoryDto op) {
		if (op.getOp() == null) throw unprocessable("op", "required");
		if (!Set.of("add","update","delete").contains(op.getOp())) throw unprocessable("op", "not_allowed");

		if ("add".equals(op.getOp())) {
			if (op.getName() == null || op.getName().isBlank()) throw unprocessable("name", "required");
			if (op.getColor() == null || !HEX.matcher(op.getColor()).matches()) throw unprocessable("color", "invalid_hex");
		}
		if ("update".equals(op.getOp()) || "delete".equals(op.getOp())) {
			if (op.getId() == null || op.getId().isBlank()) throw unprocessable("id", "required");
		}
		if (op.getColor() != null && !HEX.matcher(op.getColor()).matches()) throw unprocessable("color", "invalid_hex");
		if (op.getName() != null && (op.getName().isBlank() || op.getName().length() > 60)) throw unprocessable("name", "invalid");
		if (op.getIcon() != null && op.getIcon().length() > 16) throw unprocessable("icon", "invalid");
	}

	public static ResponseStatusException unauthorized() {
		return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
	}

	public static ResponseStatusException notFound(String resource) {
		return new ResponseStatusException(HttpStatus.NOT_FOUND, resource + " not found");
	}

	public static ResponseStatusException forbidden(String field, String reason) {
		return new ResponseStatusException(HttpStatus.FORBIDDEN, field + ":" + reason);
	}

	public static ResponseStatusException badRequest(String field, String reason) {
		return new ResponseStatusException(HttpStatus.BAD_REQUEST, field + ":" + reason);
	}

	public static ResponseStatusException unprocessable(String field, String reason) {
		return new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, field + ":" + reason);
	}

	public static ResponseStatusException conflict(String code, String message) {
		return new ResponseStatusException(HttpStatus.CONFLICT, code + ":" + message);
	}
}
