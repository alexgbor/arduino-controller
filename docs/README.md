# Arduino Controller

Arduino Controller is a full stack project that allows the user control both the inputs and outputs of their arduino/s.

You'll be provided with the instructions to set up your arduino, from there you just need to register in the website to start retrieving (and/or graphing) your arduino data, switching the output pins, etc.

## Getting Started

* What do I need?
* Register
* Basic circuit
* Programming your arduino
* Control Panel


### What do I need?

First of all, you'll need either an Arduino (any model, but Uno is recommended) and wi-fi module ESP8266, or a NodeMCU board (which works as an arduino + wifi module).

After that, depending on what you want to build, you'll need male-male pin cable, resistors, diodes, etc. 

![Arduino Uno](http://cdn-tienda.bricogeek.com/946-thickbox_default/arduino-uno.jpg)

##### Arduino Uno

![ESP8266](https://i.imgur.com/6opMNZi.png)

##### ESP8266 Wi-Fi Module

![NodeMCU](https://images-na.ssl-images-amazon.com/images/I/81U4jvpGnYL._SX522_.jpg)

##### NodeMCU

### Register

As soon as you land in the website, go to REGISTER and fill the form.

If you succeed you'll be redirected to the login page, where you can write down your e-mail and password.

For now you don't need anything else, even though you can complete or edit your profile.

### Basic Circuit

In order to connect your NodeMCU you'll only need to plug in a mini-USB to the PC. In case you use an Arduino+ESP8266 wi-fi module just follow the next schematic:

![Arduino+Wifi Module](http://www.teomaragakis.com/wp-content/uploads/2015/10/uno_esp_connection.png)

After that you can plug in an USB from your Arduino to the PC.

Now you're ready to connect your device to your local router through wi-fi connection, but in case you want to spice up your project I'll give you two examples of Input control and Output control.

#### Input: Temperature sensor (DS18B20)

![NodeMCU with temp sensor](https://raw.githubusercontent.com/mwittig/pimatic-fritzing-sketches/master/esp-pimatic/ESP-ds18b20.png)

#### Output: Two LED (200Ω Resistors)

![NodeMCU with two LED](https://3.bp.blogspot.com/-ol56RgvuUqo/Vx_DRntYr6I/AAAAAAAADpM/ip-VQjYc5g0A8GFfubyzIefM68ATSvzdgCLcB/s1600/Ledstrip01.jpg)

### Programming your arduino

Here comes the hard part, try to follow the main steps and from there just be creative.

First of all, we'll use the Arduino IDE. You can download it for free from the official website.
After that, in order to setup the IDE you can follow the steps in the tutorial attached in the "Utils" section.

Now let's get started with the code.

First of all we'll import some libraries, we do it with the word  ```#include```.

```
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <elapsedMillis.h>
#include <OneWire.h>
#include <DallasTemperature.h>
```

In this example the first three libraries are used to create a webserver in the arduino and manage the WiFi connection with your router.

The forth one is used to create/parse JSON files, ElapsedMillis handles cycle delays and the last two are used for the sensors.

Now, in case you'll use a sensor I recommend to set up the pin where your arduino will start reading the data. DallasTemperature is only recommended for temperature sensors, otherwise you can use a different library or do it manually.

```
#define ONE_WIRE_BUS D4

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
```

Now, in order to create the webserver just write this line of code:

```
ESP8266WebServer server;
```

Lastly you'll need to set up a variable for every output pin that you'll use, in my case I've named them pin_led:

```
uint8_t pin_led1 = 12;
uint8_t pin_led2 = 15;
uint8_t pin_led3 = 4;
```

You can read the number of the pin directly on the board, but you need to write the number associated with it. You can use this table:

![Table of pins](https://i.imgur.com/6e4a0Rz.png)

I've got a few more lines to handle cycles and a boolean for the sensor, but you don't need to use them.

```
elapsedMillis timeElapsed;
unsigned int interval = 10000;

bool manage = false;
```

Now it's time for the setup function. That one must be in every Arduino code, along with the loop function.

In the setup function we'll declare our selected pins as OUTPUT pins, create the connection with the router and create endpoints so your Arduino can be reached from other devices.

```
void setup() {
  pinMode(pin_led1,OUTPUT);
  pinMode(pin_led2,OUTPUT);
  pinMode(pin_led3,OUTPUT);

  //webserver
  Serial.begin(115200); 
 
  WiFi.begin("ssid", "password");

  while (WiFi.status() != WL_CONNECTED) {  
 
    delay(500);
    Serial.println("Waiting for connection");
 
  }

  Serial.println("");
  Serial.print("IP Address: ");
  Serial.print(WiFi.localIP());

  server.on("/",[](){server.send(200,"text/plain","Hello from the webserver");});

  server.on("/5b2bd1ca48392a3968e37bbc/5b2bd28648392a3968e37bbd/pin/12/on",function);
  
  server.begin();
 
}
```

We've set an endpoint at ```localhost/<userId>/<ArduinoId>/on``` that, when called with any method will trigger a function. We may use another one that ends in /off .

Now it's time for the loop function.

```
void loop()
{
   server.handleClient();

   if (manage) {
    if (timeElapsed > interval) 
     {
   float temperature = getTemperature();
   StaticJsonBuffer<300> JSONbuffer;   

   JsonObject& JSONencoder = JSONbuffer.createObject(); 
 
   JSONencoder["value"] = temperature;
   char json[300];
   JSONencoder.prettyPrintTo(json, sizeof(json));
   Serial.println(json);
  
   HTTPClient http;

   http.begin("apiurl");

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
```
The method handleClient just reads the calls/requests to the webserver, it must be there no matter what.

After that, in case my boolean manage is true (which we'll see in a moment) and the cycle time condition is fulfilled, we'll enter a loop. That conditional is completely optional.

The next two lines just call an external function to retrieve the temperature value from the sensor and store it in a variable.

After that we'll build a JSON object, that will be sent later.

The only line that you need to edit from the JSON block is ```JSONencoder["value"] = temperature;``` where value and temperature can be any "key" and "value" pair. You can add as many as you want.

Then I created the Http request to an external api, where I'll send the previous JSON and add some Headers. After that we need to call http.end();.

The api url must be: ```http://<arduinocontrollerwebsite>/api/users/<userId>/arduinos/<arduinoId>/data```

The Serial methods are used for monitoring and can be skipped.

Lastly, the functions that will be called inside other functions or when the endpoints are reached.

For the sensor:
```
void manageOn() 
{
  manage = true;
   server.sendHeader("Access-Control-Allow-Origin","*");
    server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"on\"}");
}
```

It simply changes the manage variable to true and replies with CORS headers and a JSON object.

For the off function it's the same changing the variable to false.

An example of output function, for example the LED:

```
void toggle1on()
{
  digitalWrite(pin_led1,HIGH);
  server.sendHeader("Access-Control-Allow-Origin","*");
  server.sendHeader("Access-Control-Allow-Credentials", "true");
    server.sendHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    server.sendHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  server.send(200,"application/json","{\"stat\": \"1-on\"}");
}
```

The only difference with the sensor is that we set the output as HIGH to give voltage to that pin, or LOW to stop it.

And that's all you need to get started, it's hard the first time but you'll feel how simple it is after a few tries.

### Control Panel

Congratulations, it's time for the fun part. 
In the Arduino IDE press Ctrl+Shift+M or open the Serial Monitor Manually.

You should see the Arduino IP in the screen, write it down. In case you don't see it, push the Reset button in your device.

In the Control Panel of the website, go to "Add Arduino" and use the IP you've just seen in the Serial Monitor. Port isn't that important now, but it will be in the next version of the website, use the port you want. Hit add.

Now go to "Arduino List" and retrieve a list of your arduinos, then select the one you've just added. Now go to your Arduino IDE and fill the User ID and Arduino ID gaps.

After that you'll be able to send data to our database (and graph it automatically), stop it and control the outputs of any pin in the respective tab. You'll also be able to remove your data, arduino or retrieve all the data in a .csv file.

Enjoy!



## Utils

Please read [this article](http://www.instructables.com/id/Quick-Start-to-Nodemcu-ESP8266-on-Arduino-IDE/) for details on how to setup the Arduino IDE for NodeMCU or Arduino+ESP8266.

For exported .csv, in case you need to format the data follow the instructions of the answer [here](https://stackoverflow.com/questions/44396943/generate-a-csv-file-from-a-javascript-array-of-objects).


## Authors

* **Alex Gómez Borrego** - *Full stack project* - [alexgbor](https://github.com/alexgbor)

Special thanks to the Skylab Coders family.

#### Version 1.0