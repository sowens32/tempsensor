// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

// REQUIRES the following Arduino libraries:
// - DHT Sensor Library: https://github.com/adafruit/DHT-sensor-library
// - Adafruit Unified Sensor Lib: https://github.com/adafruit/Adafruit_Sensor

#include "DHT.h"

#define DHTPIN 2    
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

//float prevH = 0;
float H = 0;

//float prevF = 0;
float F = 0;

//float prevC = 0;
float C = 0;

String response = "";

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  H = dht.readHumidity();
  // Read temperature as Celsius (the default)
  C = dht.readTemperature();
  // Read temperature as Fahrenheit (isFahrenheit = true)
  F = dht.readTemperature(true);

  response.concat("{\n\"date\":0,\n\"humidity\":");
  response.concat(H);
  response.concat(",\n\"f\":");
  response.concat(F);
  response.concat(",\n\"c\":");
  response.concat(C);
  response.concat("\n}");
  Serial.println(response);
  response = "";
  //Serial.println(C);
  //Serial.println("x");
  delay(5000);
  
}
