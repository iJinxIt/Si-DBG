#include <stdint.h>

extern uint32_t _estack, _sidata, _sdata, _edata, _sbss, _ebss;
extern int main(void);

void Reset_Handler(void);
void Default_Handler(void) { for (;;); }

__attribute__((section(".isr_vector"), used))
const void *vector_table[] = {
    &_estack,
    Reset_Handler,
    Default_Handler,
    Default_Handler,
};

void Reset_Handler(void)
{
    uint32_t *src = &_sidata, *dst = &_sdata;
    
    // Copy from .data
    while (dst < &_edata) {
        *dst++ = *src++;
    }

    for (dst = &_sbss; dst < &_ebss;) {
        *dst++ = 0;
    }

    main();
    for(;;);
}