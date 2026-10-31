#include <stdint.h>

#define REG(addr) (*(volatile uint32_t *)(addr))

// RCC
#define RCC_IOPENR REG(0x40021000UL + 0x34)

// GPIO-Ports
#define GPIOA_BASE 0x50000000UL
#define GPIOB_BASE 0x50000400UL

// General
#define LED_PORT_BASE   GPIOA_BASE
#define LED_RCC_BIT     (1U << 0) //0 = GPIOA, 1 = GPIOB
#define LED_PIN         12

#define GPIO_MODER(b)   REG((b) + 0x00)
#define GPIO_ODR(b)     REG((b) + 0x14)

static void delay(volatile uint32_t n)
{
    while (n--) {__asm__ volatile ("nop");}
}

int main(void)
{
    RCC_IOPENR |= LED_RCC_BIT;
    (void)RCC_IOPENR;

    GPIO_MODER(LED_PORT_BASE) &= ~(3U << (LED_PIN * 2));
    GPIO_MODER(LED_PORT_BASE) |=  (1U << (LED_PIN * 2));

    for (;;) {
        GPIO_ODR(LED_PORT_BASE) ^= (1U << LED_PIN);
        delay(500000);
    }
}