//Libraries

#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <elapsedMillis.h>
#include <OneWire.h>
#include <DallasTemperature.h>
//Reading pin
#define ONE_WIRE_BUS D4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);

char temperatureString[6];
//send data interval
elapsedMillis timeElapsed;
unsigned int interval = 10000;
//create webserver
ESP8266WebServer server;

bool manage = false;

//Output pins
uint8_t pin_led1 = 12;
uint8_t pin_led2 = 15;
uint8_t pin_led3 = 4;
 
void setup() {
  //Set output pins
  pinMode(pin_led1,OUTPUT);
  pinMode(pin_led2,OUTPUT);
  pinMode(pin_led3,OUTPUT);

  //webserver
  Serial.begin(115200); 
  //casa
  //WiFi.begin("MOVISTAR_2F78", "iACrNKmJ9Wptg44tmtmm");
  //skylab
  WiFi.begin("skylabCoders", "skylabRocks");

  while (WiFi.status() != WL_CONNECTED) {  
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }

  Serial.println("");
  Serial.print("IP Address: ");
  Serial.print(WiFi.localIP());
  //base endpoint
  server.on("/",[](){server.send(200,"text/plain","Arduino Controller by Alex GB");});
  //output endpoints
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/12/on",toggle1on);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/12/off",toggle1off);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/15/on",toggle2on);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/15/off",toggle2off);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/4/on",toggle3on);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/4/off",toggle3off);
  //data endpoints
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/on",manageOn);
  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/off",manageOff);
  server.begin();
 
}

void loop()
{
   server.handleClient();

   if (manage) {
    if (timeElapsed > interval) 
     {
   float temperature = getTemperature();
   StaticJsonBuffer<300> JSONbuffer;   //Declaring static JSON buffer
   JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
   JSONencoder["value"] = temperature;
   char json[300];
   JSONencoder.prettyPrintTo(json, sizeof(json));
   Serial.println(json);
  
   HTTPClient http;
   //casa
   //http.begin("http://192.168.1.35:5000/api/users/5b2a3bae65651b3bb801af79/arduinos/5b2a3bc765651b3bb801af7a/data");
   //skylab
   http.begin("http://192.168.0.46:5000/api/users/5b2bd1ca48392a3968e37bbc/arduinos/5b2bd28648392a3968e37bbd/data");

   http.addHeader("Content-Type", "application/json");
   int httpCode = http.POST(json);
   
   String payload = http.getString(); 
   Serial.print("POST payload: "); 
   Serial.println(payload);
 
   Serial.println(httpCode); 
   Serial.println(payload);   
   http.end();
   timeElapsed = 0;
     }
   
   }
}
//reading control
void manageOn() 
{
  manage = true;
   server.sendHeader("Access-Control-Allow-Origin","*");
    server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"on\"}");
}

void manageOff()
{
  manage = false;
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"off\"}");
  }

float getTemperature() {
  float temp;
  DS18B20.requestTemperatures();
  temp = DS18B20.getTempCByIndex(0);
  return temp;
}

//output control
void toggle1on()
{
  digitalWrite(pin_led1,HIGH);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"1-on\"}");
}
void toggle1off()
{
  digitalWrite(pin_led1,LOW);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"1-off\"}");
}

void toggle2on()
{
  digitalWrite(pin_led2,HIGH);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"2-on\"}");
}
void toggle2off()
{
  digitalWrite(pin_led2,LOW);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"2-off\"}");
}
void toggle3on()
{
  digitalWrite(pin_led3,HIGH);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"3-on\"}");
}
void toggle3off()
{
  digitalWrite(pin_led3,LOW);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"3-off\"}");
}