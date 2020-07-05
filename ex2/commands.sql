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
