CREATE OR REPLACE FUNCTION update_stations_from_excel(
    p_updates JSONB
)
RETURNS VOID
LANGUAGE SQL
AS $$
    UPDATE stations AS s
    SET
        address = u.address,
        excel_source = u.excel_source,
        updated_at = NOW(),
        is_removed = false
    FROM (
        SELECT
            (item->>'station_id')::UUID AS station_id,
            item->>'address' AS address,
            item->>'excel_source' AS excel_source
        FROM jsonb_array_elements(p_updates) AS item
    ) AS u
    WHERE s.id = u.station_id;
$$;