-- Create records table
CREATE EXTERNAL TABLE IF NOT EXISTS records (
  `LicensePlate` string,
  `Sensor` int,
  `Time` string
)
STORED AS PARQUET
LOCATION 's3://idc-ex2/records/'
tblproperties ("parquet.compress"="gzip")


-- Create sensors table
CREATE EXTERNAL TABLE IF NOT EXISTS sensors (
  `Sensor` int,
  `Pricing` double
)
STORED AS PARQUET
LOCATION 's3://idc-ex2/sensors/'
tblproperties ("parquet.compress"="gzip")

-- Generate mothly report
-- Choosing LicensePlate as first column
  SELECT LicensePlate as "License plate",
-- Total cost calculation based on grouping by License Plate, Month, Year with same values
  SUM(Pricing) as "Total Cost",
-- Month columnt
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%m') AS "Month",
-- Year column
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%Y') AS "Year",
-- Number of tolls based on grouping by License Plate, Month, Year with same values
  count(*) as "Number of tolls"
  FROM records
-- Joining sensors price to each recode for allowing calculation
  JOIN sensors ON records.Sensor=sensors.Sensor
-- Group rules as specified above
  GROUP BY LicensePlate,
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%Y'),
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%m')

-- Generate validation value
WITH report AS (
  SELECT LicensePlate as "License plate",
  SUM(Pricing) as "Total Cost",
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%m') AS "Month",
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%Y') AS "Year",
  count(*) as "Number of tolls"
  FROM records
  JOIN sensors ON records.Sensor=sensors.Sensor
  GROUP BY LicensePlate,
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%Y'),
  DATE_FORMAT(date_parse(Time,'%Y-%m-%d %h:%i:%s'),'%m')
  )

select *
FROM report
WHERE "License plate"='YUYRB78292';

