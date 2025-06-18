-- Check table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_schema = 'public'
    AND table_name IN (
        'profiles',
        'organizations',
        'timeline_entries',
        'verifications',
        'jobs',
        'applications',
        'surveys',
        'survey_responses'
    )
ORDER BY 
    table_name,
    ordinal_position; 