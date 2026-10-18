package com.tundra.tundraxr.data

import org.json.JSONObject

// The Tundra brain's chart and table events, as the website gets them (shared by both clients).

internal fun parseChart(c: JSONObject): Chart? = runCatching {
    val spec = c.getJSONObject("spec")
    val series = spec.getJSONArray("series")
    val points = c.getJSONArray("points")
    Chart(
        id = c.optString("id"),
        type = when (spec.optString("type")) {
            "line" -> ChartType.Line
            "area" -> ChartType.Area
            "pie" -> ChartType.Pie
            "scatter" -> ChartType.Scatter
            else -> ChartType.Bar
        },
        title = spec.optString("title"),
        caption = spec.optString("caption"),
        xLabel = spec.optJSONObject("x")?.optString("label").orEmpty(),
        yLabel = spec.optJSONObject("y")?.optString("label").orEmpty(),
        unit = spec.optJSONObject("y")?.optString("unit").orEmpty().takeIf { it != "none" }.orEmpty(),
        series = (0 until series.length()).map { series.getJSONObject(it).optString("label") },
        stacked = spec.optBoolean("stacked"),
        points = (0 until points.length()).map { i ->
            val p = points.getJSONObject(i)
            val v = p.getJSONArray("values")
            ChartPoint(p.get("x").toString(), (0 until v.length()).map { if (v.isNull(it)) null else v.getDouble(it).toFloat() })
        },
        illustrative = spec.optBoolean("illustrative"),
    )
}.getOrNull()

internal fun parseTable(t: JSONObject): DataTable {
    val cols = t.getJSONArray("columns")
    val rows = t.getJSONArray("rows")
    return DataTable(
        name = t.optString("dataset"),
        columns = (0 until cols.length()).map { cols.get(it).let { c -> (c as? JSONObject)?.optString("label") ?: c.toString() } },
        rows = (0 until rows.length()).map { r -> rows.getJSONArray(r).let { row -> (0 until row.length()).map { if (row.isNull(it)) "" else row.get(it).toString() } } },
        rowCount = t.optInt("row_count", rows.length()),
        truncated = t.optBoolean("truncated"),
    )
}
