/* Create records table */
CREATE EXTERNAL TABLE `records`(
  `licenseplate` string COMMENT 'from deserializer', 
  `sensor` int COMMENT 'from deserializer', 
  `time` date COMMENT 'from deserializer')
ROW FORMAT SERDE 
  'org.openx.data.jsonserde.JsonSerDe' 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.IgnoreKeyTextOutputFormat'
LOCATION
  's3://y20s2-ex2/records'
TBLPROPERTIES (
  'has_encrypted_data'='false', 
  'transient_lastDdlTime'='1593339634')

/* Create sensors table */
CREATE EXTERNAL TABLE `sensors`(
  `sensor` int, 
  `pricing` float)
ROW FORMAT DELIMITED 
  FIELDS TERMINATED BY ',' 
STORED AS INPUTFORMAT 
  'org.apache.hadoop.mapred.TextInputFormat' 
OUTPUTFORMAT 
  'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION
  's3://y20s2-ex2/sensors'
TBLPROPERTIES (
  'has_encrypted_data'='false', 
  'transient_lastDdlTime'='1593338062')

/* Generate sensors report */
WITH ch AS (
  SELECT 
  r.licenseplate as licenseplate,
  sensor as sensor,
  COUNT(r.sensor) as tolls,
  date_format(r.time, '%M') as month,
  date_format(r.time, '%Y') as year
  FROM records r
  GROUP BY r.licenseplate, r.sensor, date_format(r.time, '%M'), date_format(r.time, '%Y')
  ),
  tc AS (
    SELECT
    ch.licenseplate as licenseplate,
    ch.sensor AS sensor,
    ch.tolls AS tolls,
    ch.tolls*sensors.pricing AS cost,
    ch.year AS year,
    ch.month AS month
    FROM ch, sensors
    WHERE sensors.sensor=ch.sensor
  ),
  final AS (
    SELECT
    tc.licenseplate as "License plate",
    SUM(tc.cost) as "Total cost",
    tc.month as "Month",
    tc.year as "Year",
    SUM(tc.tolls) as "tolls"
    FROM tc
    GROUP BY tc.licenseplate, tc.month, tc.year
    )
 
  
select *
FROM final
-- WHERE "License plate"='YUYRB78292';
