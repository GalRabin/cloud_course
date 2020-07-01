/* Create records table */
CREATE EXTERNAL TABLE records (
  `LicensePlate` string,
  `Sensor` int,
  `Time` string
)
ROW FORMAT
SERDE 'org.apache.hadoop.hive.serde2.avro.AvroSerDe'
WITH SERDEPROPERTIES ('avro.schema.literal' = '
{"namespace": "example.avro",
  "type": "record",
  "name": "Records",
  "fields": [
    {"name": "LicensePlate", "type": "string"},
    {"name": "Sensor",  "type": "int"},
    {"name": "Time", "type": "string"}
  ]
}
')
STORED AS AVRO
LOCATION 's3://idc-ex2/records/';

/* Create sensors table */
CREATE EXTERNAL TABLE sensors (
  `Sensor` int,
  `Pricing` float
)
ROW FORMAT
SERDE 'org.apache.hadoop.hive.serde2.avro.AvroSerDe'
WITH SERDEPROPERTIES ('avro.schema.literal' = '
{"namespace": "example.avro",
  "type": "record",
  "name": "Sensors",
  "fields": [
    {"name": "Sensor", "type": "int"},
    {"name": "Pricing",  "type": "float"}
  ]
}
')
STORED AS AVRO
LOCATION 's3://idc-ex2/sensors/';


/* Generate sensors report */
WITH ch AS (
  SELECT 
  r.licenseplate as licenseplate,
  sensor as sensor,
  COUNT(r.sensor) as tolls,
  date_format(date_parse(r.time, '%Y-%m-%d %h:%i:%i'), '%M') as month,
  date_format(date_parse(r.time, '%Y-%m-%d %h:%i:%i'), '%Y') as year
  FROM records r
  GROUP BY r.licenseplate, r.sensor, date_format(date_parse(r.time, '%Y-%m-%d %h:%i:%i'), '%M'), date_format(date_parse(r.time, '%Y-%m-%d %h:%i:%i'), '%Y')
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
WHERE "License plate"='YUYRB78292';
