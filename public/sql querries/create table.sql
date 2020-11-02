-- Drop the table if it already exists
IF OBJECT_ID('dbo.Announcements', 'U') IS NOT NULL
DROP TABLE dbo.Announcements
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Announcements
(
    AnnouncementsId INT NOT NULL PRIMARY KEY, -- primary key column
    Title [NVARCHAR](50) NOT NULL,
    Announcement [NVARCHAR](500) NOT NULL
);
GO

