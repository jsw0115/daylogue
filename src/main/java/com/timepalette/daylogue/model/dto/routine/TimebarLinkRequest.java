package com.timepalette.daylogue.model.dto.routine;

public record TimebarLinkRequest (
		Boolean enabled,
		Boolean rollbackOnUncheck,
		String conflictPolicy // warn|allow|merge
) {}
