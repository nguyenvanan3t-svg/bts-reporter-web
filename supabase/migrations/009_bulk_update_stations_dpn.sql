CREATE OR REPLACE FUNCTION update_stations_dpn(
    p_updates JSONB
)
RETURNS VOID
LANGUAGE SQL
AS $$
    UPDATE stations AS s
    SET
        has_dpn = u.has_dpn,
        updated_at = NOW()
    FROM (
        SELECT
            (item->>'station_id')::UUID AS station_id,
            (item->>'has_dpn')::BOOLEAN AS has_dpn
        FROM jsonb_array_elements(p_updates) AS item
    ) AS u
    WHERE s.id = u.station_id;
$$;