#include <Arduino.h>



void setup()
{
    Serial.begin(115200);
    while(!Serial){;}
    delay(1000);
    Serial.println("===== webserial test =====");
}

void loop()
{
    constexpr uint16_t kIntervalMs = 1000;
    static uint32_t cnt = 0;
    static uint32_t cur_time = 0;
    static uint32_t prev_time = 0;

    cur_time = millis();
    if((cur_time - prev_time) > kIntervalMs)
    {
        char buf[17];
        sprintf(buf, "Count: %lu", cnt);
        Serial.println(buf);

        cnt++;
        prev_time = cur_time;
    }
}