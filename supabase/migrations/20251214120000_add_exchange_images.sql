-- Add images column to exchanges table for storing extracted video frames
ALTER TABLE exchanges ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add comment for documentation
COMMENT ON COLUMN exchanges.images IS 'Array of base64-encoded images automatically extracted from the video';
